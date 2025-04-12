<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Company;

class CompanyImpersonation
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if the user is impersonating a company
        if ($request->session()->has('impersonate_company_id')) {
            // Only super_admin can impersonate
            if ($request->user() && $request->user()->hasRole('super_admin')) {
                $companyId = $request->session()->get('impersonate_company_id');
                $company = Company::find($companyId);
                
                if ($company) {
                    // Share the impersonated company with all views
                    view()->share('impersonated_company', $company);
                    
                    // Add a flag to indicate impersonation is active
                    view()->share('is_impersonating', true);
                }
            } else {
                // If not a super_admin, remove impersonation
                $request->session()->forget('impersonate_company_id');
            }
        }

        return $next($request);
    }
}
