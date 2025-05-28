import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FiEdit, FiUsers, FiUserPlus, FiMail, FiPhone, FiGlobe, FiMapPin, FiInfo, FiArrowLeft, FiCreditCard, FiDollarSign, FiCalendar, FiPlus } from 'react-icons/fi';

export default function Show({ auth, company, userCount, companyOwners, activeSubscription }) {
    return (
        <AdminLayout
            user={auth.user}
        >
            <Head title={`${company.name} - Company Details`} />

            <div>
                <div className="card bg-base-100 shadow-xl mb-6">
                    <div className="card-body">
                        <div className="card-header flex items-center justify-between mb-4">
                            <h3 className="card-title text-base-content text-xl font-semibold inline-block">Company Details</h3>
                            <div className="flex gap-2">
                                <Link href={route('admin.companies.edit', company.id)} className="btn btn-primary btn-sm">
                                    <FiEdit className="mr-1" /> Edit Company
                                </Link>
                                <Link href={route('admin.companies.index')} className="btn btn-outline btn-sm">
                                    <FiArrowLeft className="mr-1" /> Back to Companies
                                </Link>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Company Info Card */}
                            <div className="md:col-span-2">
                                <div className="card bg-base-100 shadow-sm border border-base-300">
                                    <div className="card-body">
                                        <div className="flex items-center mb-6">
                                            {company.logo ? (
                                                <img
                                                    src={`/storage/${company.logo}`}
                                                    alt={company.name}
                                                    className="w-16 h-16 object-cover rounded-full mr-4"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 bg-base-300 rounded-full flex items-center justify-center mr-4">
                                                    <span className="text-base-content text-xl font-bold">
                                                        {company.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="text-2xl font-bold text-base-content">{company.name}</h3>
                                                <div className={`badge ${
                                                    company.status === 'active' ? 'badge-success' :
                                                    company.status === 'inactive' ? 'badge-error' :
                                                    'badge-warning'
                                                }`}>
                                                    {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="divider mt-0"></div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="card-title text-base-content mb-4 text-base">Contact Information</h4>
                                                <ul className="space-y-3">
                                                    <li className="flex items-center">
                                                        <FiMail className="mr-2 text-primary" />
                                                        <a href={`mailto:${company.email}`} className="text-primary hover:underline">
                                                            {company.email}
                                                        </a>
                                                    </li>
                                                    <li className="flex items-center">
                                                        <FiPhone className="mr-2 text-primary" />
                                                        <a href={`tel:${company.phone}`} className="text-primary hover:underline">
                                                            {company.phone}
                                                        </a>
                                                    </li>
                                                    {company.website && (
                                                        <li className="flex items-center">
                                                            <FiGlobe className="mr-2 text-primary" />
                                                            <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                                                {company.website}
                                                            </a>
                                                        </li>
                                                    )}
                                                </ul>
                                            </div>

                                            <div>
                                                <h4 className="card-title text-base-content mb-4 text-base">Address</h4>
                                                <address className="not-italic">
                                                    <div className="flex items-start">
                                                        <FiMapPin className="mr-2 mt-1 text-primary" />
                                                        <div>
                                                            {company.address_line_1}<br />
                                                            {company.address_line_2 && <>{company.address_line_2}<br /></>}
                                                            {company.city}, {company.state} {company.postal_code}<br />
                                                            {company.country}
                                                        </div>
                                                    </div>
                                                </address>
                                            </div>
                                        </div>

                                        {company.description && (
                                            <>
                                                <div className="divider mt-6"></div>
                                                <div>
                                                    <h4 className="card-title text-base-content mb-4 text-base">About</h4>
                                                    <p className="text-base-content/80">{company.description}</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Company Stats Card */}
                            <div className="col-span-1">
                                <div className="card bg-base-100 shadow-sm border border-base-300">
                                    <div className="card-body">
                                        <h4 className="card-title text-base-content mb-4">Company Stats</h4>

                                        <div className="stats stats-vertical shadow w-full bg-base-200">
                                            <div className="stat">
                                                <div className="stat-title">Users</div>
                                                <div className="stat-value text-primary">{userCount}</div>
                                                <div className="stat-desc">Total registered users</div>
                                            </div>

                                            <div className="stat">
                                                <div className="stat-title">Created</div>
                                                <div className="stat-value text-secondary">
                                                    {new Date(company.created_at).toLocaleDateString()}
                                                </div>
                                                <div className="stat-desc">
                                                    {new Date(company.created_at).toLocaleTimeString()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="divider mt-0"></div>

                                        <h4 className="card-title text-base-content mb-4">Company Owners</h4>
                                        {companyOwners.length > 0 ? (
                                            <ul className="space-y-3">
                                                {companyOwners.map(owner => (
                                                    <li key={owner.id} className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <div className="avatar">
                                                                <div className="w-8 h-8 rounded-full mr-2 bg-base-300 flex items-center justify-center">
                                                                    <span className="text-xs font-bold">{owner.name.charAt(0).toUpperCase()}</span>
                                                                </div>
                                                            </div>
                                                            <span>{owner.name}</span>
                                                        </div>
                                                        <Link href={route('admin.users.show', owner.id)} className="btn btn-ghost btn-xs">
                                                            <FiInfo />
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="alert alert-warning">No company owners found</div>
                                        )}

                                        <div className="divider mt-0"></div>

                                        <h4 className="card-title text-base-content mb-4">Subscription</h4>
                                        {activeSubscription ? (
                                            <div className="mb-4">
                                                <div className="flex items-center mb-2">
                                                    <h5 className="font-semibold">{activeSubscription.plan.name}</h5>
                                                    <span className={`ml-2 badge ${activeSubscription.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                                                        {activeSubscription.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-sm text-base-content/70 mb-1">
                                                    <FiDollarSign className="mr-1" />
                                                    <span>
                                                        {activeSubscription.billing_cycle === 'monthly' ?
                                                            `$${activeSubscription.recurring_fee}/month` :
                                                            `$${activeSubscription.recurring_fee}/year`}
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-sm text-base-content/70">
                                                    <FiCalendar className="mr-1" />
                                                    <span>Renews: {new Date(activeSubscription.next_billing_date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="mt-2">
                                                    <Link
                                                        href={route('admin.companies.subscriptions.show', [company.id, activeSubscription.id])}
                                                        className="btn btn-outline btn-sm btn-info w-full"
                                                    >
                                                        <FiInfo className="mr-1" /> View Details
                                                    </Link>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="alert alert-warning mb-4">
                                                <div>
                                                    <span>No active subscription found</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="divider mt-0"></div>

                                        <div className="space-y-2">
                                            <Link href={route('admin.companies.users.index', company.id)} className="btn btn-outline btn-primary w-full">
                                                <FiUsers className="mr-2" /> Manage Users
                                            </Link>
                                            <Link href={route('admin.companies.users.create', company.id)} className="btn btn-outline w-full">
                                                <FiUserPlus className="mr-2" /> Add User
                                            </Link>
                                            <Link href={route('admin.companies.subscriptions.index', company.id)} className="btn btn-outline w-full">
                                                <FiCreditCard className="mr-2" /> Manage Subscriptions
                                            </Link>
                                            <Link href={route('admin.companies.subscriptions.create', company.id)} className="btn btn-outline w-full">
                                                <FiPlus className="mr-2" /> Add Subscription
                                            </Link>
                                            <Link href={route('admin.companies.impersonate', company.id)} method="post" className="btn btn-outline w-full">
                                                <FiInfo className="mr-2" /> Impersonate Company
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
