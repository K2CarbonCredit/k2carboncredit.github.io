import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FiEdit, FiArrowLeft, FiWifi, FiCheck, FiX, FiLink, FiKey, FiCalendar } from 'react-icons/fi';

export default function Show({ auth, provider }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-base-content leading-tight">
                        Telemetry Provider Details
                    </h2>
                    <div className="flex gap-2">
                        <Link href={route('admin.telemetry-providers.index')}>
                            <button type="button" className="btn btn-outline btn-sm">
                                <FiArrowLeft className="mr-1" /> Back to Providers
                            </button>
                        </Link>
                        <Link href={route('admin.telemetry-providers.edit', provider.id)}>
                            <button type="button" className="btn btn-primary btn-sm">
                                <FiEdit className="mr-1" /> Edit Provider
                            </button>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={provider.name} />

            <div className="py-6">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="avatar">
                                <div className="w-16 h-16 rounded-lg bg-base-300 flex items-center justify-center">
                                    {provider.logo ? (
                                        <img src={provider.logo} alt={provider.name} />
                                    ) : (
                                        <FiWifi className="text-primary" size={32} />
                                    )}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">{provider.name}</h3>
                                <div className="mt-1">
                                    {provider.status === 'active' ? (
                                        <div className="badge badge-success gap-1">
                                            <FiCheck size={14} /> Active
                                        </div>
                                    ) : (
                                        <div className="badge badge-error gap-1">
                                            <FiX size={14} /> Inactive
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="divider"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-lg mb-4">Provider Information</h4>
                                
                                {provider.description && (
                                    <div className="mb-4">
                                        <div className="text-sm opacity-70 mb-1">Description</div>
                                        <p className="text-base-content">{provider.description}</p>
                                    </div>
                                )}
                                
                                <div className="mb-4">
                                    <div className="text-sm opacity-70 mb-1">API Endpoint</div>
                                    <div className="flex items-center gap-2">
                                        <FiLink className="text-primary" />
                                        <span>{provider.api_endpoint || 'Not specified'}</span>
                                    </div>
                                </div>
                                
                                <div className="mb-4">
                                    <div className="text-sm opacity-70 mb-1">API Key</div>
                                    <div className="flex items-center gap-2">
                                        <FiKey className="text-primary" />
                                        <span>{provider.api_key ? '••••••••••••••••' : 'Not specified'}</span>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm opacity-70 mb-1">Created At</div>
                                        <div className="flex items-center gap-2">
                                            <FiCalendar className="text-primary" />
                                            <span>{formatDate(provider.created_at)}</span>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <div className="text-sm opacity-70 mb-1">Last Updated</div>
                                        <div className="flex items-center gap-2">
                                            <FiCalendar className="text-primary" />
                                            <span>{formatDate(provider.updated_at)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="font-semibold text-lg mb-4">Integration Details</h4>
                                {provider.integration_details ? (
                                    <div className="mockup-code bg-base-300 text-base-content">
                                        <pre className="p-4 text-sm overflow-x-auto">
                                            <code>{JSON.stringify(provider.integration_details, null, 2)}</code>
                                        </pre>
                                    </div>
                                ) : (
                                    <div className="alert alert-info">
                                        No integration details available.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="divider my-6"></div>

                        <div>
                            <h4 className="font-semibold text-lg mb-4">Connected Companies</h4>
                            {provider.companies && provider.companies.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="table table-zebra w-full">
                                        <thead>
                                            <tr>
                                                <th>Company</th>
                                                <th>Status</th>
                                                <th>Connected Since</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {provider.companies.map((company) => (
                                                <tr key={company.id}>
                                                    <td>
                                                        <Link href={route('admin.companies.show', company.id)} className="font-medium hover:underline">
                                                            {company.name}
                                                        </Link>
                                                    </td>
                                                    <td>
                                                        {company.pivot.status === 'active' ? (
                                                            <div className="badge badge-success">Active</div>
                                                        ) : (
                                                            <div className="badge badge-error">Inactive</div>
                                                        )}
                                                    </td>
                                                    <td>{formatDate(company.pivot.created_at)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="alert alert-info">
                                    No companies are currently using this telemetry provider.
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-end mt-8 gap-4">
                            <Link
                                href={route('admin.telemetry-providers.index')}
                                className="btn btn-outline"
                            >
                                Back to List
                            </Link>

                            <Link
                                href={route('admin.telemetry-providers.edit', provider.id)}
                                className="btn btn-primary"
                            >
                                <FiEdit className="mr-1" /> Edit Provider
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="h-16"></div>
            </div>
        </AdminLayout>
    );
}
