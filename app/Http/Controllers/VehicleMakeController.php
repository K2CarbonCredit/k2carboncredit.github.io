<?php

namespace App\Http\Controllers;

use App\Models\VehicleMake;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VehicleMakeController extends Controller
{
    public function index()
    {
        $makes = VehicleMake::withCount('models')
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Fleet/Makes/Index', [
            'makes' => $makes
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Fleet/Makes/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:vehicle_makes,name',
            'description' => 'nullable|string|max:1000',
        ]);

        VehicleMake::create($validated);

        return redirect()->route('admin.fleet.makes.index')
            ->with('success', 'Vehicle make created successfully.');
    }

    public function edit(VehicleMake $make)
    {
        return Inertia::render('Admin/Fleet/Makes/Edit', [
            'make' => $make
        ]);
    }

    public function update(Request $request, VehicleMake $make)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:vehicle_makes,name,' . $make->id,
            'description' => 'nullable|string|max:1000',
        ]);

        $make->update($validated);

        return redirect()->route('admin.fleet.makes.index')
            ->with('success', 'Vehicle make updated successfully.');
    }

    public function destroy(VehicleMake $make)
    {
        if ($make->models()->exists()) {
            return back()->with('error', 'Cannot delete make with associated models.');
        }

        $make->delete();

        return back()->with('success', 'Vehicle make deleted successfully.');
    }
}
