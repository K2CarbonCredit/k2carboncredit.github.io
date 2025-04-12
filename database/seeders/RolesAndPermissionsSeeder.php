<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        // Dashboard permissions
        Permission::create(['name' => 'view company dashboard']);
        Permission::create(['name' => 'view platform dashboard']);
        Permission::create(['name' => 'impersonate companies']);
        
        // Project permissions
        Permission::create(['name' => 'create projects']);
        Permission::create(['name' => 'edit projects']);
        Permission::create(['name' => 'delete projects']);
        Permission::create(['name' => 'view projects']);
        
        // Carbon inventory permissions
        Permission::create(['name' => 'manage carbon inventory']);
        Permission::create(['name' => 'view carbon inventory']);
        
        // Reports permissions
        Permission::create(['name' => 'create reports']);
        Permission::create(['name' => 'view reports']);
        
        // Marketplace permissions
        Permission::create(['name' => 'buy carbon credits']);
        Permission::create(['name' => 'sell carbon credits']);
        Permission::create(['name' => 'view marketplace']);
        
        // User management permissions
        Permission::create(['name' => 'manage users']);
        Permission::create(['name' => 'view users']);

        // Company management permissions
        Permission::create(['name' => 'manage companies']);
        Permission::create(['name' => 'view companies']);

        // Create roles and assign permissions
        
        // Super Admin role - has all permissions
        $superAdminRole = Role::create(['name' => 'super_admin']);
        $superAdminRole->givePermissionTo(Permission::all());
        
        // Company Owner role - has permissions to manage their own company
        $companyOwnerRole = Role::create(['name' => 'company_owner']);
        $companyOwnerRole->givePermissionTo([
            'view company dashboard',
            'create projects',
            'edit projects',
            'delete projects',
            'view projects',
            'manage carbon inventory',
            'view carbon inventory',
            'create reports',
            'view reports',
            'buy carbon credits',
            'sell carbon credits',
            'view marketplace',
            'manage users',
            'view users',
        ]);
        
        // Company User role - has limited permissions within their company
        $companyUserRole = Role::create(['name' => 'company_user']);
        $companyUserRole->givePermissionTo([
            'view company dashboard',
            'view projects',
            'view carbon inventory',
            'view reports',
            'view marketplace',
        ]);
        
        // Platform Admin role - can manage the platform but not impersonate
        $platformAdminRole = Role::create(['name' => 'platform_admin']);
        $platformAdminRole->givePermissionTo([
            'view platform dashboard',
            'view company dashboard',
            'manage companies',
            'view companies',
            'manage users',
            'view users',
        ]);
    }
}
