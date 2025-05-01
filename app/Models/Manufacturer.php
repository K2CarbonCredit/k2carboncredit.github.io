<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Manufacturer extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'website',
        'contact_email',
        'contact_phone',
        'status',
    ];

    /**
     * Get the equipment manufactured by this manufacturer.
     */
    public function equipment(): HasMany
    {
        return $this->hasMany(FleetEquipment::class);
    }
}
