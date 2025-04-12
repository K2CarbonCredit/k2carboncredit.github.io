import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FiArrowLeft, FiCalendar, FiCreditCard, FiDollarSign } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function Create({ auth, company, subscription }) {
    const [paidDate, setPaidDate] = useState(new Date());
    
    const { data, setData, post, processing, errors } = useForm({
        payment_type: subscription.billing_cycle || 'monthly',
        amount: subscription.recurring_fee || 0,
        status: 'completed',
        payment_method: 'credit_card',
        paid_at: new Date().toISOString().split('T')[0],
        notes: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        data.paid_at = paidDate.toISOString().split('T')[0];
        post(route('admin.companies.subscriptions.payments.store', [company.id, subscription.id]));
    };

    const handleDateChange = (date) => {
        setPaidDate(date);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-base-content leading-tight">
                        Record Payment for {company.name}
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
            <Head title={`Record Payment - ${company.name}`} />

            <div className="py-6">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-2">Subscription Details</h3>
                                <div className="bg-base-200 p-4 rounded-lg">
                                    <div className="flex items-center mb-2">
                                        <FiCreditCard className="mr-2 text-primary" />
                                        <span className="font-medium">{subscription.plan.name}</span>
                                        <span className={`ml-2 badge ${
                                            subscription.status === 'active' ? 'badge-success' : 
                                            subscription.status === 'canceled' ? 'badge-error' : 
                                            'badge-warning'
                                        }`}>
                                            {subscription.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-sm text-base-content/70 mb-1">
                                        <FiDollarSign className="mr-1" />
                                        <span>
                                            {subscription.billing_cycle === 'monthly' ? 
                                                `${formatCurrency(subscription.recurring_fee)}/month` : 
                                                `${formatCurrency(subscription.recurring_fee)}/year`}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <h3 className="card-title text-lg mb-4">Payment Details</h3>
                            
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Payment Type */}
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">Payment Type</span>
                                        </label>
                                        <select 
                                            className={`select select-bordered w-full ${errors.payment_type ? 'select-error' : ''}`}
                                            value={data.payment_type}
                                            onChange={e => setData('payment_type', e.target.value)}
                                            required
                                        >
                                            <option value="monthly">Monthly Payment</option>
                                            <option value="yearly">Yearly Payment</option>
                                            <option value="setup_fee">Setup Fee</option>
                                            <option value="other">Other</option>
                                        </select>
                                        {errors.payment_type && (
                                            <div className="text-error text-sm mt-1">{errors.payment_type}</div>
                                        )}
                                    </div>
                                    
                                    {/* Amount */}
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">Amount</span>
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-3 text-base-content/50">$</span>
                                            <input 
                                                type="number" 
                                                step="0.01"
                                                className={`input input-bordered w-full pl-8 ${errors.amount ? 'input-error' : ''}`}
                                                value={data.amount}
                                                onChange={e => setData('amount', e.target.value)}
                                                required
                                            />
                                        </div>
                                        {errors.amount && (
                                            <div className="text-error text-sm mt-1">{errors.amount}</div>
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
                                            <option value="completed">Completed</option>
                                            <option value="pending">Pending</option>
                                            <option value="failed">Failed</option>
                                        </select>
                                        {errors.status && (
                                            <div className="text-error text-sm mt-1">{errors.status}</div>
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
                                    
                                    {/* Paid Date */}
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">Payment Date</span>
                                        </label>
                                        <div className="relative">
                                            <DatePicker
                                                selected={paidDate}
                                                onChange={handleDateChange}
                                                className={`input input-bordered w-full pr-10 ${errors.paid_at ? 'input-error' : ''}`}
                                                dateFormat="yyyy-MM-dd"
                                            />
                                            <FiCalendar className="absolute right-3 top-3 text-base-content/50" />
                                        </div>
                                        {errors.paid_at && (
                                            <div className="text-error text-sm mt-1">{errors.paid_at}</div>
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
                                        placeholder="Add any additional notes about this payment"
                                    ></textarea>
                                    {errors.notes && (
                                        <div className="text-error text-sm mt-1">{errors.notes}</div>
                                    )}
                                </div>
                                
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
                                        {processing ? 'Recording...' : 'Record Payment'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
