<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\VehicleMake;

class VehicleMakeSeeder extends Seeder
{
    public function run(): void
    {
        $makes = [
            [
                'name' => 'Toyota',
                'description' => 'Japanese multinational automotive manufacturer',
                'status' => 'active',
            ],
            [
                'name' => 'Honda',
                'description' => 'Japanese public multinational conglomerate manufacturer',
                'status' => 'active',
            ],
            [
                'name' => 'Tata',
                'description' => 'Indian multinational automotive manufacturer',
                'status' => 'active',
            ],
            [
                'name' => 'Mahindra',
                'description' => 'Indian multinational automotive manufacturer',
                'status' => 'active',
            ],
            [
                'name' => 'Maruti Suzuki',
                'description' => 'Indian subsidiary of Japanese car manufacturer Suzuki',
                'status' => 'active',
            ],
            [
                'name' => 'Hyundai',
                'description' => 'South Korean multinational automotive manufacturer',
                'status' => 'active',
            ],
            [
                'name' => 'Kia',
                'description' => 'South Korean multinational automotive manufacturer',
                'status' => 'active',
            ],
            [
                'name' => 'Ashok Leyland',
                'description' => 'Indian commercial vehicle manufacturing company',
                'status' => 'active',
            ],
            [
                'name' => 'BharatBenz',
                'description' => 'Indian truck and bus manufacturer',
                'status' => 'active',
            ],
            [
                'name' => 'Eicher',
                'description' => 'Indian commercial vehicle manufacturer',
                'status' => 'active',
            ],
        ];

        foreach ($makes as $make) {
            VehicleMake::create($make);
        }
    }
}
