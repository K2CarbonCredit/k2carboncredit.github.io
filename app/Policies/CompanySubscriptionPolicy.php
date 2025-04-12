<?php

namespace App\Policies;

use App\Models\Company;
use App\Models\CompanySubscription;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CompanySubscriptionPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user, Company $company): bool
    {
        if ($user->hasRole('super_admin')) {
            return true;
        }

        // Company admin can view subscriptions for their company
        if ($user->hasRole('company_admin') && $user->company_id === $company->id) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, CompanySubscription $subscription, Company $company): bool
    {
        if ($user->hasRole('super_admin')) {
            return true;
        }

        // Company admin can view subscriptions for their company
        if ($user->hasRole('company_admin') && 
            $user->company_id === $company->id && 
            $subscription->company_id === $company->id) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, Company $company): bool
    {
        return $user->hasRole('super_admin');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, CompanySubscription $subscription, Company $company): bool
    {
        return $user->hasRole('super_admin');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, CompanySubscription $subscription, Company $company): bool
    {
        return $user->hasRole('super_admin');
    }
}
