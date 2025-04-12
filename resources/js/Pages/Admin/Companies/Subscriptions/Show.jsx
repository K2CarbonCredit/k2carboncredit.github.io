import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FiArrowLeft, FiCalendar, FiCreditCard, FiDollarSign, FiEdit, FiPlus, FiRefreshCw, FiX } from 'react-icons/fi';

export default function Show({ auth, company, subscription }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'active':
                return 'badge-success';
            case 'canceled':
                return 'badge-error';
            case 'expired':
                return 'badge-warning';
            default:
                return 'badge-info';
        }
    };

    const getPaymentStatusBadgeClass = (status) => {
        switch (status) {
            case 'completed':
                return 'badge-success';
            case 'pending':
                return 'badge-warning';
            case 'failed':
                return 'badge-error';
            default:
                return 'badge-info';
        }
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-base-content leading-tight">
                        Subscription Details
                    </h2>
                    <div className="flex gap-2">
                        <Link 
                            href={route('admin.companies.subscriptions.edit', [company.id, subscription.id])} 
                            className="btn btn-sm btn-primary"
                        >
                            <FiEdit className="mr-1" /> Edit Subscription
                        </Link>
                        <Link 
                            href={route('admin.companies.subscriptions.index', company.id)} 
                            className="btn btn-sm btn-outline"
                        >
                            <FiArrowLeft className="mr-1" /> Back to Subscriptions
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Subscription Details - ${company.name}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Subscription Details Card */}
                        <div className="md:col-span-2">
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-2xl font-bold">{subscription.plan.name}</h3>
                                            <div className={`badge ${getStatusBadgeClass(subscription.status)} mt-1`}>
                                                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-primary">
                                                {formatCurrency(subscription.recurring_fee)}
                                                <span className="text-base font-normal text-base-content/70">
                                                    /{subscription.billing_cycle === 'monthly' ? 'month' : 'year'}
                                                </span>
                                            </div>
                                            <div className="text-sm text-base-content/70">
                                                {subscription.billing_cycle === 'monthly' ? 'Monthly' : 'Yearly'} billing
                                            </div>
                                        </div>
                                    </div>

                                    <div className="divider mt-2"></div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-semibold mb-3">Subscription Information</h4>
                                            <ul className="space-y-3">
                                                <li className="flex items-center">
                                                    <FiCalendar className="mr-2 text-primary" />
                                                    <div>
                                                        <div className="text-sm text-base-content/70">Start Date</div>
                                                        <div>{formatDate(subscription.start_date)}</div>
                                                    </div>
                                                </li>
                                                <li className="flex items-center">
                                                    <FiCalendar className="mr-2 text-primary" />
                                                    <div>
                                                        <div className="text-sm text-base-content/70">End Date</div>
                                                        <div>{formatDate(subscription.end_date)}</div>
                                                    </div>
                                                </li>
                                                <li className="flex items-center">
                                                    <FiCalendar className="mr-2 text-primary" />
                                                    <div>
                                                        <div className="text-sm text-base-content/70">Next Billing Date</div>
                                                        <div>{formatDate(subscription.next_billing_date)}</div>
                                                    </div>
                                                </li>
                                                <li className="flex items-center">
                                                    <FiDollarSign className="mr-2 text-primary" />
                                                    <div>
                                                        <div className="text-sm text-base-content/70">Setup Fee</div>
                                                        <div>{formatCurrency(subscription.setup_fee_paid)}</div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold mb-3">Plan Details</h4>
                                            <div className="p-4 bg-base-200 rounded-lg">
                                                <h5 className="font-medium mb-2">{subscription.plan.name}</h5>
                                                <p className="text-sm mb-3">{subscription.plan.description}</p>
                                                <div className="flex items-center mb-1">
                                                    <FiDollarSign className="mr-1 text-primary" />
                                                    <span className="text-sm">
                                                        Monthly: {formatCurrency(subscription.plan.monthly_price)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center mb-1">
                                                    <FiDollarSign className="mr-1 text-primary" />
                                                    <span className="text-sm">
                                                        Yearly: {formatCurrency(subscription.plan.yearly_price)}
                                                    </span>
                                                </div>
                                                {subscription.plan.setup_fee > 0 && (
                                                    <div className="flex items-center">
                                                        <FiDollarSign className="mr-1 text-primary" />
                                                        <span className="text-sm">
                                                            Setup Fee: {formatCurrency(subscription.plan.setup_fee)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {subscription.status === 'canceled' && subscription.cancellation_reason && (
                                        <div className="mt-6">
                                            <h4 className="font-semibold mb-2">Cancellation Reason</h4>
                                            <div className="p-4 bg-base-200 rounded-lg">
                                                <p className="text-sm whitespace-pre-line">{subscription.cancellation_reason}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="card-actions justify-end mt-6">
                                        {subscription.status === 'active' && (
                                            <Link 
                                                href={route('admin.companies.subscriptions.cancel', [company.id, subscription.id])} 
                                                method="post" 
                                                className="btn btn-error"
                                            >
                                                <FiX className="mr-1" /> Cancel Subscription
                                            </Link>
                                        )}
                                        {subscription.status !== 'active' && (
                                            <Link 
                                                href={route('admin.companies.subscriptions.renew', [company.id, subscription.id])} 
                                                method="post" 
                                                className="btn btn-success"
                                            >
                                                <FiRefreshCw className="mr-1" /> Renew Subscription
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment History Card */}
                        <div>
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="card-title">Payment History</h3>
                                        <Link 
                                            href={route('admin.companies.subscriptions.payments.create', [company.id, subscription.id])} 
                                            className="btn btn-sm btn-outline btn-primary"
                                        >
                                            <FiPlus className="mr-1" /> Record Payment
                                        </Link>
                                    </div>

                                    {subscription.payments && subscription.payments.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="table table-zebra w-full">
                                                <thead>
                                                    <tr>
                                                        <th>Date</th>
                                                        <th>Type</th>
                                                        <th>Amount</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {subscription.payments.map(payment => (
                                                        <tr key={payment.id}>
                                                            <td>{formatDate(payment.paid_at || payment.created_at)}</td>
                                                            <td>
                                                                <span className="capitalize">
                                                                    {payment.payment_type.replace('_', ' ')}
                                                                </span>
                                                            </td>
                                                            <td>{formatCurrency(payment.amount)}</td>
                                                            <td>
                                                                <div className={`badge ${getPaymentStatusBadgeClass(payment.status)}`}>
                                                                    {payment.status}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="alert alert-info">
                                            <div>
                                                <span>No payment records found</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
