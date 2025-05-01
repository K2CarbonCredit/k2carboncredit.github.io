<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Models\Fleet;
use App\Models\FleetVehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FleetController extends Controller
{
    /**
     * Get the company ID for the current user
     */
    private function getCompanyId()
    {
        $user = Auth::user();
        
        // If user is impersonating a company
        if (session()->has('impersonating_company')) {
            return session('impersonating_company');
        }
        
        // Otherwise, return the user's company ID
        return $user->company_id;
    }
    
    /**
     * Display a listing of the fleets.
     */
    public function index()
    {
        $companyId = $this->getCompanyId();
        
        $fleets = Fleet::where('company_id', $companyId)
            ->withCount('vehicles')
            ->latest()
            ->paginate(10);
            
        return Inertia::render('Company/Fleet/FleetIndex', [
            'fleets' => $fleets
        ]);
    }
    
    /**
     * Show the form for creating a new fleet.
     */
    public function create()
    {
        return Inertia::render('Company/Fleet/FleetCreate');
    }
    
    /**
     * Store a newly created fleet in storage.
     */
    public function store(Request $request)
    {
        $companyId = $this->getCompanyId();
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'manager_name' => 'nullable|string|max:255',
            'manager_email' => 'nullable|email|max:255',
            'manager_phone' => 'nullable|string|max:20',
            'location' => 'nullable|string|max:255',
            'status' => 'nullable|in:active,inactive',
        ]);
        
        // Create the fleet
        Fleet::create([
            'company_id' => $companyId,
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'manager_name' => $validated['manager_name'] ?? null,
            'manager_email' => $validated['manager_email'] ?? null,
            'manager_phone' => $validated['manager_phone'] ?? null,
            'location' => $validated['location'] ?? null,
            'status' => $validated['status'] ?? 'active',
        ]);
        
        return redirect()->route('company.fleets.index')
            ->with('success', 'Fleet created successfully.');
    }
    
    /**
     * Display the specified fleet.
     */
    public function show(Fleet $fleet)
    {
        $companyId = $this->getCompanyId();
        
        // Ensure the fleet belongs to the user's company
        if ($fleet->company_id != $companyId) {
            abort(403, 'Unauthorized action.');
        }
        
        // Load the fleet with its vehicles
        $fleet->load(['vehicles' => function($query) {
            $query->with(['make', 'model', 'assetType', 'assetSubType']);
        }]);
        
        return Inertia::render('Company/Fleet/FleetShow', [
            'fleet' => $fleet
        ]);
    }
    
    /**
     * Show the form for editing the specified fleet.
     */
    public function edit(Fleet $fleet)
    {
        $companyId = $this->getCompanyId();
        
        // Ensure the fleet belongs to the user's company
        if ($fleet->company_id != $companyId) {
            abort(403, 'Unauthorized action.');
        }
        
        return Inertia::render('Company/Fleet/FleetEdit', [
            'fleet' => $fleet
        ]);
    }
    
    /**
     * Update the specified fleet in storage.
     */
    public function update(Request $request, Fleet $fleet)
    {
        $companyId = $this->getCompanyId();
        
        // Ensure the fleet belongs to the user's company
        if ($fleet->company_id != $companyId) {
            abort(403, 'Unauthorized action.');
        }
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'manager_name' => 'nullable|string|max:255',
            'manager_email' => 'nullable|email|max:255',
            'manager_phone' => 'nullable|string|max:20',
            'location' => 'nullable|string|max:255',
            'status' => 'nullable|in:active,inactive',
        ]);
        
        // Update the fleet
        $fleet->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'manager_name' => $validated['manager_name'] ?? null,
            'manager_email' => $validated['manager_email'] ?? null,
            'manager_phone' => $validated['manager_phone'] ?? null,
            'location' => $validated['location'] ?? null,
            'status' => $validated['status'] ?? 'active',
        ]);
        
        return redirect()->route('company.fleets.index')
            ->with('success', 'Fleet updated successfully.');
    }
    
    /**
     * Remove the specified fleet from storage.
     */
    public function destroy(Fleet $fleet)
    {
        $companyId = $this->getCompanyId();
        
        // Ensure the fleet belongs to the user's company
        if ($fleet->company_id != $companyId) {
            abort(403, 'Unauthorized action.');
        }
        
        // Check if the fleet has any vehicles
        $vehicleCount = $fleet->vehicles()->count();
        if ($vehicleCount > 0) {
            return redirect()->back()
                ->with('error', "Cannot delete fleet. It contains {$vehicleCount} vehicles. Please reassign or delete the vehicles first.");
        }
        
        $fleet->delete();
        
        return redirect()->route('company.fleets.index')
            ->with('success', 'Fleet deleted successfully.');
    }
    
    /**
     * Assign vehicles to a fleet.
     */
    public function assignVehicles(Request $request, Fleet $fleet)
    {
        $companyId = $this->getCompanyId();
        
        // Ensure the fleet belongs to the user's company
        if ($fleet->company_id != $companyId) {
            abort(403, 'Unauthorized action.');
        }
        
        $validated = $request->validate([
            'vehicle_ids' => 'required|array',
            'vehicle_ids.*' => 'exists:fleet_vehicles,id'
        ]);
        
        // Update the vehicles to belong to this fleet
        FleetVehicle::whereIn('id', $validated['vehicle_ids'])
            ->where('company_id', $companyId)
            ->update(['fleet_id' => $fleet->id]);
        
        return redirect()->back()
            ->with('success', count($validated['vehicle_ids']) . ' vehicles assigned to fleet successfully.');
    }
    
    /**
     * Remove vehicles from a fleet.
     */
    public function removeVehicles(Request $request, Fleet $fleet)
    {
        $companyId = $this->getCompanyId();
        
        // Ensure the fleet belongs to the user's company
        if ($fleet->company_id != $companyId) {
            abort(403, 'Unauthorized action.');
        }
        
        $validated = $request->validate([
            'vehicle_ids' => 'required|array',
            'vehicle_ids.*' => 'exists:fleet_vehicles,id'
        ]);
        
        // Update the vehicles to no longer belong to this fleet
        FleetVehicle::whereIn('id', $validated['vehicle_ids'])
            ->where('company_id', $companyId)
            ->where('fleet_id', $fleet->id)
            ->update(['fleet_id' => null]);
        
        return redirect()->back()
            ->with('success', count($validated['vehicle_ids']) . ' vehicles removed from fleet successfully.');
    }
}
