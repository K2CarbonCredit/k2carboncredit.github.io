<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Company;
use Illuminate\Support\Facades\Auth;

class CompanyDashboardController extends Controller
{
    /**
     * Display the company dashboard.
     */
    public function index(Request $request)
    {
        // Get the current user
        $user = Auth::user();
        
        // Determine which company to show
        $companyId = $request->session()->get('impersonate_company_id', $user->company_id);
        $company = Company::findOrFail($companyId);
        
        // Check if the user has permission to view this company's dashboard
        if (!$user->hasRole('super_admin') && $user->company_id !== $company->id) {
            abort(403, 'Unauthorized action.');
        }
        
        // Get company statistics (these would be replaced with actual data in a real application)
        $stats = [
            'totalEmissions' => 1245,
            'carbonOffsets' => 845,
            'netEmissions' => 400,
            'activeProjects' => 12,
        ];
        
        // Get recent activity (placeholder data)
        $recentActivity = [
            [
                'type' => 'project_approved',
                'title' => 'New offset project approved',
                'description' => 'Solar Farm Initiative - 250 tCO₂e',
                'time' => now()->subHours(2),
            ],
            [
                'type' => 'emissions_alert',
                'title' => 'Emissions threshold exceeded',
                'description' => 'Manufacturing Plant B - 15% above target',
                'time' => now()->subDay(),
            ],
            [
                'type' => 'report_generated',
                'title' => 'Quarterly report generated',
                'description' => 'Q1 2025 Emissions Summary',
                'time' => now()->subDays(2),
            ],
            [
                'type' => 'target_achieved',
                'title' => 'Reduction target achieved',
                'description' => 'Office Operations - 20% reduction',
                'time' => now()->subWeek(),
            ],
        ];
        
        return Inertia::render('Dashboard', [
            'company' => $company,
            'stats' => $stats,
            'recentActivity' => $recentActivity,
            'isImpersonating' => $request->session()->has('impersonate_company_id'),
        ]);
    }
}
