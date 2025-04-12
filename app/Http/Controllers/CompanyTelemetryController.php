<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\TelemetryProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CompanyTelemetryController extends Controller
{
    /**
     * Display the company telemetry integrations page
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        // For super admins, get the company from the session (for impersonation)
        if ($user->hasRole('super_admin') && session()->has('impersonate_company_id')) {
            $company = Company::find(session('impersonate_company_id'));
        } else {
            // For regular users, get the company from the relationship
            $company = $user->company;
        }
        
        // Check if user has a company associated
        if (!$company) {
            return redirect()->route('company.dashboard')
                ->with('error', 'You need to be associated with a company to access telemetry integrations.');
        }
        
        // Get all active telemetry providers
        $providers = TelemetryProvider::where('status', 'active')->get();
        
        // Get the company's active telemetry integrations
        $companyIntegrations = $company->telemetryProviders()->get();
        
        // Map the providers to include integration status
        $mappedProviders = $providers->map(function ($provider) use ($companyIntegrations) {
            $integration = $companyIntegrations->firstWhere('id', $provider->id);
            
            return [
                'id' => $provider->id,
                'name' => $provider->name,
                'description' => $provider->description,
                'logo' => $provider->logo,
                'api_endpoint' => $provider->api_endpoint,
                'is_integrated' => $integration ? true : false,
                'status' => $integration ? $integration->pivot->status : null,
                'api_key' => $integration ? $integration->pivot->api_key : null,
                'settings' => $integration ? $integration->pivot->settings : null,
                'connected_at' => $integration ? $integration->pivot->created_at : null,
            ];
        });
        
        // Pass the company and isImpersonating flag to the view
        $isImpersonating = $user->hasRole('super_admin') && session()->has('impersonate_company_id');
        
        return Inertia::render('Company/TelemetryConfiguration', [
            'providers' => $mappedProviders,
            'company' => $company,
            'isImpersonating' => $isImpersonating,
        ]);
    }
    
    /**
     * Toggle a telemetry provider integration
     */
    public function toggle(Request $request, TelemetryProvider $provider)
    {
        $user = Auth::user();
        
        // For super admins, get the company from the session (for impersonation)
        if ($user->hasRole('super_admin') && session()->has('impersonate_company_id')) {
            $company = Company::find(session('impersonate_company_id'));
        } else {
            // For regular users, get the company from the relationship
            $company = $user->company;
        }
        
        // Check if user has a company associated
        if (!$company) {
            return redirect()->route('company.dashboard')
                ->with('error', 'You need to be associated with a company to manage telemetry integrations.');
        }
        
        $validated = $request->validate([
            'status' => 'required|in:active,inactive',
            'api_key' => 'nullable|string',
            'settings' => 'nullable|json',
        ]);
        
        // Check if the integration already exists
        $exists = $company->telemetryProviders()->where('telemetry_provider_id', $provider->id)->exists();
        
        if ($exists) {
            // Update the existing integration
            $company->telemetryProviders()->updateExistingPivot($provider->id, [
                'status' => $validated['status'],
                'api_key' => $validated['api_key'] ?? null,
                'settings' => $validated['settings'] ?? null,
            ]);
            
            $message = $validated['status'] === 'active' 
                ? 'Telemetry provider integration activated successfully.' 
                : 'Telemetry provider integration deactivated successfully.';
        } else {
            // Create a new integration
            $company->telemetryProviders()->attach($provider->id, [
                'status' => $validated['status'],
                'api_key' => $validated['api_key'] ?? null,
                'settings' => $validated['settings'] ?? null,
            ]);
            
            $message = 'Telemetry provider integration added successfully.';
        }
        
        return redirect()->route('company.telemetry.index')->with('success', $message);
    }
    
    /**
     * Configure a telemetry provider integration
     */
    public function configure(Request $request, TelemetryProvider $provider)
    {
        $user = Auth::user();
        
        // For super admins, get the company from the session (for impersonation)
        if ($user->hasRole('super_admin') && session()->has('impersonate_company_id')) {
            $company = Company::find(session('impersonate_company_id'));
        } else {
            // For regular users, get the company from the relationship
            $company = $user->company;
        }
        
        // Check if user has a company associated
        if (!$company) {
            return redirect()->route('company.dashboard')
                ->with('error', 'You need to be associated with a company to configure telemetry integrations.');
        }
        
        // Get the company's integration with this provider
        $integration = $company->telemetryProviders()->where('telemetry_provider_id', $provider->id)->first();
        
        return Inertia::render('Company/TelemetryConfiguration', [
            'provider' => $provider,
            'integration' => $integration ? [
                'status' => $integration->pivot->status,
                'api_key' => $integration->pivot->api_key,
                'settings' => $integration->pivot->settings,
                'connected_at' => $integration->pivot->created_at,
            ] : null,
        ]);
    }
    
    /**
     * Save telemetry provider configuration
     */
    public function saveConfiguration(Request $request, TelemetryProvider $provider)
    {
        $user = Auth::user();
        
        // For super admins, get the company from the session (for impersonation)
        if ($user->hasRole('super_admin') && session()->has('impersonate_company_id')) {
            $company = Company::find(session('impersonate_company_id'));
        } else {
            // For regular users, get the company from the relationship
            $company = $user->company;
        }
        
        // Check if user has a company associated
        if (!$company) {
            return redirect()->route('company.dashboard')
                ->with('error', 'You need to be associated with a company to configure telemetry integrations.');
        }
        
        $validated = $request->validate([
            'api_key' => 'nullable|string',
            'settings' => 'nullable|json',
        ]);
        
        // Check if the integration already exists
        $exists = $company->telemetryProviders()->where('telemetry_provider_id', $provider->id)->exists();
        
        if ($exists) {
            // Update the existing integration
            $company->telemetryProviders()->updateExistingPivot($provider->id, [
                'api_key' => $validated['api_key'] ?? null,
                'settings' => $validated['settings'] ?? null,
            ]);
        } else {
            // Create a new integration
            $company->telemetryProviders()->attach($provider->id, [
                'status' => 'active',
                'api_key' => $validated['api_key'] ?? null,
                'settings' => $validated['settings'] ?? null,
            ]);
        }
        
        return redirect()->route('company.telemetry.index')->with('success', 'Telemetry provider configuration saved successfully.');
    }
}
