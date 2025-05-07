import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FiEdit, FiTrash2, FiEye, FiPlus, FiCreditCard, FiCheck, FiX, FiRefreshCw, FiDollarSign } from 'react-icons/fi';
import Pagination from '@/Components/Pagination';
import Modal from '@/Components/Modal';

export default function SubscriptionIndex({ auth, company, subscriptions, plans }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [subscriptionToDelete, setSubscriptionToDelete] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [subscriptionForPayment, setSubscriptionForPayment] = useState(null);

    const confirmDelete = (subscription) => {
        setSubscriptionToDelete(subscription);
        setShowDeleteModal(true);
    };

    const deleteSubscription = () => {
        if (subscriptionToDelete) {
            window.location.href = route('admin.companies.subscriptions.destroy', [company.id, subscriptionToDelete.id]);
        }
    };

    const openPaymentModal = (subscription) => {
        setSubscriptionForPayment(subscription);
        setShowPaymentModal(true);
    };

    const statusBadge = (status) => {
        const colors = {
            active: 'badge-success',
            cancelled: 'badge-error',
            expired: 'badge-warning',
            pending: 'badge-info',
        };

        const icons = {
            active: <FiCheck size={14} />,
            cancelled: <FiX size={14} />,
            expired: <FiX size={14} />,
            pending: <FiRefreshCw size={14} />,
        };

        return (
            <div className={`badge ${colors[status] || 'badge-ghost'} flex items-center gap-1`}>
                {icons[status]}
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </div>
        );
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        amount: '',
        payment_date: new Date().toISOString().substr(0, 10),
        payment_method: 'bank_transfer',
        notes: '',
    });

    const recordPayment = (e) => {
        e.preventDefault();
        post(route('admin.companies.subscriptions.record-payment', [company.id, subscriptionForPayment.id]), {
            onSuccess: () => {
                reset();
                setShowPaymentModal(false);
            },
        });
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-base-content leading-tight">
                        {company.name} - Subscriptions
                    </h2>
                    <div className="flex gap-2">
                        <Link href={route('admin.companies.show', company.id)}>
                            <button type="button" className="btn btn-outline btn-sm">
                                <FiEye className="mr-1" /> Company Details
                            </button>
                        </Link>
                        <Link href={route('admin.companies.subscriptions.create', company.id)}>
                            <button type="button" className="btn btn-primary btn-sm">
                                <FiPlus className="mr-1" /> Add Subscription
                            </button>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`${company.name} - Subscriptions`} />

            <div className="py-6">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h3 className="card-title text-base-content mb-4">Subscription History</h3>
                        <div className="divider mt-0"></div>

                        {/* Active Subscription Card */}
                        {subscriptions && subscriptions.data && subscriptions.data.some(sub =>
                            sub.status === 'active' &&
                            (statusFilter === 'all' || sub.status === statusFilter) &&
                            (searchTerm === '' || sub.plan.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        ) && (
                            <div className="mb-8">
                                <h4 className="font-semibold text-lg mb-3">Active Subscription</h4>
                                {subscriptions.data
                                    .filter(sub =>
                                        sub.status === 'active' &&
                                        (statusFilter === 'all' || sub.status === statusFilter) &&
                                        (searchTerm === '' || sub.plan.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                    )
                                    .map(subscription => (
                                    <div key={subscription.id} className="card bg-base-200">
                                        <div className="card-body">
                                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                                <div>
                                                    <h3 className="text-xl font-bold">{subscription.plan.name}</h3>
                                                    <div className="mt-2 flex flex-col gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium">Status:</span>
                                                            {statusBadge(subscription.status)}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Billing Cycle:</span> {subscription.billing_cycle}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Start Date:</span> {new Date(subscription.start_date).toLocaleDateString()}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Renewal Date:</span> {new Date(subscription.renewal_date).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2 justify-center">
                                                    <div className="text-2xl font-bold text-primary">
                                                        ${subscription.amount} <span className="text-sm font-normal">/ {subscription.billing_cycle}</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        <Link href={route('admin.companies.subscriptions.edit', [company.id, subscription.id])} className="btn btn-sm btn-outline">
                                                            <FiEdit className="mr-1" /> Edit
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline"
                                                            onClick={() => openPaymentModal(subscription)}
                                                        >
                                                            <FiDollarSign className="mr-1" /> Record Payment
                                                        </button>
                                                        <Link
                                                            href={route('admin.companies.subscriptions.cancel', [company.id, subscription.id])}
                                                            method="post"
                                                            className="btn btn-sm btn-error"
                                                        >
                                                            <FiX className="mr-1" /> Cancel
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Subscriptions Table */}
                        <div className="overflow-x-auto w-full">
                            <table className="table table-zebra w-full">
                                <thead>
                                    <tr>
                                        <th>Plan</th>
                                        <th>Status</th>
                                        <th>Amount</th>
                                        <th>Billing Cycle</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subscriptions.data.length > 0 ? (
                                        subscriptions.data.map((subscription) => (
                                            <tr key={subscription.id}>
                                                <td className="font-medium">{subscription.plan.name}</td>
                                                <td>{statusBadge(subscription.status)}</td>
                                                <td>${subscription.amount}</td>
                                                <td>{subscription.billing_cycle}</td>
                                                <td>{new Date(subscription.start_date).toLocaleDateString()}</td>
                                                <td>{subscription.end_date ? new Date(subscription.end_date).toLocaleDateString() : '-'}</td>
                                                <td>
                                                    <div className="flex flex-wrap gap-2">
                                                        <Link href={route('admin.companies.subscriptions.show', [company.id, subscription.id])} className="btn btn-ghost btn-xs">
                                                            <FiEye className="text-primary" />
                                                        </Link>
                                                        <Link href={route('admin.companies.subscriptions.edit', [company.id, subscription.id])} className="btn btn-ghost btn-xs">
                                                            <FiEdit className="text-warning" />
                                                        </Link>
                                                        {subscription.status === 'expired' && (
                                                            <Link
                                                                href={route('admin.companies.subscriptions.renew', [company.id, subscription.id])}
                                                                method="post"
                                                                className="btn btn-ghost btn-xs"
                                                            >
                                                                <FiRefreshCw className="text-success" />
                                                            </Link>
                                                        )}
                                                        <button
                                                            type="button"
                                                            className="btn btn-ghost btn-xs"
                                                            onClick={() => confirmDelete(subscription)}
                                                        >
                                                            <FiTrash2 className="text-error" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center py-4">
                                                <div className="alert alert-info">
                                                    No subscriptions found.
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <Pagination class="mt-6" links={subscriptions.links} />
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-base-content">
                        Are you sure you want to delete this subscription?
                    </h2>

                    <p className="mt-1 text-sm text-base-content">
                        This action cannot be undone. All payment records associated with this subscription will also be deleted.
                    </p>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button className="btn btn-outline" onClick={() => setShowDeleteModal(false)}>
                            Cancel
                        </button>

                        <button className="btn btn-error" onClick={deleteSubscription}>
                            Delete Subscription
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Payment Modal */}
            <Modal show={showPaymentModal} onClose={() => setShowPaymentModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-base-content mb-4">
                        Record Payment
                    </h2>

                    {subscriptionForPayment && (
                        <div className="mb-4 p-3 bg-base-200 rounded-lg">
                            <div className="font-medium">Plan: {subscriptionForPayment.plan.name}</div>
                            <div>Amount: ${subscriptionForPayment.amount}</div>
                            <div>Billing Cycle: {subscriptionForPayment.billing_cycle}</div>
                        </div>
                    )}

                    <form onSubmit={recordPayment}>
                        <div className="mb-4">
                            <label className="form-control w-full">
                                <div className="label">
                                    <span className="label-text">Amount</span>
                                </div>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="input input-bordered w-full"
                                    value={data.amount}
                                    onChange={e => setData('amount', e.target.value)}
                                    required
                                />
                                {errors.amount && <div className="text-error text-sm mt-1">{errors.amount}</div>}
                            </label>
                        </div>

                        <div className="mb-4">
                            <label className="form-control w-full">
                                <div className="label">
                                    <span className="label-text">Payment Date</span>
                                </div>
                                <input
                                    type="date"
                                    className="input input-bordered w-full"
                                    value={data.payment_date}
                                    onChange={e => setData('payment_date', e.target.value)}
                                    required
                                />
                                {errors.payment_date && <div className="text-error text-sm mt-1">{errors.payment_date}</div>}
                            </label>
                        </div>

                        <div className="mb-4">
                            <label className="form-control w-full">
                                <div className="label">
                                    <span className="label-text">Payment Method</span>
                                </div>
                                <select
                                    className="select select-bordered w-full"
                                    value={data.payment_method}
                                    onChange={e => setData('payment_method', e.target.value)}
                                    required
                                >
                                    <option value="bank_transfer">Bank Transfer</option>
                                    <option value="credit_card">Credit Card</option>
                                    <option value="paypal">PayPal</option>
                                    <option value="check">Check</option>
                                    <option value="cash">Cash</option>
                                    <option value="other">Other</option>
                                </select>
                                {errors.payment_method && <div className="text-error text-sm mt-1">{errors.payment_method}</div>}
                            </label>
                        </div>

                        <div className="mb-4">
                            <label className="form-control w-full">
                                <div className="label">
                                    <span className="label-text">Notes</span>
                                </div>
                                <textarea
                                    className="textarea textarea-bordered w-full"
                                    value={data.notes}
                                    onChange={e => setData('notes', e.target.value)}
                                    rows="3"
                                ></textarea>
                                {errors.notes && <div className="text-error text-sm mt-1">{errors.notes}</div>}
                            </label>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button type="button" className="btn btn-outline" onClick={() => setShowPaymentModal(false)}>
                                Cancel
                            </button>

                            <button type="submit" className="btn btn-primary" disabled={processing}>
                                Record Payment
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AdminLayout>
    );
}
