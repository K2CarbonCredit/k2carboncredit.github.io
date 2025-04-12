<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        

        $this->call([
            RolesAndPermissionsSeeder::class,
            // Other seeders...
        ]);

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' =>  Hash::make('password')
        ]);
        
       $super_admin = User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'superadmin@example.com',
            'password' =>  Hash::make('password')
        ]);

        $super_admin->assignRole('super_admin');

        $platform_admin = User::factory()->create([
            'name' => 'Platform Admin',
            'email' => 'platformadmin@example.com',
            'password' =>  Hash::make('password')
        ]);

        $platform_admin->assignRole('platform_admin');
    }
}
