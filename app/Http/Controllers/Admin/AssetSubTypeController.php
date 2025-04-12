<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AssetType;
use App\Models\AssetSubType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssetSubTypeController extends Controller
{
    /**
     * Display a listing of the asset sub-types for a specific asset type.
     */
    public function index(AssetType $type, Request $request)
    {
        $query = $type->subTypes();
        
        // Handle search
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
        }
        
        // Handle status filter
        if ($request->has('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }
        
        // Get paginated results
        $subTypes = $query->orderBy('name')->paginate(10)
                        ->withQueryString();
        
        return Inertia::render('Admin/Assets/SubTypes/Index', [
            'assetType' => $type,
            'subTypes' => $subTypes,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new asset sub-type.
     */
    public function create(AssetType $type)
    {
        return Inertia::render('Admin/Assets/SubTypes/Create', [
            'assetType' => $type,
        ]);
    }

    /**
     * Store a newly created asset sub-type in storage.
     */
    public function store(Request $request, AssetType $type)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) use ($type) {
                    // Check if name is unique within this asset type
                    $exists = AssetSubType::where('asset_type_id', $type->id)
                                        ->where('name', $value)
                                        ->exists();
                    if ($exists) {
                        $fail('The name has already been taken for this asset type.');
                    }
                },
            ],
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ]);

        $type->subTypes()->create($validated);

        return redirect()->route('admin.types.sub-types.index', $type->id)                  ->with('success', 'Asset sub-type created successfully.');
    }

    /**
     * Display the specified asset sub-type.
     */
    public function show(AssetType $type, AssetSubType $subType)
    {
        // Ensure the sub-type belongs to the specified type
        if ($subType->asset_type_id !== $type->id) {
            abort(404);
        }
        
        return Inertia::render('Admin/Assets/SubTypes/Show', [
            'assetType' => $type,
            'subType' => $subType,
        ]);
    }

    /**
     * Show the form for editing the specified asset sub-type.
     */
    public function edit(AssetType $type, AssetSubType $subType)
    {
        // Ensure the sub-type belongs to the specified type
        if ($subType->asset_type_id !== $type->id) {
            abort(404);
        }
        
        return Inertia::render('Admin/Assets/SubTypes/Edit', [
            'assetType' => $type,
            'subType' => $subType,
        ]);
    }

    /**
     * Update the specified asset sub-type in storage.
     */
    public function update(Request $request, AssetType $type, AssetSubType $subType)
    {
        // Ensure the sub-type belongs to the specified type
        if ($subType->asset_type_id !== $type->id) {
            abort(404);
        }
        
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) use ($type, $subType) {
                    // Check if name is unique within this asset type (excluding current sub-type)
                    $exists = AssetSubType::where('asset_type_id', $type->id)
                                        ->where('name', $value)
                                        ->where('id', '!=', $subType->id)
                                        ->exists();
                    if ($exists) {
                        $fail('The name has already been taken for this asset type.');
                    }
                },
            ],
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ]);

        $subType->update($validated);

        return redirect()->route('admin.types.sub-types.index', $type->id)                  ->with('success', 'Asset sub-type updated successfully.');
    }

    /**
     * Remove the specified asset sub-type from storage.
     */
    public function destroy(AssetType $type, AssetSubType $subType)
    {
        // Ensure the sub-type belongs to the specified type
        if ($subType->asset_type_id !== $type->id) {
            abort(404);
        }
        
        $subType->delete();

        return redirect()->route('admin.types.sub-types.index', $type->id)                  ->with('success', 'Asset sub-type deleted successfully.');
    }
}
