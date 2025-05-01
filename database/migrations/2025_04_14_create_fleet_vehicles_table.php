<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fleet_vehicles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies');
            $table->foreignId('fleet_id')->nullable()->constrained('fleets');
            $table->foreignId('asset_type_id')->constrained('asset_types');
            $table->foreignId('asset_sub_type_id')->constrained('asset_sub_types');
            $table->foreignId('make_id')->constrained('vehicle_makes');
            $table->foreignId('model_id')->constrained('vehicle_models');
            $table->string('fuel_type')->comment('diesel, petrol, ev');
            $table->string('chassis_number')->unique();
            $table->string('registration_number')->unique();
            $table->string('telemetry_provider')->nullable();
            $table->json('tags')->nullable();
            $table->json('photos')->nullable()->comment('front, side, rear, gps_device, rc_book');
            $table->json('onboarding_status')->default(json_encode([
                'information' => false,
                'photos' => false,
                'telemetry' => false,
                'manual_verification' => false
            ]));
            $table->string('status')->default('pending');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fleet_vehicles');
    }
};
