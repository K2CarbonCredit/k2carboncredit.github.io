<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FleetEquipment extends FleetAsset
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'fleet_equipment';
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'company_id',
        'asset_type_id',
        'asset_sub_type_id',
        'name',
        'model_number',
        'serial_number',
        'manufacturer_id',
        'power_source',
        'capacity',
        'weight',
        'dimensions',
        'maintenance_schedule',
        'last_maintenance_date',
        'next_maintenance_date',
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
        'photos' => 'array',
        'onboarding_status' => 'array',
        'maintenance_schedule' => 'array',
        'last_maintenance_date' => 'date',
        'next_maintenance_date' => 'date',
        'weight' => 'decimal:2',
        'capacity' => 'decimal:2',
        'dimensions' => 'array'
    ];

    /**
     * Get the manufacturer of this equipment.
     */
    public function manufacturer(): BelongsTo
    {
        return $this->belongsTo(Manufacturer::class);
    }
    
    /**
     * Scope a query to only include equipment that needs maintenance.
     */
    public function scopeNeedsMaintenance($query)
    {
        return $query->whereDate('next_maintenance_date', '<=', now());
    }
}
