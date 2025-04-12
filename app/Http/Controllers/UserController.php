<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class UserController extends Controller
{
    /**
     * Display a listing of all users.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', User::class);
        
        $query = User::with('roles', 'company');
        
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
        
        $roles = Role::all()->pluck('name', 'name')->toArray();
        $roles = array_merge(['all' => 'All Roles'], $roles);
        
        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => [
                'search' => $request->search ?? '',
                'role' => $request->role ?? 'all',
                'sort_field' => $sortField,
                'sort_direction' => $sortDirection,
            ],
            'roles' => $roles,
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create()
    {
        $this->authorize('create', User::class);
        
        $roles = Role::all();
        $permissions = Permission::all()->groupBy(function($permission) {
            return explode(' ', $permission->name)[0]; // Group by first word (e.g., "view", "create")
        });
        
        return Inertia::render('Admin/Users/Create', [
            'roles' => $roles,
            'permissionGroups' => $permissions,
            'companies' => \App\Models\Company::all(),
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', User::class);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|exists:roles,name',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,name',
            'company_id' => 'nullable|exists:companies,id',
            'title' => 'nullable|string|max:100',
            'profile_photo_url' => 'nullable|url',
        ]);
        
        // Create the user
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'company_id' => $validated['company_id'] ?? null,
            'title' => $validated['title'] ?? null,
            'profile_photo_url' => $validated['profile_photo_url'] ?? null,
        ]);
        
        // Assign role
        $user->assignRole($validated['role']);
        
        // Assign permissions if provided
        if (isset($validated['permissions']) && count($validated['permissions']) > 0) {
            $user->syncPermissions($validated['permissions']);
        }
        
        return redirect()->route('admin.users.index')
            ->with('success', 'User created successfully.');
    }

    /**
     * Display the specified user.
     */
    public function show(User $user)
    {
        $this->authorize('view', $user);
        
        $user->load('roles', 'permissions', 'company');
        
        return Inertia::render('Admin/Users/Show', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user)
    {
        $this->authorize('update', $user);
        
        $user->load('roles', 'permissions');
        
        $roles = Role::all();
        $permissions = Permission::all()->groupBy(function($permission) {
            return explode(' ', $permission->name)[0]; // Group by first word (e.g., "view", "create")
        });
        
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
            'roles' => $roles,
            'permissionGroups' => $permissions,
            'userPermissions' => $user->permissions->pluck('name'),
            'companies' => \App\Models\Company::all(),
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user)
    {
        $this->authorize('update', $user);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:8',
            'role' => 'required|exists:roles,name',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,name',
            'company_id' => 'nullable|exists:companies,id',
            'title' => 'nullable|string|max:100',
            'profile_photo_url' => 'nullable|url',
        ]);
        
        // Update user data
        $userData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'company_id' => $validated['company_id'] ?? null,
            'title' => $validated['title'] ?? null,
            'profile_photo_url' => $validated['profile_photo_url'] ?? null,
        ];
        
        // Only update password if provided
        if (!empty($validated['password'])) {
            $userData['password'] = Hash::make($validated['password']);
        }
        
        $user->update($userData);
        
        // Sync role
        $user->syncRoles([$validated['role']]);
        
        // Sync permissions if provided
        if (isset($validated['permissions'])) {
            $user->syncPermissions($validated['permissions']);
        }
        
        return redirect()->route('admin.users.show', $user)
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user)
    {
        $this->authorize('delete', $user);
        
        // Check if this is the last super admin
        if ($user->hasRole('super_admin')) {
            $adminCount = User::whereHas('roles', function($query) {
                $query->where('name', 'super_admin');
            })->count();
            
            if ($adminCount <= 1) {
                return redirect()->back()
                    ->with('error', 'Cannot delete the last super admin.');
            }
        }
        
        // Check if this is the last company owner
        if ($user->hasRole('company_owner') && $user->company_id) {
            $ownerCount = User::where('company_id', $user->company_id)
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
        
        return redirect()->route('admin.users.index')
            ->with('success', 'User deleted successfully.');
    }
}
