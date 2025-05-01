<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class FleetPermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Create fleet management permissions
        $permissions = [
            'manage fleet',
            'view fleet',
            'create fleet',
            'edit fleet',
            'delete fleet'
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Assign permissions to company_owner role
        $companyOwner = Role::where('name', 'company_owner')->first();
        if ($companyOwner) {
            $companyOwner->givePermissionTo($permissions);
        }

        // Assign view permission to company_user role
        $companyUser = Role::where('name', 'company_user')->first();
        if ($companyUser) {
            $companyUser->givePermissionTo('view fleet');
        }
    }
}
