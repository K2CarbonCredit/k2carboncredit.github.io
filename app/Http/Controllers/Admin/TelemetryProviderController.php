<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TelemetryProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class TelemetryProviderController extends Controller
{
    /**
     * Display a listing of the telemetry providers.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'status', 'sort_field', 'sort_direction']);
        
        $query = TelemetryProvider::query();
        
        // Apply search filter
        if (!empty($filters['search'])) {
            $query->where(function ($query) use ($filters) {
                $query->where('name', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('description', 'like', '%' . $filters['search'] . '%');
            });
        }
        
        // Apply status filter
        if (!empty($filters['status']) && $filters['status'] !== 'all') {
            $query->where('status', $filters['status']);
        }
        
        // Apply sorting
        $sortField = $filters['sort_field'] ?? 'created_at';
        $sortDirection = $filters['sort_direction'] ?? 'desc';
        $query->orderBy($sortField, $sortDirection);
        
        $providers = $query->paginate(10)->withQueryString();
        
        return Inertia::render('Admin/TelemetryProviders/Index', [
            'providers' => $providers,
            'filters' => $filters,
            'statuses' => [
                'all' => 'All Statuses',
                'active' => 'Active',
                'inactive' => 'Inactive',
            ],
        ]);
    }

    /**
     * Show the form for creating a new telemetry provider.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('Admin/TelemetryProviders/Create');
    }

    /**
     * Store a newly created telemetry provider in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:telemetry_providers',
            'description' => 'nullable|string',
            'api_endpoint' => 'nullable|string|max:255',
            'api_key' => 'nullable|string|max:255',
            'logo' => 'nullable|string|max:255',
            'status' => 'required|in:active,inactive',
            'integration_details' => 'nullable|json',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        TelemetryProvider::create($request->all());

        return redirect()->route('admin.telemetry-providers.index')
            ->with('success', 'Telemetry provider created successfully.');
    }

    /**
     * Display the specified telemetry provider.
     *
     * @param  \App\Models\TelemetryProvider  $telemetryProvider
     * @return \Inertia\Response
     */
    public function show(TelemetryProvider $telemetryProvider)
    {
        return Inertia::render('Admin/TelemetryProviders/Show', [
            'provider' => $telemetryProvider,
        ]);
    }

    /**
     * Show the form for editing the specified telemetry provider.
     *
     * @param  \App\Models\TelemetryProvider  $telemetryProvider
     * @return \Inertia\Response
     */
    public function edit(TelemetryProvider $telemetryProvider)
    {
        return Inertia::render('Admin/TelemetryProviders/Edit', [
            'provider' => $telemetryProvider,
        ]);
    }

    /**
     * Update the specified telemetry provider in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\TelemetryProvider  $telemetryProvider
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, TelemetryProvider $telemetryProvider)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:telemetry_providers,name,' . $telemetryProvider->id,
            'description' => 'nullable|string',
            'api_endpoint' => 'nullable|string|max:255',
            'api_key' => 'nullable|string|max:255',
            'logo' => 'nullable|string|max:255',
            'status' => 'required|in:active,inactive',
            'integration_details' => 'nullable|json',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $telemetryProvider->update($request->all());

        return redirect()->route('admin.telemetry-providers.index')
            ->with('success', 'Telemetry provider updated successfully.');
    }

    /**
     * Remove the specified telemetry provider from storage.
     *
     * @param  \App\Models\TelemetryProvider  $telemetryProvider
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(TelemetryProvider $telemetryProvider)
    {
        $telemetryProvider->delete();

        return redirect()->route('admin.telemetry-providers.index')
            ->with('success', 'Telemetry provider deleted successfully.');
    }
}
