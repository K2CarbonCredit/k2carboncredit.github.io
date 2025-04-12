<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SubscriptionPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'setup_fee',
        'monthly_price',
        'yearly_price',
        'is_popular',
        'is_active',
        'max_vehicles',
        'features',
    ];

    protected $casts = [
        'setup_fee' => 'decimal:2',
        'monthly_price' => 'decimal:2',
        'yearly_price' => 'decimal:2',
        'is_popular' => 'boolean',
        'is_active' => 'boolean',
        'features' => 'array',
    ];

    /**
     * Get all subscriptions for this plan
     */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(CompanySubscription::class);
    }

    /**
     * Get the yearly savings percentage compared to monthly billing
     */
    public function getYearlySavingsPercentAttribute(): int
    {
        if ($this->monthly_price <= 0) {
            return 0;
        }

        $monthlyCostForYear = $this->monthly_price * 12;
        $savings = $monthlyCostForYear - $this->yearly_price;
        
        if ($monthlyCostForYear <= 0) {
            return 0;
        }
        
        return (int) round(($savings / $monthlyCostForYear) * 100);
    }
}
