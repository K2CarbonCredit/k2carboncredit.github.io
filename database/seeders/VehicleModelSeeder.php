<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\VehicleMake;
use App\Models\VehicleModel;

class VehicleModelSeeder extends Seeder
{
    public function run(): void
    {
        $models = [
            // Toyota Models
            [
                'make' => 'Toyota',
                'models' => [
                    [
                        'name' => 'Innova',
                        'description' => 'Multi-purpose vehicle (MPV)',
                        'status' => 'active',
                    ],
                    [
                        'name' => 'Fortuner',
                        'description' => 'Mid-size SUV',
                        'status' => 'active',
                    ],
                ],
            ],
            // Tata Models
            [
                'make' => 'Tata',
                'models' => [
                    [
                        'name' => 'Prima',
                        'description' => 'Heavy commercial vehicle',
                        'status' => 'active',
                    ],
                    [
                        'name' => 'Ultra',
                        'description' => 'Light commercial vehicle',
                        'status' => 'active',
                    ],
                    [
                        'name' => 'Ace',
                        'description' => 'Mini truck',
                        'status' => 'active',
                    ],
                ],
            ],
            // Mahindra Models
            [
                'make' => 'Mahindra',
                'models' => [
                    [
                        'name' => 'Blazo X',
                        'description' => 'Heavy commercial vehicle',
                        'status' => 'active',
                    ],
                    [
                        'name' => 'Furio',
                        'description' => 'Intermediate commercial vehicle',
                        'status' => 'active',
                    ],
                    [
                        'name' => 'Supro',
                        'description' => 'Light commercial vehicle',
                        'status' => 'active',
                    ],
                ],
            ],
            // Ashok Leyland Models
            [
                'make' => 'Ashok Leyland',
                'models' => [
                    [
                        'name' => 'Dost',
                        'description' => 'Light commercial vehicle',
                        'status' => 'active',
                    ],
                    [
                        'name' => 'Partner',
                        'description' => 'Light commercial vehicle',
                        'status' => 'active',
                    ],
                    [
                        'name' => 'Boss',
                        'description' => 'Intermediate commercial vehicle',
                        'status' => 'active',
                    ],
                ],
            ],
            // BharatBenz Models
            [
                'make' => 'BharatBenz',
                'models' => [
                    [
                        'name' => '1217',
                        'description' => 'Medium-duty truck',
                        'status' => 'active',
                    ],
                    [
                        'name' => '2823',
                        'description' => 'Heavy-duty truck',
                        'status' => 'active',
                    ],
                ],
            ],
            // Eicher Models
            [
                'make' => 'Eicher',
                'models' => [
                    [
                        'name' => 'Pro 2000',
                        'description' => 'Light and medium duty trucks',
                        'status' => 'active',
                    ],
                    [
                        'name' => 'Pro 3000',
                        'description' => 'Heavy duty trucks',
                        'status' => 'active',
                    ],
                    [
                        'name' => 'Pro 6000',
                        'description' => 'Heavy duty tractor trailer',
                        'status' => 'active',
                    ],
                ],
            ],
        ];

        foreach ($models as $makeData) {
            $make = VehicleMake::where('name', $makeData['make'])->first();
            if ($make) {
                foreach ($makeData['models'] as $modelData) {
                    VehicleModel::create([
                        'make_id' => $make->id,
                        'name' => $modelData['name'],
                        'description' => $modelData['description'],
                        'status' => $modelData['status'],
                    ]);
                }
            }
        }
    }
}
