<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\CompanySubscription;
use App\Models\SubscriptionPlan;
use App\Models\SubscriptionPayment;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class CompanySubscriptionController extends Controller
{
    /**
     * Display a listing of the company's subscriptions.
     */
    public function index(Company $company)
    {
        $this->authorize('viewAny', [CompanySubscription::class, $company]);

        $subscriptions = $company->subscriptions()
            ->with('plan')
            ->latest()
            ->paginate(10);

        $plans = SubscriptionPlan::where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Companies/Subscriptions/Index', [
            'company' => $company,
            'subscriptions' => $subscriptions,
            'plans' => $plans,
        ]);
    }

    /**
     * Show the form for creating a new subscription.
     */
    public function create(Company $company)
    {
        $this->authorize('create', [CompanySubscription::class, $company]);

        $plans = SubscriptionPlan::where('is_active', true)
            ->orderBy('monthly_price')
            ->get();

        return Inertia::render('Admin/Companies/Subscriptions/Create', [
            'company' => $company,
            'plans' => $plans,
        ]);
    }

    /**
     * Store a newly created subscription in storage.
     */
    public function store(Request $request, Company $company)
    {
        $this->authorize('create', [CompanySubscription::class, $company]);

        $validated = $request->validate([
            'subscription_plan_id' => 'required|exists:subscription_plans,id',
            'billing_cycle' => 'required|in:monthly,yearly',
            'start_date' => 'required|date',
            'payment_method' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        // Get the selected plan
        $plan = SubscriptionPlan::findOrFail($validated['subscription_plan_id']);

        // Calculate the recurring fee based on billing cycle
        $recurringFee = $validated['billing_cycle'] === 'monthly' 
            ? $plan->monthly_price 
            : $plan->yearly_price;

        // Calculate the end date based on billing cycle
        $startDate = Carbon::parse($validated['start_date']);
        $endDate = $validated['billing_cycle'] === 'monthly' 
            ? $startDate->copy()->addMonth() 
            : $startDate->copy()->addYear();

        // Create the subscription
        $subscription = $company->subscriptions()->create([
            'subscription_plan_id' => $plan->id,
            'status' => 'active',
            'billing_cycle' => $validated['billing_cycle'],
            'start_date' => $startDate,
            'end_date' => $endDate,
            'next_billing_date' => $endDate,
            'setup_fee_paid' => $plan->setup_fee,
            'recurring_fee' => $recurringFee,
        ]);

        // Create setup fee payment record if setup fee is greater than 0
        if ($plan->setup_fee > 0) {
            $subscription->payments()->create([
                'company_id' => $company->id,
                'payment_type' => 'setup_fee',
                'amount' => $plan->setup_fee,
                'status' => 'completed',
                'payment_method' => $validated['payment_method'],
                'notes' => $validated['notes'],
                'paid_at' => now(),
            ]);
        }

        // Create first recurring payment record
        $subscription->payments()->create([
            'company_id' => $company->id,
            'payment_type' => $validated['billing_cycle'],
            'amount' => $recurringFee,
            'status' => 'completed',
            'payment_method' => $validated['payment_method'],
            'notes' => $validated['notes'],
            'paid_at' => now(),
        ]);

        return redirect()->route('admin.companies.subscriptions.show', [$company->id, $subscription->id])
            ->with('success', 'Subscription created successfully.');
    }

    /**
     * Display the specified subscription.
     */
    public function show(Company $company, CompanySubscription $subscription)
    {
        $this->authorize('view', [$subscription, $company]);

        $subscription->load(['plan', 'payments']);

        return Inertia::render('Admin/Companies/Subscriptions/Show', [
            'company' => $company,
            'subscription' => $subscription,
        ]);
    }

    /**
     * Show the form for editing the specified subscription.
     */
    public function edit(Company $company, CompanySubscription $subscription)
    {
        $this->authorize('update', [$subscription, $company]);

        $plans = SubscriptionPlan::where('is_active', true)
            ->orderBy('monthly_price')
            ->get();

        $subscription->load('plan');

        return Inertia::render('Admin/Companies/Subscriptions/Edit', [
            'company' => $company,
            'subscription' => $subscription,
            'plans' => $plans,
        ]);
    }

    /**
     * Update the specified subscription in storage.
     */
    public function update(Request $request, Company $company, CompanySubscription $subscription)
    {
        $this->authorize('update', [$subscription, $company]);

        $validated = $request->validate([
            'subscription_plan_id' => 'required|exists:subscription_plans,id',
            'billing_cycle' => 'required|in:monthly,yearly',
            'status' => 'required|in:active,canceled,expired',
            'cancellation_reason' => 'nullable|string|required_if:status,canceled',
        ]);

        // If changing plan or billing cycle, recalculate fees and dates
        if ($subscription->subscription_plan_id != $validated['subscription_plan_id'] || 
            $subscription->billing_cycle != $validated['billing_cycle']) {
            
            // Get the selected plan
            $plan = SubscriptionPlan::findOrFail($validated['subscription_plan_id']);
            
            // Calculate the recurring fee based on billing cycle
            $recurringFee = $validated['billing_cycle'] === 'monthly' 
                ? $plan->monthly_price 
                : $plan->yearly_price;
            
            // Calculate the new end date based on billing cycle
            $startDate = $subscription->start_date;
            $endDate = $validated['billing_cycle'] === 'monthly' 
                ? $startDate->copy()->addMonth() 
                : $startDate->copy()->addYear();
            
            // Update subscription with new plan details
            $subscription->update([
                'subscription_plan_id' => $plan->id,
                'billing_cycle' => $validated['billing_cycle'],
                'end_date' => $endDate,
                'next_billing_date' => $endDate,
                'recurring_fee' => $recurringFee,
                'status' => $validated['status'],
                'cancellation_reason' => $validated['cancellation_reason'] ?? null,
            ]);
        } else {
            // Just update status
            $subscription->update([
                'status' => $validated['status'],
                'cancellation_reason' => $validated['cancellation_reason'] ?? null,
            ]);
        }

        return redirect()->route('admin.companies.subscriptions.show', [$company->id, $subscription->id])
            ->with('success', 'Subscription updated successfully.');
    }

    /**
     * Record a new payment for the subscription.
     */
    public function recordPayment(Request $request, Company $company, CompanySubscription $subscription)
    {
        $this->authorize('update', [$subscription, $company]);

        $validated = $request->validate([
            'payment_type' => 'required|in:setup_fee,monthly,yearly',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|string',
            'status' => 'required|in:pending,completed,failed',
            'transaction_id' => 'nullable|string',
            'notes' => 'nullable|string',
            'paid_at' => 'nullable|date',
        ]);

        // Create the payment record
        $payment = $subscription->payments()->create([
            'company_id' => $company->id,
            'payment_type' => $validated['payment_type'],
            'amount' => $validated['amount'],
            'status' => $validated['status'],
            'payment_method' => $validated['payment_method'],
            'transaction_id' => $validated['transaction_id'],
            'notes' => $validated['notes'],
            'paid_at' => $validated['paid_at'] ?? now(),
        ]);

        // If this is a recurring payment and it's completed, update the next billing date
        if (in_array($validated['payment_type'], ['monthly', 'yearly']) && $validated['status'] === 'completed') {
            $nextBillingDate = $validated['payment_type'] === 'monthly'
                ? now()->addMonth()
                : now()->addYear();
                
            $subscription->update([
                'next_billing_date' => $nextBillingDate,
            ]);
        }

        return redirect()->route('admin.companies.subscriptions.show', [$company->id, $subscription->id])
            ->with('success', 'Payment recorded successfully.');
    }

    /**
     * Cancel the specified subscription.
     */
    public function cancel(Request $request, Company $company, CompanySubscription $subscription)
    {
        $this->authorize('update', [$subscription, $company]);

        $validated = $request->validate([
            'cancellation_reason' => 'required|string',
        ]);

        $subscription->update([
            'status' => 'canceled',
            'cancellation_reason' => $validated['cancellation_reason'],
        ]);

        return redirect()->route('admin.companies.subscriptions.show', [$company->id, $subscription->id])
            ->with('success', 'Subscription canceled successfully.');
    }

    /**
     * Renew the specified subscription.
     */
    public function renew(Request $request, Company $company, CompanySubscription $subscription)
    {
        $this->authorize('update', [$subscription, $company]);

        $validated = $request->validate([
            'payment_method' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        // Calculate new dates based on current billing cycle
        $startDate = now();
        $endDate = $subscription->billing_cycle === 'monthly'
            ? $startDate->copy()->addMonth()
            : $startDate->copy()->addYear();

        // Update subscription
        $subscription->update([
            'status' => 'active',
            'start_date' => $startDate,
            'end_date' => $endDate,
            'next_billing_date' => $endDate,
            'cancellation_reason' => null,
        ]);

        // Create payment record
        $subscription->payments()->create([
            'company_id' => $company->id,
            'payment_type' => $subscription->billing_cycle,
            'amount' => $subscription->recurring_fee,
            'status' => 'completed',
            'payment_method' => $validated['payment_method'],
            'notes' => $validated['notes'],
            'paid_at' => now(),
        ]);

        return redirect()->route('admin.companies.subscriptions.show', [$company->id, $subscription->id])
            ->with('success', 'Subscription renewed successfully.');
    }

    /**
     * Remove the specified subscription from storage.
     */
    public function destroy(Company $company, CompanySubscription $subscription)
    {
        $this->authorize('delete', [$subscription, $company]);

        // Check if this is an active subscription
        if ($subscription->status === 'active') {
            return redirect()->route('admin.companies.subscriptions.index', $company->id)
                ->with('error', 'Cannot delete an active subscription. Please cancel it first.');
        }

        // Delete related payments
        $subscription->payments()->delete();
        
        // Delete the subscription
        $subscription->delete();

        return redirect()->route('admin.companies.subscriptions.index', $company->id)
            ->with('success', 'Subscription deleted successfully.');
    }

    /**
     * Show the form for creating a new payment.
     */
    public function createPayment(Company $company, CompanySubscription $subscription)
    {
        $this->authorize('update', [$subscription, $company]);

        return Inertia::render('Admin/Companies/Subscriptions/Payments/Create', [
            'company' => $company,
            'subscription' => $subscription->load('plan'),
        ]);
    }

    /**
     * Store a newly created payment in storage.
     */
    public function storePayment(Request $request, Company $company, CompanySubscription $subscription)
    {
        $this->authorize('update', [$subscription, $company]);

        $validated = $request->validate([
            'payment_type' => 'required|in:monthly,yearly,setup_fee,other',
            'amount' => 'required|numeric|min:0',
            'status' => 'required|in:completed,pending,failed',
            'payment_method' => 'required|string',
            'paid_at' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $subscription->payments()->create([
            'company_id' => $company->id,
            'payment_type' => $validated['payment_type'],
            'amount' => $validated['amount'],
            'status' => $validated['status'],
            'payment_method' => $validated['payment_method'],
            'notes' => $validated['notes'],
            'paid_at' => Carbon::parse($validated['paid_at']),
        ]);

        return redirect()->route('admin.companies.subscriptions.show', [$company->id, $subscription->id])
            ->with('success', 'Payment recorded successfully.');
    }
}
