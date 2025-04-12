<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RequireCompany
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();
        
        // Super admins can impersonate companies
        if ($user->hasRole('super_admin') && session()->has('impersonated_company_id')) {
            $companyId = session('impersonated_company_id');
            
            // Check if the company exists
            $company = \App\Models\Company::find($companyId);
            
            if (!$company) {
                return redirect()->route('company.dashboard')
                    ->with('error', 'The company you are trying to impersonate does not exist.');
            }
            
            // Set the company in the request for easy access in controllers
            $request->attributes->add(['company' => $company]);
            
            return $next($request);
        }
        
        // Regular users must have a company associated
        if (!$user->company) {
            return redirect()->route('company.dashboard')
                ->with('error', 'You need to be associated with a company to access this feature.');
        }
        
        // Set the company in the request for easy access in controllers
        $request->attributes->add(['company' => $user->company]);
        
        return $next($request);
    }
}
