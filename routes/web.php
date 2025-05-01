<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SuperAdminController;
use App\Http\Controllers\CompanyDashboardController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\CompanyUserController;
use App\Http\Controllers\CompanyTelemetryController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Admin\SubscriptionPlanController;
use App\Http\Controllers\Admin\CompanySubscriptionController;
use App\Http\Controllers\Admin\AssetTypeController;
use App\Http\Controllers\Admin\AssetSubTypeController;
use App\Http\Controllers\Admin\TelemetryProviderController;
use App\Http\Controllers\VehicleMakeController;
use App\Http\Controllers\VehicleModelController;
use App\Http\Controllers\Company\FleetVehicleController;
use App\Http\Controllers\Company\FleetEquipmentController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Authentication routes
require __DIR__.'/auth.php';

// Redirect authenticated users based on their role
Route::get('/dashboard', function () {
    $user = request()->user();
    
    if ($user->hasRole('super_admin')) {
        return redirect()->route('admin.dashboard');
    } else {
        return redirect()->route('company.dashboard');
    }
})->middleware(['auth', 'verified'])->name('dashboard');

// Common authenticated routes
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Super Admin routes
Route::middleware(['auth', 'role:super_admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [SuperAdminController::class, 'dashboard'])->name('dashboard');
    
    // Company management routes
    Route::resource('companies', CompanyController::class);
    Route::post('/companies/{company}/impersonate', [CompanyController::class, 'impersonate'])->name('companies.impersonate');
    Route::post('/stop-impersonating', [SuperAdminController::class, 'stopImpersonating'])->name('stop-impersonating');
    
    // Company user management routes
    Route::get('/companies/{company}/users', [CompanyUserController::class, 'index'])->name('companies.users.index');
    Route::get('/companies/{company}/users/create', [CompanyUserController::class, 'create'])->name('companies.users.create');
    Route::post('/companies/{company}/users', [CompanyUserController::class, 'store'])->name('companies.users.store');
    Route::get('/companies/{company}/users/{user}', [CompanyUserController::class, 'show'])->name('companies.users.show');
    Route::get('/companies/{company}/users/{user}/edit', [CompanyUserController::class, 'edit'])->name('companies.users.edit');
    Route::put('/companies/{company}/users/{user}', [CompanyUserController::class, 'update'])->name('companies.users.update');
    Route::delete('/companies/{company}/users/{user}', [CompanyUserController::class, 'destroy'])->name('companies.users.destroy');
    
    // Subscription Plan Management - Using resource route for simplicity
    Route::resource('subscriptions/plans', SubscriptionPlanController::class);
    
    // Company Subscription Management
    Route::get('/companies/{company}/subscriptions', [CompanySubscriptionController::class, 'index'])->name('companies.subscriptions.index');
    Route::get('/companies/{company}/subscriptions/create', [CompanySubscriptionController::class, 'create'])->name('companies.subscriptions.create');
    Route::post('/companies/{company}/subscriptions', [CompanySubscriptionController::class, 'store'])->name('companies.subscriptions.store');
    Route::get('/companies/{company}/subscriptions/{subscription}', [CompanySubscriptionController::class, 'show'])->name('companies.subscriptions.show');
    Route::get('/companies/{company}/subscriptions/{subscription}/edit', [CompanySubscriptionController::class, 'edit'])->name('companies.subscriptions.edit');
    Route::put('/companies/{company}/subscriptions/{subscription}', [CompanySubscriptionController::class, 'update'])->name('companies.subscriptions.update');
    Route::delete('/companies/{company}/subscriptions/{subscription}', [CompanySubscriptionController::class, 'destroy'])->name('companies.subscriptions.destroy');
    
    // Subscription Payment Management
    Route::get('/companies/{company}/subscriptions/{subscription}/payments/create', [CompanySubscriptionController::class, 'createPayment'])->name('companies.subscriptions.payments.create');

    // Vehicle Makes Management
    Route::resource('fleet/makes', VehicleMakeController::class)->names([
        'index' => 'fleet.makes.index',
        'create' => 'fleet.makes.create',
        'store' => 'fleet.makes.store',
        'show' => 'fleet.makes.show',
        'edit' => 'fleet.makes.edit',
        'update' => 'fleet.makes.update',
        'destroy' => 'fleet.makes.destroy',
    ]);

    // Vehicle Models Management
    Route::resource('fleet/models', VehicleModelController::class)->names([
        'index' => 'fleet.models.index',
        'create' => 'fleet.models.create',
        'store' => 'fleet.models.store',
        'show' => 'fleet.models.show',
        'edit' => 'fleet.models.edit',
        'update' => 'fleet.models.update',
        'destroy' => 'fleet.models.destroy',
    ]);
    Route::post('/companies/{company}/subscriptions/{subscription}/payments', [CompanySubscriptionController::class, 'storePayment'])->name('companies.subscriptions.payments.store');
    
    // Subscription Actions
    Route::post('/companies/{company}/subscriptions/{subscription}/record-payment', [CompanySubscriptionController::class, 'recordPayment'])->name('companies.subscriptions.record-payment');
    Route::post('/companies/{company}/subscriptions/{subscription}/cancel', [CompanySubscriptionController::class, 'cancel'])->name('companies.subscriptions.cancel');
    Route::post('/companies/{company}/subscriptions/{subscription}/renew', [CompanySubscriptionController::class, 'renew'])->name('companies.subscriptions.renew');
    
    // Asset Types Management
    Route::resource('types', AssetTypeController::class);
    
    // Asset Sub-Types Management (nested under asset types)
    Route::get('/types/{type}/sub-types', [AssetSubTypeController::class, 'index'])->name('types.sub-types.index');
    Route::get('/types/{type}/sub-types/create', [AssetSubTypeController::class, 'create'])->name('types.sub-types.create');
    Route::post('/types/{type}/sub-types', [AssetSubTypeController::class, 'store'])->name('types.sub-types.store');
    Route::get('/types/{type}/sub-types/{subType}', [AssetSubTypeController::class, 'show'])->name('types.sub-types.show');
    Route::get('/types/{type}/sub-types/{subType}/edit', [AssetSubTypeController::class, 'edit'])->name('types.sub-types.edit');
    Route::put('/types/{type}/sub-types/{subType}', [AssetSubTypeController::class, 'update'])->name('types.sub-types.update');
    Route::delete('/types/{type}/sub-types/{subType}', [AssetSubTypeController::class, 'destroy'])->name('types.sub-types.destroy');
    
    // Telemetry Providers Management
    Route::resource('telemetry-providers', TelemetryProviderController::class);
    
    // User Management
    Route::resource('users', UserController::class);

    // Vehicle Makes & Models Management
    Route::resource('fleet/makes', VehicleMakeController::class)->names([
        'index' => 'fleet.makes.index',
        'create' => 'fleet.makes.create',
        'store' => 'fleet.makes.store',
        'show' => 'fleet.makes.show',
        'edit' => 'fleet.makes.edit',
        'update' => 'fleet.makes.update',
        'destroy' => 'fleet.makes.destroy',
    ]);
    Route::resource('fleet/models', VehicleModelController::class)->names([
        'index' => 'fleet.models.index',
        'create' => 'fleet.models.create',
        'store' => 'fleet.models.store',
        'show' => 'fleet.models.show',
        'edit' => 'fleet.models.edit',
        'update' => 'fleet.models.update',
        'destroy' => 'fleet.models.destroy',
    ]);
});

// Platform Admin routes
Route::middleware(['auth', 'role:platform_admin'])->prefix('platform')->name('platform.')->group(function () {
    Route::get('/dashboard', function() {
        return Inertia::render('Admin/PlatformDashboard');
    })->name('dashboard');
});

// Company routes (accessible by company_owner, company_user, super_admin when impersonating)
Route::middleware(['auth'])->group(function () {
    Route::get('/company/dashboard', [CompanyDashboardController::class, 'index'])->name('company.dashboard');
    
    // Company Owner only routes
    Route::middleware(['role:company_owner|super_admin'])->group(function () {
        Route::get('/company/settings', function() {
            return Inertia::render('Company/Settings');
        })->name('company.settings');
        
        // Telemetry integration routes
        Route::get('/company/telemetry', [CompanyTelemetryController::class, 'index'])->name('company.telemetry.index');
        Route::post('/company/telemetry/{provider}/toggle', [CompanyTelemetryController::class, 'toggle'])->name('company.telemetry.toggle');
        Route::get('/company/telemetry/{provider}/configure', [CompanyTelemetryController::class, 'configure'])->name('company.telemetry.configure');
        Route::post('/company/telemetry/{provider}/configure', [CompanyTelemetryController::class, 'saveConfiguration'])->name('company.telemetry.save-configuration');
    });
    
    // Carbon Management routes (accessible by company_owner, company_user with proper permissions)
    Route::middleware(['permission:view projects'])->group(function () {
        Route::get('/company/projects', function() {
            return Inertia::render('Company/Projects');
        })->name('company.projects');
    });
    
    Route::middleware(['permission:view carbon inventory'])->group(function () {
        Route::get('/company/inventory', function() {
            return Inertia::render('Company/Inventory');
        })->name('company.inventory');
    });
    
    Route::middleware(['permission:view reports'])->group(function () {
        Route::get('/company/reports', function() {
            return Inertia::render('Company/Reports');
        })->name('company.reports');
    });
    
    Route::middleware(['permission:view marketplace'])->group(function () {
        Route::get('/company/marketplace', function() {
            return Inertia::render('Company/Marketplace');
        })->name('company.marketplace');
    });

    // Fleet Management routes
    Route::prefix('company')->name('company.')->group(function () {
        // Fleet Management
        Route::resource('fleets', \App\Http\Controllers\Company\FleetController::class);
        Route::post('/fleets/{fleet}/assign-vehicles', [\App\Http\Controllers\Company\FleetController::class, 'assignVehicles'])->name('fleets.assign-vehicles');
        Route::post('/fleets/{fleet}/remove-vehicles', [\App\Http\Controllers\Company\FleetController::class, 'removeVehicles'])->name('fleets.remove-vehicles');
        
        // Vehicle Management
        Route::prefix('fleet')->name('fleet.')->group(function () {
            // Vehicle Management
            Route::get('/vehicles', [FleetVehicleController::class, 'index'])->name('vehicles.index');
            Route::get('/vehicles/create', [FleetVehicleController::class, 'create'])->name('vehicles.create');
            Route::post('/vehicles', [FleetVehicleController::class, 'store'])->name('vehicles.store');
            Route::get('/vehicles/{vehicle}/edit', [FleetVehicleController::class, 'edit'])->name('vehicles.edit');
            Route::put('/vehicles/{vehicle}', [FleetVehicleController::class, 'update'])->name('vehicles.update');
            Route::delete('/vehicles/{vehicle}', [FleetVehicleController::class, 'destroy'])->name('vehicles.destroy');
            Route::post('/vehicles/{vehicle}/onboarding-status', [FleetVehicleController::class, 'updateOnboardingStatus'])->name('vehicles.onboarding-status');
            
            // AJAX routes for dependent dropdowns
            Route::get('/subtypes', [FleetVehicleController::class, 'getSubtypes'])->name('subtypes');
            Route::get('/models', [FleetVehicleController::class, 'getModels'])->name('models');
        });
    });
    
    // For backward compatibility - redirect old routes to new ones
    Route::redirect('/company/fleet/create', '/company/fleet/vehicles/create');
    Route::redirect('/company/fleet/{vehicle}/edit', '/company/fleet/vehicles/{vehicle}/edit');
    
    // API routes for dependent dropdowns
    Route::prefix('api')->name('api.')->group(function () {
        Route::get('/subtypes/by-type/{type}', [\App\Http\Controllers\Company\FleetVehicleController::class, 'getSubtypesByType'])->name('subtypes.by.type');
        Route::get('/models/by-make/{make}', [\App\Http\Controllers\Company\FleetVehicleController::class, 'getModelsByMake'])->name('models.by.make');
        Route::get('/manufacturers', [\App\Http\Controllers\Company\FleetEquipmentController::class, 'getManufacturers'])->name('manufacturers');
    });
});
