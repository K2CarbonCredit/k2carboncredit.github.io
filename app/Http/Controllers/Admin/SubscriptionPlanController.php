<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SubscriptionPlanController extends Controller
{
    /**
     * Display a listing of the subscription plans.
     */
    public function index()
    {
        $this->authorize('viewAny', SubscriptionPlan::class);

        $plans = SubscriptionPlan::orderBy('monthly_price')->get();

        return Inertia::render('Admin/Subscriptions/Plans/Index', [
            'plans' => $plans,
        ]);
    }

    /**
     * Show the form for creating a new subscription plan.
     */
    public function create()
    {
        $this->authorize('create', SubscriptionPlan::class);

        return Inertia::render('Admin/Subscriptions/Plans/Create');
    }

    /**
     * Store a newly created subscription plan in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', SubscriptionPlan::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'setup_fee' => 'required|numeric|min:0',
            'monthly_price' => 'required|numeric|min:0',
            'yearly_price' => 'required|numeric|min:0',
            'is_popular' => 'boolean',
            'is_active' => 'boolean',
            'max_vehicles' => 'nullable|integer|min:1',
            'features' => 'nullable|array',
        ]);

        // Generate slug from name
        $validated['slug'] = Str::slug($validated['name']);

        // Create the subscription plan
        $plan = SubscriptionPlan::create($validated);

        return redirect()->route('admin.plans.index')
            ->with('success', 'Subscription plan created successfully.');
    }

    /**
     * Display the specified subscription plan.
     */
    public function show(SubscriptionPlan $plan)
    {
        $this->authorize('view', $plan);

        return Inertia::render('Admin/Subscriptions/Plans/Show', [
            'plan' => $plan,
        ]);
    }

    /**
     * Show the form for editing the specified subscription plan.
     */
    public function edit(SubscriptionPlan $plan)
    {
        $this->authorize('update', $plan);

        return Inertia::render('Admin/Subscriptions/Plans/Edit', [
            'plan' => $plan,
        ]);
    }

    /**
     * Update the specified subscription plan in storage.
     */
    public function update(Request $request, SubscriptionPlan $plan)
    {
        $this->authorize('update', $plan);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'setup_fee' => 'required|numeric|min:0',
            'monthly_price' => 'required|numeric|min:0',
            'yearly_price' => 'required|numeric|min:0',
            'is_popular' => 'boolean',
            'is_active' => 'boolean',
            'max_vehicles' => 'nullable|integer|min:1',
            'features' => 'nullable|array',
        ]);

        // Update slug only if name has changed
        if ($plan->name !== $validated['name']) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        // Update the subscription plan
        $plan->update($validated);

        return redirect()->route('admin.plans.index')
            ->with('success', 'Subscription plan updated successfully.');
    }

    /**
     * Remove the specified subscription plan from storage.
     */
    public function destroy(SubscriptionPlan $plan)
    {
        $this->authorize('delete', $plan);

        // Check if the plan has any active subscriptions
        if ($plan->subscriptions()->where('status', 'active')->exists()) {
            return back()->with('error', 'Cannot delete a plan with active subscriptions.');
        }

        $plan->delete();

        return redirect()->route('admin.subscriptions.plans.index')
            ->with('success', 'Subscription plan deleted successfully.');
    }
}
