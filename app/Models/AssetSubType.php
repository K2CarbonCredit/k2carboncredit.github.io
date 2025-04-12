<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssetSubType extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'asset_type_id',
        'name',
        'description',
        'status',
    ];

    /**
     * Get the asset type that owns this sub-type.
     */
    public function assetType(): BelongsTo
    {
        return $this->belongsTo(AssetType::class);
    }
}
