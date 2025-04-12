<?php

namespace App\Policies;

use App\Models\Company;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CompanyPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole('super_admin');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Company $company): bool
    {
        // Super admins can view any company
        if ($user->hasRole('super_admin')) {
            return true;
        }

        // Company owners and users can view their own company
        return $user->company_id === $company->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasRole('super_admin');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Company $company): bool
    {
        // Super admins can update any company
        if ($user->hasRole('super_admin')) {
            return true;
        }

        // Company owners can update their own company
        return $user->company_id === $company->id && $user->hasRole('company_owner');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Company $company): bool
    {
        return $user->hasRole('super_admin');
    }

    /**
     * Determine whether the user can impersonate the company.
     */
    public function impersonate(User $user, Company $company): bool
    {
        return $user->hasRole('super_admin');
    }
}
