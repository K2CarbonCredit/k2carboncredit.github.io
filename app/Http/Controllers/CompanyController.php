<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class CompanyController extends Controller
{
    /**
     * Display a listing of the companies.
     */
    public function index(Request $request)
    {
        $query = Company::query()->withCount('users');
        
        // Determine if we should load subscription data
        $view = $request->input('view', 'default');
        $withSubscriptions = ($view === 'subscriptions');
        
        if ($withSubscriptions) {
            $query->with(['activeSubscription.plan']);
        }
        
        // Search functionality
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('email', 'like', "%{$searchTerm}%")
                  ->orWhere('industry', 'like', "%{$searchTerm}%");
            });
        }
        
        // Filtering by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        
        // Filtering by subscription status
        if ($withSubscriptions && $request->has('subscription_status') && $request->subscription_status !== 'all') {
            if ($request->subscription_status === 'active') {
                $query->whereHas('activeSubscription');
            } elseif ($request->subscription_status === 'inactive') {
                $query->whereDoesntHave('activeSubscription');
            }
        }
        
        // Sorting
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);
        
        $companies = $query->paginate(10)->withQueryString();
        
        return Inertia::render('Admin/Companies/Index', [
            'companies' => $companies,
            'filters' => [
                'search' => $request->search ?? '',
                'status' => $request->status ?? 'all',
                'subscription_status' => $request->subscription_status ?? 'all',
                'sort_field' => $sortField,
                'sort_direction' => $sortDirection,
                'view' => $view,
            ],
            'statuses' => [
                'all' => 'All',
                'active' => 'Active',
                'inactive' => 'Inactive',
                'pending' => 'Pending',
            ],
            'subscriptionStatuses' => [
                'all' => 'All Subscriptions',
                'active' => 'Active Subscriptions',
                'inactive' => 'No Active Subscription',
            ],
        ]);
    }

    /**
     * Show the form for creating a new company.
     */
    public function create()
    {
        return Inertia::render('Admin/Companies/Create');
    }

    /**
     * Store a newly created company in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:companies,email',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'phone' => 'nullable|string|max:20',
            'website' => 'nullable|url|max:255',
            'industry' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'status' => ['required', Rule::in(['active', 'inactive', 'pending'])],
            
            // Company owner details
            'owner_name' => 'required|string|max:255',
            'owner_email' => 'required|email|unique:users,email',
            'owner_password' => 'required|string|min:8',
        ]);
        
        // Begin transaction
        DB::beginTransaction();
        
        try {
            // Create the company
            $company = Company::create([
                'name' => $validated['name'],
                'slug' => Str::slug($validated['name']),
                'email' => $validated['email'],
                'address' => $validated['address'] ?? null,
                'city' => $validated['city'] ?? null,
                'state' => $validated['state'] ?? null,
                'country' => $validated['country'] ?? null,
                'postal_code' => $validated['postal_code'] ?? null,
                'phone' => $validated['phone'] ?? null,
                'website' => $validated['website'] ?? null,
                'industry' => $validated['industry'] ?? null,
                'description' => $validated['description'] ?? null,
                'status' => $validated['status'],
            ]);
            
            // Create the company owner
            $owner = User::create([
                'name' => $validated['owner_name'],
                'email' => $validated['owner_email'],
                'password' => Hash::make($validated['owner_password']),
                'company_id' => $company->id,
            ]);
            
            // Assign company_owner role
            $owner->assignRole('company_owner');
            
            DB::commit();
            
            return redirect()->route('admin.companies.show', $company)
                ->with('success', 'Company created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to create company: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified company.
     */
    public function show(Company $company)
    {
        $company->load(['users' => function($query) {
            $query->with('roles');
        }]);
        
        // Load the active subscription with its plan
        $activeSubscription = $company->activeSubscription()->with('plan')->first();
        
        return Inertia::render('Admin/Companies/Show', [
            'company' => $company,
            'userCount' => $company->users->count(),
            'companyOwners' => $company->users->filter(function($user) {
                return $user->hasRole('company_owner');
            })->values(),
            'activeSubscription' => $activeSubscription,
        ]);
    }

    /**
     * Show the form for editing the specified company.
     */
    public function edit(Company $company)
    {
        return Inertia::render('Admin/Companies/Edit', [
            'company' => $company,
        ]);
    }

    /**
     * Update the specified company in storage.
     */
    public function update(Request $request, Company $company)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('companies')->ignore($company->id)],
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'phone' => 'nullable|string|max:20',
            'website' => 'nullable|url|max:255',
            'industry' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'status' => ['required', Rule::in(['active', 'inactive', 'pending'])],
            'logo' => 'nullable|image|max:2048',
        ]);
        
        // Handle logo upload if provided
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('company-logos', 'public');
            $validated['logo'] = $logoPath;
        }
        
        // Update the slug if name changed
        if ($company->name !== $validated['name']) {
            $validated['slug'] = Str::slug($validated['name']);
        }
        
        $company->update($validated);
        
        return redirect()->route('admin.companies.show', $company)
            ->with('success', 'Company updated successfully.');
    }

    /**
     * Remove the specified company from storage.
     */
    public function destroy(Company $company)
    {
        // Check if company has users
        if ($company->users()->count() > 0) {
            return redirect()->back()
                ->with('error', 'Cannot delete company with associated users. Please remove all users first.');
        }
        
        $company->delete();
        
        return redirect()->route('admin.companies.index')
            ->with('success', 'Company deleted successfully.');
    }
    
    /**
     * Show the form for adding a new user to the company.
     */
    public function createUser(Company $company)
    {
        $roles = Role::whereIn('name', ['company_owner', 'company_user'])->get();
        
        return Inertia::render('Admin/Companies/CreateUser', [
            'company' => $company,
            'roles' => $roles,
        ]);
    }
    
    /**
     * Store a newly created user for the company.
     */
    public function storeUser(Request $request, Company $company)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => ['required', Rule::in(['company_owner', 'company_user'])],
        ]);
        
        // Create the user
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'company_id' => $company->id,
        ]);
        
        // Assign role
        $user->assignRole($validated['role']);
        
        return redirect()->route('admin.companies.show', $company)
            ->with('success', 'User added to company successfully.');
    }
    
    /**
     * Remove a user from the company.
     */
    public function destroyUser(Company $company, User $user)
    {
        // Ensure the user belongs to the company
        if ($user->company_id !== $company->id) {
            return redirect()->back()
                ->with('error', 'This user does not belong to the specified company.');
        }
        
        // Check if this is the last company owner
        if ($user->hasRole('company_owner') && 
            $company->users()->whereHas('roles', function($query) {
                $query->where('name', 'company_owner');
            })->count() <= 1) {
            return redirect()->back()
                ->with('error', 'Cannot remove the last company owner. Please assign another owner first.');
        }
        
        $user->delete();
        
        return redirect()->route('admin.companies.show', $company)
            ->with('success', 'User removed from company successfully.');
    }
    
    /**
     * Impersonate a company.
     */
    public function impersonate(Request $request, Company $company)
    {
        $request->session()->put('impersonate_company_id', $company->id);
        
        return redirect()->route('company.dashboard')
            ->with('success', 'Now viewing as ' . $company->name);
    }
}
