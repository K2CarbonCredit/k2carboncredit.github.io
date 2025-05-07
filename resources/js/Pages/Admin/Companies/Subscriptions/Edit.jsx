import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FiArrowLeft, FiCreditCard, FiDollarSign, FiInfo } from 'react-icons/fi';

export default function Edit({ auth, company, subscription, plans }) {
    const { data, setData, put, processing, errors } = useForm({
        subscription_plan_id: subscription.subscription_plan_id,
        billing_cycle: subscription.billing_cycle,
        status: subscription.status,
        cancellation_reason: subscription.cancellation_reason || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.companies.subscriptions.update', [company.id, subscription.id]));
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-base-content leading-tight">
                        Edit Subscription for {company.name}
                    </h2>
                    <div className="flex gap-2">
                        <Link
                            href={route('admin.companies.subscriptions.show', [company.id, subscription.id])}
                            className="btn btn-sm btn-outline"
                        >
                            <FiArrowLeft className="mr-1" /> Back to Subscription
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Edit Subscription - ${company.name}`} />

            <div className="py-6">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h3 className="card-title text-lg mb-4">Edit Subscription</h3>

                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Subscription Plan */}
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">Subscription Plan</span>
                                        </label>
                                        <select
                                            className={`select select-bordered w-full ${errors.subscription_plan_id ? 'select-error' : ''}`}
                                            value={data.subscription_plan_id}
                                            onChange={e => setData('subscription_plan_id', e.target.value)}
                                            required
                                        >
                                            <option value="" disabled>Select a plan</option>
                                            {plans.map(plan => (
                                                <option key={plan.id} value={plan.id}>
                                                    {plan.name} (${plan.monthly_price}/mo or ${plan.yearly_price}/yr)
                                                </option>
                                            ))}
                                        </select>
                                        {errors.subscription_plan_id && (
                                            <div className="text-error text-sm mt-1">{errors.subscription_plan_id}</div>
                                        )}
                                    </div>

                                    {/* Billing Cycle */}
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">Billing Cycle</span>
                                        </label>
                                        <select
                                            className={`select select-bordered w-full ${errors.billing_cycle ? 'select-error' : ''}`}
                                            value={data.billing_cycle}
                                            onChange={e => setData('billing_cycle', e.target.value)}
                                            required
                                        >
                                            <option value="monthly">Monthly</option>
                                            <option value="yearly">Yearly</option>
                                        </select>
                                        {errors.billing_cycle && (
                                            <div className="text-error text-sm mt-1">{errors.billing_cycle}</div>
                                        )}
                                    </div>

                                    {/* Status */}
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">Status</span>
                                        </label>
                                        <select
                                            className={`select select-bordered w-full ${errors.status ? 'select-error' : ''}`}
                                            value={data.status}
                                            onChange={e => setData('status', e.target.value)}
                                            required
                                        >
                                            <option value="active">Active</option>
                                            <option value="canceled">Canceled</option>
                                            <option value="expired">Expired</option>
                                        </select>
                                        {errors.status && (
                                            <div className="text-error text-sm mt-1">{errors.status}</div>
                                        )}
                                    </div>
                                </div>

                                {/* Cancellation Reason - Only show if status is canceled */}
                                {data.status === 'canceled' && (
                                    <div className="form-control w-full mt-6">
                                        <label className="label">
                                            <span className="label-text">Cancellation Reason</span>
                                        </label>
                                        <textarea
                                            className={`textarea textarea-bordered h-24 ${errors.cancellation_reason ? 'textarea-error' : ''}`}
                                            value={data.cancellation_reason}
                                            onChange={e => setData('cancellation_reason', e.target.value)}
                                            placeholder="Reason for cancellation"
                                            required
                                        ></textarea>
                                        {errors.cancellation_reason && (
                                            <div className="text-error text-sm mt-1">{errors.cancellation_reason}</div>
                                        )}
                                    </div>
                                )}

                                <div className="card-actions justify-end mt-6">
                                    <Link
                                        href={route('admin.companies.subscriptions.show', [company.id, subscription.id])}
                                        className="btn btn-ghost"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={processing}
                                    >
                                        {processing ? 'Saving...' : 'Update Subscription'}
                                    </button>
                                </div>
                            </form>

                            {/* Plan Information */}
                            {data.subscription_plan_id && (
                                <div className="mt-8 p-4 bg-base-200 rounded-lg">
                                    <h4 className="font-semibold flex items-center mb-2">
                                        <FiInfo className="mr-2" /> Plan Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {plans.filter(p => p.id == data.subscription_plan_id).map(plan => (
                                            <React.Fragment key={plan.id}>
                                                <div>
                                                    <div className="flex items-center mb-2">
                                                        <FiCreditCard className="mr-2 text-primary" />
                                                        <span className="font-medium">{plan.name}</span>
                                                    </div>
                                                    <div className="text-sm text-base-content/70 mb-1">
                                                        {plan.description}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex items-center mb-2">
                                                        <FiDollarSign className="mr-2 text-primary" />
                                                        <span className="font-medium">Pricing</span>
                                                    </div>
                                                    <div className="text-sm text-base-content/70 mb-1">
                                                        Monthly: ${plan.monthly_price}
                                                    </div>
                                                    <div className="text-sm text-base-content/70 mb-1">
                                                        Yearly: ${plan.yearly_price}
                                                    </div>
                                                    {plan.setup_fee > 0 && (
                                                        <div className="text-sm text-base-content/70 mb-1">
                                                            Setup Fee: ${plan.setup_fee}
                                                        </div>
                                                    )}
                                                </div>
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
