<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class FleetAsset extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'company_id',
        'asset_type_id',
        'asset_subtype_id',
        'name',
        'description',
        'status',
        'photos',
        'onboarding_status',
        'acquisition_date',
        'acquisition_cost',
        'expected_lifetime',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'photos' => 'array',
        'onboarding_status' => 'array',
        'acquisition_date' => 'date',
        'acquisition_cost' => 'decimal:2',
    ];

    /**
     * Get the company that owns this asset.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the asset type that this asset belongs to.
     */
    public function assetType(): BelongsTo
    {
        return $this->belongsTo(AssetType::class);
    }

    /**
     * Get the asset sub-type that this asset belongs to.
     */
    public function assetSubType(): BelongsTo
    {
        return $this->belongsTo(AssetSubType::class);
    }

    /**
     * Scope a query to only include assets of a specific type.
     */
    public function scopeOfType($query, $assetTypeId)
    {
        return $query->where('asset_type_id', $assetTypeId);
    }

    /**
     * Scope a query to only include active assets.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
