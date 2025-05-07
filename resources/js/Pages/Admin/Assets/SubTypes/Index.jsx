import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FiEdit, FiTrash2, FiEye, FiPlus, FiSearch, FiFilter, FiArrowLeft } from 'react-icons/fi';
import Pagination from '@/Components/Pagination';
import Modal from '@/Components/Modal';

export default function AssetSubTypeIndex({ auth, assetType, subTypes, filters }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [subTypeToDelete, setSubTypeToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    
    const confirmDelete = (subType) => {
        setSubTypeToDelete(subType);
        setShowDeleteModal(true);
    };
    
    const deleteSubType = () => {
        if (subTypeToDelete) {
            window.location.href = route('admin.types.sub-types.destroy', [assetType.id, subTypeToDelete.id]);
        }
    };
    
    const handleSearch = (e) => {
        e.preventDefault();
        window.location.href = route('admin.types.sub-types.index', {
            type: assetType.id,
            search: searchTerm,
            status: statusFilter
        });
    };
    
    const handleStatusChange = (e) => {
        const status = e.target.value;
        setStatusFilter(status);
        window.location.href = route('admin.types.sub-types.index', {
            type: assetType.id,
            search: searchTerm,
            status: status
        });
    };
    
    const statusBadge = (status) => {
        const colors = {
            active: 'badge-success',
            inactive: 'badge-error',
        };
        
        return (
            <div className={`badge ${colors[status] || 'badge-ghost'}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </div>
        );
    };
    
    return (
        <AdminLayout
            user={auth.user}
        >
            <Head title={`Asset Sub-types - ${assetType.name}`} />

            <div>
                <div className="card bg-base-100 shadow-xl mb-6">
                    <div className="card-body">
                        <div className="card-header flex items-center justify-between mb-4">
                            <h3 className="card-title text-base-content text-xl font-semibold inline-block">Asset Sub-types for {assetType.name}</h3>
                            <div className="flex gap-2">
                                <Link href={route('admin.types.show', assetType.id)}>
                                    <button type="button" className="btn btn-outline btn-sm">
                                        <FiArrowLeft className="mr-1" /> Back to Asset Type
                                    </button>
                                </Link>
                                <Link href={route('admin.types.sub-types.create', assetType.id)}>
                                    <button type="button" className="btn btn-primary btn-sm">
                                        <FiPlus className="mr-1" /> Add Sub-type
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <div className="divider mt-0"></div>

                        {/* Search and Filter Bar */}
                        <div className="bg-base-100 p-4 mb-6 border border-base-300 rounded-lg">
                            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                                <div className="form-control w-full md:w-1/2">
                                    <div className="input-group">
                                        <input 
                                            type="text" 
                                            placeholder="Search sub-types..." 
                                            className="input input-bordered w-full" 
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <button type="submit" className="btn btn-square">
                                            <FiSearch />
                                        </button>
                                    </div>
                                </div>
                                <div className="form-control w-full md:w-1/2">
                                    <div className="flex items-center gap-2">
                                        <FiFilter className="text-base-content" />
                                        <select 
                                            className="select select-bordered w-full" 
                                            value={statusFilter}
                                            onChange={handleStatusChange}
                                        >
                                            <option value="all">All Statuses</option>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="overflow-x-auto bg-base-100 border border-base-300 rounded-lg">
                            <div className="p-4">
                                <div className="overflow-x-auto">
                                    <table className="table table-zebra w-full">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Description</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {subTypes.data.length > 0 ? (
                                                subTypes.data.map((subType) => (
                                                    <tr key={subType.id}>
                                                        <td className="font-medium">{subType.name}</td>
                                                        <td>{subType.description || '-'}</td>
                                                        <td>{statusBadge(subType.status)}</td>
                                                        <td>
                                                            <div className="flex flex-wrap gap-2">
                                                                <Link href={route('admin.types.sub-types.show', [assetType.id, subType.id])} className="btn btn-ghost btn-xs">
                                                                    <FiEye className="text-primary" />
                                                                </Link>
                                                                <Link href={route('admin.types.sub-types.edit', [assetType.id, subType.id])} className="btn btn-ghost btn-xs">
                                                                    <FiEdit className="text-warning" />
                                                                </Link>
                                                                <button 
                                                                    type="button"
                                                                    className="btn btn-ghost btn-xs" 
                                                                    onClick={() => confirmDelete(subType)}
                                                                >
                                                                    <FiTrash2 className="text-error" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center py-4">
                                                        <div className="alert alert-info">
                                                            No sub-types found for this asset type.
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Pagination */}
                            <div className="p-4">
                                <Pagination class="mt-2" links={subTypes.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-base-content">
                        Are you sure you want to delete this sub-type?
                    </h2>
                    
                    <p className="mt-1 text-sm text-base-content">
                        This action cannot be undone.
                    </p>
                    
                    <div className="mt-6 flex justify-end space-x-3">
                        <button className="btn btn-outline" onClick={() => setShowDeleteModal(false)}>
                            Cancel
                        </button>
                        
                        <button className="btn btn-error" onClick={deleteSubType}>
                            Delete Sub-type
                        </button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
