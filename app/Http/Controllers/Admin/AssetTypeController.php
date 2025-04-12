<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AssetType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssetTypeController extends Controller
{
    /**
     * Display a listing of the asset types.
     */
    public function index(Request $request)
    {
        $query = AssetType::query()->withCount('subTypes');
        
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
        $assetTypes = $query->orderBy('name')->paginate(10)
                          ->withQueryString();
        
        return Inertia::render('Admin/Assets/Types/Index', [
            'assetTypes' => $assetTypes,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new asset type.
     */
    public function create()
    {
        return Inertia::render('Admin/Assets/Types/Create');
    }

    /**
     * Store a newly created asset type in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:asset_types',
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ]);

        AssetType::create($validated);

        return redirect()->route('admin.types.index')
                        ->with('success', 'Asset type created successfully.');
    }

    /**
     * Display the specified asset type.
     */
    public function show(AssetType $type)
    {
        $type->load(['subTypes' => function($query) {
            $query->orderBy('name');
        }]);
        
        return Inertia::render('Admin/Assets/Types/Show', [
            'assetType' => $type,
        ]);
    }

    /**
     * Show the form for editing the specified asset type.
     */
    public function edit(AssetType $type)
    {
        return Inertia::render('Admin/Assets/Types/Edit', [
            'assetType' => $type,
        ]);
    }

    /**
     * Update the specified asset type in storage.
     */
    public function update(Request $request, AssetType $type)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:asset_types,name,' . $type->id,
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ]);

        $type->update($validated);

        return redirect()->route('admin.types.index')
                        ->with('success', 'Asset type updated successfully.');
    }

    /**
     * Remove the specified asset type from storage.
     */
    public function destroy(AssetType $type)
    {
        // Check if there are any sub-types associated with this type
        if ($type->subTypes()->count() > 0) {
            return redirect()->route('admin.types.index')
                            ->with('error', 'Cannot delete asset type with associated sub-types. Please delete the sub-types first.');
        }
        
        $type->delete();

        return redirect()->route('admin.types.index')
                        ->with('success', 'Asset type deleted successfully.');
    }
}
