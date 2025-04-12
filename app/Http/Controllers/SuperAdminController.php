<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Company;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SuperAdminController extends Controller
{
    /**
     * Display the super admin dashboard.
     */
    public function dashboard()
    {
        // Get statistics for the dashboard
        $stats = [
            'totalCompanies' => Company::count(),
            'totalUsers' => User::count(),
            'activeCompanies' => Company::where('status', 'active')->count(),
            'inactiveCompanies' => Company::where('status', 'inactive')->count(),
            'pendingCompanies' => Company::where('status', 'pending')->count(),
            'newCompanies' => Company::where('created_at', '>=', now()->subDays(30))->count(),
            'newUsers' => User::where('created_at', '>=', now()->subDays(30))->count(),
        ];
        
        // Get recent companies
        $recentCompanies = Company::with(['users' => function($query) {
            $query->whereHas('roles', function($q) {
                $q->where('name', 'company_owner');
            });
            }])
            ->latest()
            ->take(5)
            ->get()
            ->map(function($company) {
                return [
                    'id' => $company->id,
                    'name' => $company->name,
                    'email' => $company->email,
                    'status' => $company->status,
                    'created_at' => $company->created_at,
                    'owner' => $company->users->first() ? [
                        'name' => $company->users->first()->name,
                        'email' => $company->users->first()->email,
                    ] : null,
                    'users_count' => $company->users->count(),
                ];
            });

        // Get companies with most users
        $topCompanies = Company::withCount('users')
            ->orderBy('users_count', 'desc')
            ->take(5)
            ->get();
            
        // Get monthly growth data for the last 6 months
        $sixMonthsAgo = Carbon::now()->subMonths(6)->startOfMonth();
        
        $monthlyCompanyGrowth = DB::table('companies')
            ->select(DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'), DB::raw('count(*) as count'))
            ->where('created_at', '>=', $sixMonthsAgo)
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->keyBy('month');
            
        $monthlyUserGrowth = DB::table('users')
            ->select(DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'), DB::raw('count(*) as count'))
            ->where('created_at', '>=', $sixMonthsAgo)
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->keyBy('month');
            
        // Generate labels for all months in the range
        $labels = [];
        $companyData = [];
        $userData = [];
        
        $currentDate = Carbon::parse($sixMonthsAgo);
        $endDate = Carbon::now()->endOfMonth();
        
        while ($currentDate->lte($endDate)) {
            $monthKey = $currentDate->format('Y-m');
            $labels[] = $currentDate->format('M Y');
            $companyData[] = $monthlyCompanyGrowth->has($monthKey) ? $monthlyCompanyGrowth[$monthKey]->count : 0;
            $userData[] = $monthlyUserGrowth->has($monthKey) ? $monthlyUserGrowth[$monthKey]->count : 0;
            $currentDate->addMonth();
        }
        
        $growthData = [
            'labels' => $labels,
            'companyData' => $companyData,
            'userData' => $userData,
        ];

        // Get company status distribution
        $statusDistribution = [
            'active' => $stats['activeCompanies'],
            'inactive' => $stats['inactiveCompanies'],
            'pending' => $stats['pendingCompanies'],
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentCompanies' => $recentCompanies,
            'topCompanies' => $topCompanies,
            'growthData' => $growthData,
            'statusDistribution' => $statusDistribution,
        ]);
    }

    /**
     * Stop impersonating a company.
     */
    public function stopImpersonating(Request $request)
    {
        $request->session()->forget('impersonate_company_id');
        
        return redirect()->route('admin.dashboard')
            ->with('success', 'Stopped impersonating company.');
    }

    /**
     * Impersonate a company.
     */
    public function impersonate(Request $request, Company $company)
    {
        // Store the company ID in the session
        $request->session()->put('impersonate_company_id', $company->id);
        
        return redirect()->route('company.dashboard');
    }

 
}
