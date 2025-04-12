<?php

namespace App\Policies;

use App\Models\Company;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user, Company $company = null): bool
    {
        // Super admins can view any users
        if ($user->hasRole('super_admin')) {
            return true;
        }

        // Company owners can view users in their company
        if ($company && $user->company_id === $company->id && $user->hasRole('company_owner')) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, User $model, Company $company = null): bool
    {
        // Super admins can view any user
        if ($user->hasRole('super_admin')) {
            return true;
        }

        // Users can view their own profile
        if ($user->id === $model->id) {
            return true;
        }

        // Company owners can view users in their company
        if ($company && $user->company_id === $company->id && $user->hasRole('company_owner') && $model->company_id === $company->id) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, Company $company = null): bool
    {
        // Super admins can create users
        if ($user->hasRole('super_admin')) {
            return true;
        }

        // Company owners can create users in their company
        if ($company && $user->company_id === $company->id && $user->hasRole('company_owner')) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, User $model, Company $company = null): bool
    {
        // Super admins can update any user
        if ($user->hasRole('super_admin')) {
            return true;
        }

        // Users can update their own profile
        if ($user->id === $model->id) {
            return true;
        }

        // Company owners can update users in their company
        if ($company && $user->company_id === $company->id && $user->hasRole('company_owner') && $model->company_id === $company->id) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, User $model, Company $company = null): bool
    {
        // Super admins can delete any user (except themselves)
        if ($user->hasRole('super_admin') && $user->id !== $model->id) {
            return true;
        }

        // Company owners can delete users in their company (except themselves)
        if ($company && $user->company_id === $company->id && $user->hasRole('company_owner') && 
            $model->company_id === $company->id && $user->id !== $model->id) {
            return true;
        }

        return false;
    }
}
