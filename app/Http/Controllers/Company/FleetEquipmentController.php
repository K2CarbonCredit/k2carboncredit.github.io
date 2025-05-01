<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Models\AssetSubType;
use App\Models\AssetType;
use App\Models\FleetEquipment;
use App\Models\Manufacturer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FleetEquipmentController extends Controller
{
    /**
     * Get the company ID for the current user
     */
    private function getCompanyId()
    {
        $user = Auth::user();
        
        // If user is a super admin and is impersonating a company
        if (session()->has('impersonating_company')) {
            return session('impersonating_company');
        }
        
        // Otherwise, return the user's company ID
        return $user->company_id;
    }
    
    /**
     * Display a listing of the equipment.
     */
    public function index(Request $request)
    {
        $companyId = $this->getCompanyId();
        
        $equipment = FleetEquipment::with(['assetType', 'assetSubType'])
            ->where('company_id', $companyId)
            ->latest()
            ->paginate(10);
            
        return Inertia::render('Company/Fleet/Equipment/Index', [
            'equipment' => $equipment
        ]);
    }
    
    /**
     * Show the form for creating new equipment.
     */
    public function create()
    {
        $assetTypes = AssetType::where('status', 'active')->get();
        $manufacturers = Manufacturer::where('status', 'active')->get();
        
        return Inertia::render('Company/Fleet/Equipment/Create', [
            'assetTypes' => $assetTypes,
            'manufacturers' => $manufacturers
        ]);
    }
    
    /**
     * Store a newly created equipment in storage.
     */
    public function store(Request $request)
    {
        $companyId = $this->getCompanyId();
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'asset_type_id' => 'required|exists:asset_types,id',
            'asset_sub_type_id' => 'required|exists:asset_sub_types,id',
            'model_number' => 'nullable|string|max:255',
            'serial_number' => 'nullable|string|max:255',
            'manufacturer_id' => 'nullable|exists:manufacturers,id',
            'power_source' => 'nullable|string|max:255',
            'capacity' => 'nullable|numeric',
            'weight' => 'nullable|numeric',
            'dimensions' => 'nullable|array',
            'maintenance_schedule' => 'nullable|array',
            'last_maintenance_date' => 'nullable|date',
            'next_maintenance_date' => 'nullable|date',
            'photos' => 'nullable|array',
            'photos.*' => 'nullable|image|max:2048',
            'notes' => 'nullable|string',
            'status' => 'nullable|in:active,inactive,maintenance,retired',
        ]);
        
        // Handle photo uploads
        $photos = [];
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $type => $photo) {
                $path = $photo->store('equipment_photos', 'public');
                $photos[$type] = $path;
            }
        }
        
        // Set default onboarding status
        $onboardingStatus = [
            'information' => true,
            'photos' => !empty($photos),
            'maintenance' => false,
            'manual_verification' => false
        ];
        
        // Create the equipment
        $equipment = FleetEquipment::create([
            'company_id' => $companyId,
            'asset_type_id' => $validated['asset_type_id'],
            'asset_sub_type_id' => $validated['asset_sub_type_id'],
            'name' => $validated['name'],
            'model_number' => $validated['model_number'] ?? null,
            'serial_number' => $validated['serial_number'] ?? null,
            'manufacturer_id' => $validated['manufacturer_id'] ?? null,
            'power_source' => $validated['power_source'] ?? null,
            'capacity' => $validated['capacity'] ?? null,
            'weight' => $validated['weight'] ?? null,
            'dimensions' => $validated['dimensions'] ?? null,
            'maintenance_schedule' => $validated['maintenance_schedule'] ?? null,
            'last_maintenance_date' => $validated['last_maintenance_date'] ?? null,
            'next_maintenance_date' => $validated['next_maintenance_date'] ?? null,
            'photos' => $photos,
            'onboarding_status' => $onboardingStatus,
            'status' => $validated['status'] ?? 'active',
            'notes' => $validated['notes'] ?? null,
        ]);
        
        return redirect()->route('company.fleet.equipment.index')
            ->with('success', 'Equipment added successfully.');
    }
    
    /**
     * Show the form for editing the specified equipment.
     */
    public function edit(FleetEquipment $equipment)
    {
        $companyId = $this->getCompanyId();
        
        // Ensure the equipment belongs to the user's company
        if ($equipment->company_id != $companyId) {
            abort(403, 'Unauthorized action.');
        }
        
        $assetTypes = AssetType::where('status', 'active')->get();
        $assetSubtypes = AssetSubType::where('asset_type_id', $equipment->asset_type_id)
            ->where('status', 'active')
            ->get();
        $manufacturers = Manufacturer::where('status', 'active')->get();
        
        return Inertia::render('Company/Fleet/Equipment/Edit', [
            'equipment' => $equipment,
            'assetTypes' => $assetTypes,
            'assetSubtypes' => $assetSubtypes,
            'manufacturers' => $manufacturers
        ]);
    }
    
    /**
     * Update the specified equipment in storage.
     */
    public function update(Request $request, FleetEquipment $equipment)
    {
        $companyId = $this->getCompanyId();
        
        // Ensure the equipment belongs to the user's company
        if ($equipment->company_id != $companyId) {
            abort(403, 'Unauthorized action.');
        }
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'asset_type_id' => 'required|exists:asset_types,id',
            'asset_sub_type_id' => 'required|exists:asset_sub_types,id',
            'model_number' => 'nullable|string|max:255',
            'serial_number' => 'nullable|string|max:255',
            'manufacturer_id' => 'nullable|exists:manufacturers,id',
            'power_source' => 'nullable|string|max:255',
            'capacity' => 'nullable|numeric',
            'weight' => 'nullable|numeric',
            'dimensions' => 'nullable|array',
            'maintenance_schedule' => 'nullable|array',
            'last_maintenance_date' => 'nullable|date',
            'next_maintenance_date' => 'nullable|date',
            'photos' => 'nullable|array',
            'photos.*' => 'nullable|image|max:2048',
            'onboarding_status' => 'nullable',
            'notes' => 'nullable|string',
            'status' => 'nullable|in:active,inactive,maintenance,retired',
        ]);
        
        // Parse onboarding_status if it's a JSON string
        if (isset($validated['onboarding_status']) && is_string($validated['onboarding_status'])) {
            try {
                $validated['onboarding_status'] = json_decode($validated['onboarding_status'], true);
            } catch (\Exception $e) {
                // If there's an error parsing the JSON, set it to null
                $validated['onboarding_status'] = null;
            }
        }
        
        // Handle photo uploads
        $photos = $equipment->photos ?? [];
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $type => $photo) {
                $path = $photo->store('equipment_photos', 'public');
                $photos[$type] = $path;
            }
        }
        
        // Set default values for onboarding_status to prevent null errors
        $onboardingStatus = $validated['onboarding_status'] ?? [
            'information' => false,
            'photos' => false,
            'maintenance' => false,
            'manual_verification' => false
        ];
        
        // Remove onboarding_status from validated data to avoid double assignment
        unset($validated['onboarding_status']);
        
        // Update the equipment
        $equipment->update(array_merge($validated, [
            'photos' => $photos,
            'onboarding_status' => $onboardingStatus
        ]));
        
        // If all onboarding steps are complete, set status to active
        if (
            $onboardingStatus['information'] && 
            $onboardingStatus['photos'] && 
            $onboardingStatus['maintenance'] && 
            $onboardingStatus['manual_verification']
        ) {
            $equipment->update(['status' => 'active']);
        }
        
        return redirect()->route('company.fleet.equipment.index')
            ->with('success', 'Equipment updated successfully.');
    }
    
    /**
     * Update the onboarding status of the specified equipment.
     */
    public function updateOnboardingStatus(Request $request, FleetEquipment $equipment)
    {
        $companyId = $this->getCompanyId();
        
        // Ensure the equipment belongs to the user's company
        if ($equipment->company_id != $companyId) {
            abort(403, 'Unauthorized action.');
        }
        
        $validated = $request->validate([
            'information' => 'required|boolean',
            'photos' => 'required|boolean',
            'maintenance' => 'required|boolean',
            'manual_verification' => 'required|boolean',
        ]);
        
        // Get current onboarding status
        $onboardingStatus = $equipment->onboarding_status ?? [];
        
        // Update the specific status
        $onboardingStatus = array_merge($onboardingStatus, $validated);
        
        // Update the equipment
        $equipment->update(['onboarding_status' => $onboardingStatus]);
        
        // If all onboarding steps are complete, set status to active
        if (
            $onboardingStatus['information'] && 
            $onboardingStatus['photos'] && 
            $onboardingStatus['maintenance'] && 
            $onboardingStatus['manual_verification']
        ) {
            $equipment->update(['status' => 'active']);
        }
        
        return redirect()->back()->with('success', 'Onboarding status updated successfully.');
    }
    
    /**
     * Remove the specified equipment from storage.
     */
    public function destroy(FleetEquipment $equipment)
    {
        $companyId = $this->getCompanyId();
        
        // Ensure the equipment belongs to the user's company
        if ($equipment->company_id != $companyId) {
            abort(403, 'Unauthorized action.');
        }
        
        $equipment->delete();
        
        return redirect()->route('company.fleet.equipment.index')
            ->with('success', 'Equipment deleted successfully.');
    }
    
    /**
     * Get asset subtypes by asset type ID for API
     */
    public function getSubtypesByType($type)
    {
        $subtypes = AssetSubType::where('asset_type_id', $type)
            ->where('status', 'active')
            ->get();
        
        return response()->json($subtypes);
    }
    
    /**
     * Get all active manufacturers for API
     */
    public function getManufacturers()
    {
        $manufacturers = Manufacturer::where('status', 'active')
            ->orderBy('name')
            ->get();
        
        return response()->json($manufacturers);
    }
}
