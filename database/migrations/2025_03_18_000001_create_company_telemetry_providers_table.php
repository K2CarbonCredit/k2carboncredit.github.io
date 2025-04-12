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
        // Only create the table if it doesn't already exist
        if (!Schema::hasTable('company_telemetry_providers')) {
            Schema::create('company_telemetry_providers', function (Blueprint $table) {
                $table->id();
                $table->foreignId('company_id')->constrained()->onDelete('cascade');
                $table->foreignId('telemetry_provider_id')->constrained()->onDelete('cascade');
                $table->string('api_key')->nullable();
                $table->enum('status', ['active', 'inactive'])->default('active');
                $table->json('settings')->nullable();
                $table->timestamps();

                // Create a unique constraint with a shorter name to avoid MySQL issues
                $table->unique(['company_id', 'telemetry_provider_id'], 'comp_tele_prov_unique');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('company_telemetry_providers');
    }
};
