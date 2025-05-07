import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FiArrowLeft, FiCalendar, FiCreditCard, FiDollarSign, FiInfo } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function Create({ auth, company, plans }) {
    const [startDate, setStartDate] = useState(new Date());

    const { data, setData, post, processing, errors } = useForm({
        subscription_plan_id: '',
        billing_cycle: 'monthly',
        start_date: new Date().toISOString().split('T')[0],
        payment_method: 'credit_card',
        notes: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        data.start_date = startDate.toISOString().split('T')[0];
        post(route('admin.companies.subscriptions.store', company.id));
    };

    const handleDateChange = (date) => {
        setStartDate(date);
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-base-content leading-tight">
                        Add Subscription for {company.name}
                    </h2>
                    <div className="flex gap-2">
                        <Link href={route('admin.companies.subscriptions.index', company.id)} className="btn btn-sm btn-outline">
                            <FiArrowLeft className="mr-1" /> Back to Subscriptions
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Add Subscription - ${company.name}`} />

            <div className="py-6">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h3 className="card-title text-lg mb-4">New Subscription Details</h3>

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

                                    {/* Start Date */}
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">Start Date</span>
                                        </label>
                                        <div className="relative">
                                            <DatePicker
                                                selected={startDate}
                                                onChange={handleDateChange}
                                                className={`input input-bordered w-full pr-10 ${errors.start_date ? 'input-error' : ''}`}
                                                dateFormat="yyyy-MM-dd"
                                            />
                                            <FiCalendar className="absolute right-3 top-3 text-base-content/50" />
                                        </div>
                                        {errors.start_date && (
                                            <div className="text-error text-sm mt-1">{errors.start_date}</div>
                                        )}
                                    </div>

                                    {/* Payment Method */}
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">Payment Method</span>
                                        </label>
                                        <select
                                            className={`select select-bordered w-full ${errors.payment_method ? 'select-error' : ''}`}
                                            value={data.payment_method}
                                            onChange={e => setData('payment_method', e.target.value)}
                                            required
                                        >
                                            <option value="credit_card">Credit Card</option>
                                            <option value="bank_transfer">Bank Transfer</option>
                                            <option value="paypal">PayPal</option>
                                            <option value="check">Check</option>
                                            <option value="cash">Cash</option>
                                            <option value="other">Other</option>
                                        </select>
                                        {errors.payment_method && (
                                            <div className="text-error text-sm mt-1">{errors.payment_method}</div>
                                        )}
                                    </div>
                                </div>

                                {/* Notes */}
                                <div className="form-control w-full mt-6">
                                    <label className="label">
                                        <span className="label-text">Notes</span>
                                    </label>
                                    <textarea
                                        className={`textarea textarea-bordered h-24 ${errors.notes ? 'textarea-error' : ''}`}
                                        value={data.notes}
                                        onChange={e => setData('notes', e.target.value)}
                                        placeholder="Add any additional notes about this subscription"
                                    ></textarea>
                                    {errors.notes && (
                                        <div className="text-error text-sm mt-1">{errors.notes}</div>
                                    )}
                                </div>

                                <div className="card-actions justify-end mt-6">
                                    <Link
                                        href={route('admin.companies.subscriptions.index', company.id)}
                                        className="btn btn-ghost"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={processing}
                                    >
                                        {processing ? 'Creating...' : 'Create Subscription'}
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
