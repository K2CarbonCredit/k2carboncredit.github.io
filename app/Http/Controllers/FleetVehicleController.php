<?php

namespace App\Http\Controllers;

use App\Models\AssetType;
use App\Models\AssetSubType;
use App\Models\FleetVehicle;
use App\Models\VehicleMake;
use App\Models\VehicleModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class FleetVehicleController extends Controller
{
    public function index()
    {
        $vehicles = FleetVehicle::with(['assetType', 'assetSubType', 'make', 'model'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Fleet/Vehicles/Index', [
            'vehicles' => $vehicles
        ]);
    }

    public function create()
    {
        $assetTypes = AssetType::where('status', 'active')->get();
        $makes = VehicleMake::where('status', 'active')->get();
        
        return Inertia::render('Admin/Fleet/Vehicles/Create', [
            'assetTypes' => $assetTypes,
            'makes' => $makes,
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
            'asset_subtype_id' => 'required|exists:asset_subtypes,id',
            'make_id' => 'required|exists:vehicle_makes,id',
            'model_id' => 'required|exists:vehicle_models,id',
            'fuel_type' => 'required|in:diesel,petrol,ev',
            'chassis_number' => 'required|string|unique:fleet_vehicles',
            'registration_number' => 'required|string|unique:fleet_vehicles',
            'telemetry_provider' => 'required_if:fuel_type,ev',
            'tags' => 'nullable|array',
            'photos.*' => 'required|image|max:2048',
        ]);

        // Handle photo uploads
        $photos = [];
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $type => $photo) {
                $path = $photo->store('fleet-vehicles', 'public');
                $photos[$type] = $path;
            }
        }

        $vehicle = FleetVehicle::create([
            ...$validated,
            'photos' => $photos,
            'onboarding_status' => [
                'information' => true,
                'photos' => !empty($photos),
                'telemetry' => false,
                'manual_verification' => false
            ]
        ]);

        return redirect()->route('admin.fleet.vehicles.index')
            ->with('success', 'Vehicle added successfully.');
    }

    public function edit(FleetVehicle $vehicle)
    {
        $assetTypes = AssetType::where('status', 'active')->get();
        $assetSubtypes = AssetSubType::where('asset_type_id', $vehicle->asset_type_id)
            ->where('status', 'active')
            ->get();
        $makes = VehicleMake::where('status', 'active')->get();
        $models = VehicleModel::where('make_id', $vehicle->make_id)
            ->where('status', 'active')
            ->get();

        return Inertia::render('Admin/Fleet/Vehicles/Edit', [
            'vehicle' => $vehicle,
            'assetTypes' => $assetTypes,
            'assetSubtypes' => $assetSubtypes,
            'makes' => $makes,
            'models' => $models,
        ]);
    }

    public function update(Request $request, FleetVehicle $vehicle)
    {
        $validated = $request->validate([
            'asset_type_id' => 'required|exists:asset_types,id',
            'asset_subtype_id' => 'required|exists:asset_subtypes,id',
            'make_id' => 'required|exists:vehicle_makes,id',
            'model_id' => 'required|exists:vehicle_models,id',
            'fuel_type' => 'required|in:diesel,petrol,ev',
            'chassis_number' => 'required|string|unique:fleet_vehicles,chassis_number,' . $vehicle->id,
            'registration_number' => 'required|string|unique:fleet_vehicles,registration_number,' . $vehicle->id,
            'telemetry_provider' => 'required_if:fuel_type,ev',
            'tags' => 'nullable|array',
            'photos.*' => 'sometimes|image|max:2048',
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

        $vehicle->update([
            ...$validated,
            'photos' => $photos,
            'onboarding_status' => [
                ...$vehicle->onboarding_status,
                'photos' => !empty($photos)
            ]
        ]);

        return redirect()->route('admin.fleet.vehicles.index')
            ->with('success', 'Vehicle updated successfully.');
    }

    public function updateOnboardingStatus(Request $request, FleetVehicle $vehicle)
    {
        $validated = $request->validate([
            'status' => 'required|in:telemetry,manual_verification',
            'value' => 'required|boolean'
        ]);

        $vehicle->update([
            'onboarding_status' => [
                ...$vehicle->onboarding_status,
                $validated['status'] => $validated['value']
            ]
        ]);

        return back()->with('success', 'Onboarding status updated successfully.');
    }

    public function destroy(FleetVehicle $vehicle)
    {
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
