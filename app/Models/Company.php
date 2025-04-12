<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Company extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'slug',
        'address',
        'city',
        'state',
        'country',
        'postal_code',
        'phone',
        'email',
        'website',
        'logo',
        'industry',
        'description',
        'status',
    ];

    /**
     * Get the users associated with the company.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Get the projects associated with the company.
     */
    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }
    
    /**
     * Get the telemetry providers associated with the company.
     */
    public function telemetryProviders(): BelongsToMany
    {
        return $this->belongsToMany(TelemetryProvider::class, 'company_telemetry_providers')
            ->withPivot('api_key', 'status', 'settings')
            ->withTimestamps();
    }

    /**
     * Get the carbon inventory records associated with the company.
     */
    public function carbonInventory(): HasMany
    {
        return $this->hasMany(CarbonInventory::class);
    }

    /**
     * Get the reports associated with the company.
     */
    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }
    
    /**
     * Get all subscriptions for this company
     */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(CompanySubscription::class);
    }
    
    /**
     * Get the active subscription for this company
     */
    public function activeSubscription(): HasOne
    {
        return $this->hasOne(CompanySubscription::class)
            ->where('status', 'active')
            ->latest();
    }
    
    /**
     * Get all subscription payments for this company
     */
    public function subscriptionPayments(): HasMany
    {
        return $this->hasMany(SubscriptionPayment::class);
    }
    
    /**
     * Check if the company has an active subscription
     */
    public function hasActiveSubscription(): bool
    {
        return $this->activeSubscription()->exists();
    }
}
