<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class FleetVehicle extends FleetAsset
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'fleet_vehicles';
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'company_id',
        'fleet_id',
        'asset_type_id',
        'asset_sub_type_id',
        'make_id',
        'model_id',
        'fuel_type',
        'chassis_number',
        'registration_number',
        'telemetry_provider',
        'tags',
        'photos',
        'onboarding_status',
        'status'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'tags' => 'array',
        'photos' => 'array',
        'onboarding_status' => 'array'
    ];

    // These relationships are inherited from FleetAsset

    /**
     * Get the vehicle make that this vehicle belongs to.
     */
    public function make(): BelongsTo
    {
        return $this->belongsTo(VehicleMake::class);
    }

    /**
     * Get the vehicle model that this vehicle belongs to.
     */
    public function model(): BelongsTo
    {
        return $this->belongsTo(VehicleModel::class);
    }
    
    /**
     * Get the fleet that this vehicle belongs to.
     */
    public function fleet(): BelongsTo
    {
        return $this->belongsTo(Fleet::class);
    }
}
