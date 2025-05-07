import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FiEdit, FiArrowLeft, FiPlus, FiList } from 'react-icons/fi';

export default function AssetTypeShow({ auth, assetType }) {
    return (
        <AdminLayout
            user={auth.user}
        >
            <Head title={`Asset Type: ${assetType.name}`} />

            <div>
                <div className="card bg-base-100 shadow-xl mb-6">
                    <div className="card-body">
                        <div className="card-header flex items-center justify-between mb-4">
                            <h3 className="card-title text-base-content text-xl font-semibold inline-block">Asset Type Details: {assetType.name}</h3>
                            <div className="flex gap-2">
                                <Link href={route('admin.types.index')}>
                                    <button type="button" className="btn btn-outline btn-sm">
                                        <FiArrowLeft className="mr-1" /> Back to Asset Types
                                    </button>
                                </Link>
                                <Link href={route('admin.types.edit', assetType.id)}>
                                    <button type="button" className="btn btn-warning btn-sm">
                                        <FiEdit className="mr-1" /> Edit
                                    </button>
                                </Link>
                                <Link href={route('admin.types.sub-types.create', assetType.id)}>
                                    <button type="button" className="btn btn-primary btn-sm">
                                        <FiPlus className="mr-1" /> Add Sub-type
                                    </button>
                                </Link>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                            {/* Asset Type Details */}
                            <div className="card bg-base-100 shadow-sm md:col-span-1">
                                <div className="card-body">
                                    <h3 className="card-title text-base-content">Asset Type Information</h3>
                                    <div className="divider mt-0"></div>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-sm font-semibold text-base-content/70">Name</h4>
                                            <p className="text-base-content">{assetType.name}</p>
                                        </div>
                                        
                                        <div>
                                            <h4 className="text-sm font-semibold text-base-content/70">Status</h4>
                                            <div className={`badge ${assetType.status === 'active' ? 'badge-success' : 'badge-error'}`}>
                                                {assetType.status.charAt(0).toUpperCase() + assetType.status.slice(1)}
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <h4 className="text-sm font-semibold text-base-content/70">Description</h4>
                                            <p className="text-base-content">{assetType.description || 'No description provided.'}</p>
                                        </div>
                                        
                                        <div>
                                            <h4 className="text-sm font-semibold text-base-content/70">Created At</h4>
                                            <p className="text-base-content">{new Date(assetType.created_at).toLocaleString()}</p>
                                        </div>
                                        
                                        <div>
                                            <h4 className="text-sm font-semibold text-base-content/70">Last Updated</h4>
                                            <p className="text-base-content">{new Date(assetType.updated_at).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Sub-types */}
                            <div className="card bg-base-100 shadow-sm md:col-span-2">
                                <div className="card-body">
                                    <div className="flex justify-between items-center">
                                        <h3 className="card-title text-base-content">Sub-types</h3>
                                        <div className="flex gap-2">
                                            <Link href={route('admin.types.sub-types.index', assetType.id)}>
                                                <button type="button" className="btn btn-outline btn-sm">
                                                    <FiList className="mr-1" /> View All
                                                </button>
                                            </Link>
                                            <Link href={route('admin.types.sub-types.create', assetType.id)}>
                                                <button type="button" className="btn btn-primary btn-sm">
                                                    <FiPlus className="mr-1" /> Add
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="divider mt-0"></div>
                                    
                                    {assetType.sub_types && assetType.sub_types.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="table table-zebra w-full">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Status</th>
                                                        <th>Description</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {assetType.sub_types.map((subType) => (
                                                        <tr key={subType.id}>
                                                            <td className="font-medium">{subType.name}</td>
                                                            <td>
                                                                <div className={`badge ${subType.status === 'active' ? 'badge-success' : 'badge-error'}`}>
                                                                    {subType.status.charAt(0).toUpperCase() + subType.status.slice(1)}
                                                                </div>
                                                            </td>
                                                            <td>{subType.description || '-'}</td>
                                                            <td>
                                                                <div className="flex gap-2">
                                                                    <Link href={route('admin.types.sub-types.show', [assetType.id, subType.id])}>
                                                                        <button type="button" className="btn btn-ghost btn-xs">
                                                                            View
                                                                        </button>
                                                                    </Link>
                                                                    <Link href={route('admin.types.sub-types.edit', [assetType.id, subType.id])}>
                                                                        <button type="button" className="btn btn-ghost btn-xs">
                                                                            Edit
                                                                        </button>
                                                                    </Link>
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
                                                <span>No sub-types have been added to this asset type yet.</span>
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
