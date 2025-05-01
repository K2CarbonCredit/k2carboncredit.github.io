<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VehicleMake extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'status'
    ];

    public function models()
    {
        return $this->hasMany(VehicleModel::class, 'make_id');
    }

    public function vehicles()
    {
        return $this->hasMany(FleetVehicle::class, 'make_id');
    }
}
