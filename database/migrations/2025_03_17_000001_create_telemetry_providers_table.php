<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('telemetry_providers', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->string('api_endpoint')->nullable();
            $table->string('api_key')->nullable();
            $table->string('logo')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->json('integration_details')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // Create pivot table for company-telemetry provider relationships
        Schema::create('company_telemetry_providers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->foreignId('telemetry_provider_id')->constrained()->onDelete('cascade');
            $table->string('api_key')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->json('settings')->nullable();
            $table->timestamps();
            
            // Ensure a company can only have one active integration with a specific provider
            $table->unique(['company_id', 'telemetry_provider_id'], 'company_telemetry_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('company_telemetry_providers');
        Schema::dropIfExists('telemetry_providers');
    }
};
