<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Models\AssetType;
use App\Models\AssetSubType;
use App\Models\Fleet;
use App\Models\FleetVehicle;
use App\Models\VehicleMake;
use App\Models\VehicleModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FleetVehicleController extends Controller
{
    private function getCompanyId()
    {
        $companyId = Auth::user()->company_id;

        if (!$companyId && Auth::user()->roles->contains('name', 'super_admin')) {
            $companyId = session()->get('impersonate_company_id');
        }

        return $companyId;
    }

    public function index()
    {
        $companyId = $this->getCompanyId();

        $vehicles = FleetVehicle::with(['assetType', 'assetSubType', 'make', 'model'])
            ->where('company_id', $companyId)
            ->latest()
            ->paginate(10);

        // dd($vehicles);

        return Inertia::render('Company/Fleet/Index', [
            'vehicles' => $vehicles
        ]);
    }

    public function create()
    {
        $companyId = $this->getCompanyId();
        $assetTypes = AssetType::where('status', 'active')->get();
        $makes = VehicleMake::where('status', 'active')->get();
        $fleets = Fleet::where('company_id', $companyId)
            ->where('status', 'active')
            ->get();

        return Inertia::render('Company/Fleet/Create', [
            'assetTypes' => $assetTypes,
            'makes' => $makes,
            'fleets' => $fleets,
        ]);
    }

    public function getSubtypes(Request $request)
    {
        $subtypes = AssetSubType::where('asset_type_id', $request->asset_type_id)
            ->where('status', 'active')
            ->get();

        return response()->json($subtypes);
    }

    public function getModels(Request $request)
    {
        $models = VehicleModel::where('make_id', $request->make_id)
            ->where('status', 'active')
            ->get();

        return response()->json($models);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'asset_type_id' => 'required|exists:asset_types,id',
            'asset_subtype_id' => 'required|exists:asset_sub_types,id',
            'make_id' => 'required|exists:vehicle_makes,id',
            'model_id' => 'required|exists:vehicle_models,id',
            'fuel_type' => 'required|in:diesel,petrol,ev',
            'chassis_number' => 'required|string|unique:fleet_vehicles',
            'registration_number' => 'required|string|unique:fleet_vehicles',
            'telemetry_provider' => 'required_if:fuel_type,ev',
            'fleet_id' => 'nullable|exists:fleets,id',
            'tags' => 'nullable|array',
        ]);

        // Handle photo uploads
        $photos = [];
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $type => $photo) {
                $path = $photo->store('fleet-vehicles', 'public');
                $photos[$type] = $path;
            }
        }

        $companyId = $this->getCompanyId();

        // Ensure we have a company_id
        if (!$companyId) {
            return back()->withErrors(['company_id' => 'No company associated with this user.']);
        }

        $vehicle = FleetVehicle::create([
            ...$validated,
            'company_id' => $companyId,
            'photos' => $photos,
            'onboarding_status' => [
                'information' => true,
                'photos' => !empty($photos),
                'telemetry' => false,
                'manual_verification' => false
            ],
            'status' => 'pending'
        ]);

        return redirect()->route('company.fleet.index')
            ->with('success', 'Vehicle added successfully.');
    }

    public function edit(FleetVehicle $vehicle)
    {
        // Ensure the vehicle belongs to the company
        if ($vehicle->company_id !== $this->getCompanyId()) {
            abort(403);
        }

        $companyId = $this->getCompanyId();
        $assetTypes = AssetType::where('status', 'active')->get();
        $assetSubtypes = AssetSubType::where('asset_type_id', $vehicle->asset_type_id)
            ->where('status', 'active')
            ->get();
        $makes = VehicleMake::where('status', 'active')->get();
        $models = VehicleModel::where('make_id', $vehicle->make_id)
            ->where('status', 'active')
            ->get();
        $fleets = Fleet::where('company_id', $companyId)
            ->where('status', 'active')
            ->get();

        return Inertia::render('Company/Fleet/Edit', [
            'vehicle' => $vehicle,
            'assetTypes' => $assetTypes,
            'assetSubtypes' => $assetSubtypes,
            'makes' => $makes,
            'models' => $models,
            'fleets' => $fleets,
        ]);
    }

    public function update(Request $request, FleetVehicle $vehicle)
    {
        // Ensure the vehicle belongs to the company
        if ($vehicle->company_id !== $this->getCompanyId()) {
            abort(403);
        }

        // Parse onboarding_status if it's a JSON string
        if ($request->has('onboarding_status') && is_string($request->onboarding_status)) {
            try {
                $request->merge(['onboarding_status' => json_decode($request->onboarding_status, true)]);
            } catch (\Exception $e) {
                // If JSON decoding fails, keep the original value
            }
        }

        // Handle the case when the request is empty (happens with some form submissions)
        if (empty($request->all()) && $request->isMethod('PUT')) {
            return back()->withErrors(['form' => 'Form submission error. Please try again.']);
        }

        $validated = $request->validate([
            'asset_type_id' => 'required|exists:asset_types,id',
            'asset_subtype_id' => 'required|exists:asset_sub_types,id',
            'make_id' => 'required|exists:vehicle_makes,id',
            'model_id' => 'required|exists:vehicle_models,id',
            'fuel_type' => 'required|in:diesel,petrol,ev',
            'chassis_number' => 'required|string|unique:fleet_vehicles,chassis_number,' . $vehicle->id,
            'registration_number' => 'required|string|unique:fleet_vehicles,registration_number,' . $vehicle->id,
            'telemetry_provider' => 'required_if:fuel_type,ev',
            'fleet_id' => 'nullable|exists:fleets,id',
            'tags' => 'nullable|array',
            'onboarding_status' => 'nullable',
        ]);

        // Handle photo uploads
        $photos = $vehicle->photos ?? [];
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $type => $photo) {
                // Delete old photo if exists
                if (isset($photos[$type])) {
                    Storage::disk('public')->delete($photos[$type]);
                }
                $path = $photo->store('fleet-vehicles', 'public');
                $photos[$type] = $path;
            }
        }

        // Ensure onboarding_status is an array
        $onboardingStatus = $validated['onboarding_status'] ?? $vehicle->onboarding_status ?? [
            'information' => false,
            'photos' => false,
            'telemetry' => false,
            'manual_verification' => false
        ];

        // If photos were uploaded, update the photos status
        if ($request->hasFile('photos')) {
            $onboardingStatus['photos'] = true;
        }

        // Remove onboarding_status from validated data to avoid double assignment
        unset($validated['onboarding_status']);

        $vehicle->update([
            ...$validated,
            'photos' => $photos,
            'onboarding_status' => $onboardingStatus
        ]);

        return redirect()->route('company.fleet.index')
            ->with('success', 'Vehicle updated successfully.');
    }

    public function updateOnboardingStatus(Request $request, FleetVehicle $vehicle)
    {
        // Ensure the vehicle belongs to the company
        if ($vehicle->company_id !== $this->getCompanyId()) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => 'required|in:information,photos,telemetry,manual_verification',
            'value' => 'required|boolean'
        ]);

        // Get current onboarding status
        $onboardingStatus = $vehicle->onboarding_status ?? [
            'information' => false,
            'photos' => false,
            'telemetry' => false,
            'manual_verification' => false
        ];

        // Update the specific status
        $onboardingStatus[$validated['status']] = $validated['value'];

        // Update the vehicle with the new onboarding status
        $vehicle->update([
            'onboarding_status' => $onboardingStatus
        ]);

        // If all onboarding steps are complete, update the vehicle status
        if ($onboardingStatus['information'] &&
            $onboardingStatus['photos'] &&
            $onboardingStatus['telemetry'] &&
            $onboardingStatus['manual_verification']) {
            $vehicle->update(['status' => 'active']);
        }

        return back()->with('success', 'Onboarding status updated successfully.');
    }

    public function destroy(FleetVehicle $vehicle)
    {
        // Ensure the vehicle belongs to the company
        if ($vehicle->company_id !== $this->getCompanyId()) {
            abort(403);
        }

        // Delete associated photos
        if (!empty($vehicle->photos)) {
            foreach ($vehicle->photos as $photo) {
                Storage::disk('public')->delete($photo);
            }
        }

        $vehicle->delete();

        return back()->with('success', 'Vehicle deleted successfully.');
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
     * Get vehicle models by make ID for API
     */
    public function getModelsByMake($make)
    {
        $models = VehicleModel::where('make_id', $make)
            ->where('status', 'active')
            ->get();

        return response()->json($models);
    }
}
