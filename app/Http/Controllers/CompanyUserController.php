<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class CompanyUserController extends Controller
{
    /**
     * Display a listing of the users for a company.
     */
    public function index(Company $company, Request $request)
    {
        $this->authorize('viewAny', [User::class, $company]);
        
        $query = User::where('company_id', $company->id)->with('roles');
        
        // Search functionality
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('email', 'like', "%{$searchTerm}%");
            });
        }
        
        // Filter by role
        if ($request->has('role') && $request->role !== 'all') {
            $query->whereHas('roles', function($q) use ($request) {
                $q->where('name', $request->role);
            });
        }
        
        // Sorting
        $sortField = $request->input('sort_field', 'name');
        $sortDirection = $request->input('sort_direction', 'asc');
        $query->orderBy($sortField, $sortDirection);
        
        $users = $query->paginate(10)->withQueryString();
        
        return Inertia::render('Admin/Companies/Users/Index', [
            'company' => $company,
            'users' => $users,
            'filters' => [
                'search' => $request->search ?? '',
                'role' => $request->role ?? 'all',
                'sort_field' => $sortField,
                'sort_direction' => $sortDirection,
            ],
            'roles' => [
                'all' => 'All Roles',
                'company_owner' => 'Company Owner',
                'company_user' => 'Company User',
            ],
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create(Company $company)
    {
        $this->authorize('create', [User::class, $company]);
        
        $roles = Role::whereIn('name', ['company_owner', 'company_user'])->get();
        $permissions = Permission::all()->groupBy(function($permission) {
            return explode(' ', $permission->name)[0]; // Group by first word (e.g., "view", "create")
        });
        
        return Inertia::render('Admin/Companies/Users/Create', [
            'company' => $company,
            'roles' => $roles,
            'permissionGroups' => $permissions,
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request, Company $company)
    {
        $this->authorize('create', [User::class, $company]);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => ['required', Rule::in(['company_owner', 'company_user'])],
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,name',
            'title' => 'nullable|string|max:100',
            'profile_photo_url' => 'nullable|url',
        ]);
        
        // Create the user
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'company_id' => $company->id,
            'title' => $validated['title'] ?? null,
            'profile_photo_url' => $validated['profile_photo_url'] ?? null,
        ]);
        
        // Assign role
        $user->assignRole($validated['role']);
        
        // Assign permissions if provided
        if (isset($validated['permissions']) && count($validated['permissions']) > 0) {
            $user->syncPermissions($validated['permissions']);
        }
        
        return redirect()->route('admin.companies.users.index', $company)
            ->with('success', 'User created successfully.');
    }

    /**
     * Display the specified user.
     */
    public function show(Company $company, User $user)
    {
        $this->authorize('view', [$user, $company]);
        
        if ($user->company_id !== $company->id) {
            abort(404);
        }
        
        $user->load('roles', 'permissions');
        
        return Inertia::render('Admin/Companies/Users/Show', [
            'company' => $company,
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(Company $company, User $user)
    {
        $this->authorize('update', [$user, $company]);
        
        if ($user->company_id !== $company->id) {
            abort(404);
        }
        
        $user->load('roles', 'permissions');
        
        $roles = Role::whereIn('name', ['company_owner', 'company_user'])->get();
        $permissions = Permission::all()->groupBy(function($permission) {
            return explode(' ', $permission->name)[0]; // Group by first word (e.g., "view", "create")
        });
        
        return Inertia::render('Admin/Companies/Users/Edit', [
            'company' => $company,
            'user' => $user,
            'roles' => $roles,
            'permissionGroups' => $permissions,
            'userPermissions' => $user->permissions->pluck('name'),
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, Company $company, User $user)
    {
        $this->authorize('update', [$user, $company]);
        
        if ($user->company_id !== $company->id) {
            abort(404);
        }
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:8',
            'role' => ['required', Rule::in(['company_owner', 'company_user'])],
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,name',
            'title' => 'nullable|string|max:100',
            'profile_photo_url' => 'nullable|url',
        ]);
        
        // Update user data
        $userData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'title' => $validated['title'] ?? null,
            'profile_photo_url' => $validated['profile_photo_url'] ?? null,
        ];
        
        // Only update password if provided
        if (!empty($validated['password'])) {
            $userData['password'] = Hash::make($validated['password']);
        }
        
        $user->update($userData);
        
        // Update role (ensure there's always at least one company owner)
        $currentRole = $user->roles->first()->name ?? null;
        if ($currentRole === 'company_owner' && $validated['role'] !== 'company_owner') {
            // Check if this is the last company owner
            $ownerCount = User::where('company_id', $company->id)
                ->whereHas('roles', function($query) {
                    $query->where('name', 'company_owner');
                })
                ->count();
            
            if ($ownerCount <= 1) {
                return redirect()->back()
                    ->withInput()
                    ->with('error', 'Cannot change role: This is the last company owner. Please assign another owner first.');
            }
        }
        
        // Sync role
        $user->syncRoles([$validated['role']]);
        
        // Sync permissions if provided
        if (isset($validated['permissions'])) {
            $user->syncPermissions($validated['permissions']);
        }
        
        return redirect()->route('admin.companies.users.show', [$company, $user])
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(Company $company, User $user)
    {
        $this->authorize('delete', [$user, $company]);
        
        if ($user->company_id !== $company->id) {
            abort(404);
        }
        
        // Check if this is the last company owner
        if ($user->hasRole('company_owner')) {
            $ownerCount = User::where('company_id', $company->id)
                ->whereHas('roles', function($query) {
                    $query->where('name', 'company_owner');
                })
                ->count();
            
            if ($ownerCount <= 1) {
                return redirect()->back()
                    ->with('error', 'Cannot delete the last company owner. Please assign another owner first.');
            }
        }
        
        $user->delete();
        
        return redirect()->route('admin.companies.users.index', $company)
            ->with('success', 'User deleted successfully.');
    }
}
