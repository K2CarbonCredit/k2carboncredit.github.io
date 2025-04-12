import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FiEdit, FiArrowLeft, FiTrash2 } from 'react-icons/fi';

export default function AssetSubTypeShow({ auth, assetType, subType }) {
    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-base-content leading-tight">
                        Asset Sub-type Details
                    </h2>
                    <div className="flex gap-2">
                        <Link href={route('admin.types.sub-types.edit', [assetType.id, subType.id])}>
                            <button type="button" className="btn btn-warning btn-sm">
                                <FiEdit className="mr-1" /> Edit
                            </button>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Asset Sub-type: ${subType.name}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Link href={route('admin.types.sub-types.index', assetType.id)} className="btn btn-outline btn-sm">
                            <FiArrowLeft className="mr-1" /> Back to Sub-types
                        </Link>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Asset Type Info */}
                        <div className="card bg-base-100 shadow-xl">
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
                                    
                                    <div className="card-actions justify-end mt-4">
                                        <Link href={route('admin.types.show', assetType.id)} className="btn btn-outline btn-sm">
                                            View Asset Type
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Asset Sub-type Details */}
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h3 className="card-title text-base-content">Asset Sub-type Information</h3>
                                <div className="divider mt-0"></div>
                                
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-semibold text-base-content/70">Name</h4>
                                        <p className="text-base-content">{subType.name}</p>
                                    </div>
                                    
                                    <div>
                                        <h4 className="text-sm font-semibold text-base-content/70">Status</h4>
                                        <div className={`badge ${subType.status === 'active' ? 'badge-success' : 'badge-error'}`}>
                                            {subType.status.charAt(0).toUpperCase() + subType.status.slice(1)}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h4 className="text-sm font-semibold text-base-content/70">Description</h4>
                                        <p className="text-base-content">{subType.description || 'No description provided.'}</p>
                                    </div>
                                    
                                    <div>
                                        <h4 className="text-sm font-semibold text-base-content/70">Created At</h4>
                                        <p className="text-base-content">{new Date(subType.created_at).toLocaleString()}</p>
                                    </div>
                                    
                                    <div>
                                        <h4 className="text-sm font-semibold text-base-content/70">Last Updated</h4>
                                        <p className="text-base-content">{new Date(subType.updated_at).toLocaleString()}</p>
                                    </div>
                                    
                                    <div className="card-actions justify-end mt-4">
                                        <Link 
                                            href={route('admin.types.sub-types.edit', [assetType.id, subType.id])} 
                                            className="btn btn-warning btn-sm"
                                        >
                                            <FiEdit className="mr-1" /> Edit
                                        </Link>
                                        <Link 
                                            href={route('admin.types.sub-types.destroy', [assetType.id, subType.id])} 
                                            method="delete"
                                            as="button"
                                            className="btn btn-error btn-sm"
                                        >
                                            <FiTrash2 className="mr-1" /> Delete
                                        </Link>
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
