<?php

namespace App\Http\Controllers;

use App\Models\VehicleMake;
use App\Models\VehicleModel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VehicleModelController extends Controller
{
    public function index()
    {
        $models = VehicleModel::with('make')
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Fleet/Models/Index', [
            'models' => $models
        ]);
    }

    public function create()
    {
        $makes = VehicleMake::where('status', 'active')->get();
        
        return Inertia::render('Admin/Fleet/Models/Create', [
            'makes' => $makes
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'make_id' => 'required|exists:vehicle_makes,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        VehicleModel::create($validated);

        return redirect()->route('admin.fleet.models.index')
            ->with('success', 'Vehicle model created successfully.');
    }

    public function edit(VehicleModel $model)
    {
        $makes = VehicleMake::where('status', 'active')->get();
        
        return Inertia::render('Admin/Fleet/Models/Edit', [
            'model' => $model,
            'makes' => $makes
        ]);
    }

    public function update(Request $request, VehicleModel $model)
    {
        $validated = $request->validate([
            'make_id' => 'required|exists:vehicle_makes,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        $model->update($validated);

        return redirect()->route('admin.fleet.models.index')
            ->with('success', 'Vehicle model updated successfully.');
    }

    public function destroy(VehicleModel $model)
    {
        if ($model->vehicles()->exists()) {
            return back()->with('error', 'Cannot delete model with associated vehicles.');
        }

        $model->delete();

        return back()->with('success', 'Vehicle model deleted successfully.');
    }
}
