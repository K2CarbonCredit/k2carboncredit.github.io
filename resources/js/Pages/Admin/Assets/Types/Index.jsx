import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FiEdit, FiTrash2, FiEye, FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import Pagination from '@/Components/Pagination';
import Modal from '@/Components/Modal';

export default function AssetTypeIndex({ auth, assetTypes, filters }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [assetTypeToDelete, setAssetTypeToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    
    const confirmDelete = (assetType) => {
        setAssetTypeToDelete(assetType);
        setShowDeleteModal(true);
    };
    
    const deleteAssetType = () => {
        if (assetTypeToDelete) {
            window.location.href = route('admin.types.destroy', assetTypeToDelete.id);
        }
    };
    
    const handleSearch = (e) => {
        e.preventDefault();
        window.location.href = route('admin.types.index', {
            search: searchTerm,
            status: statusFilter
        });
    };
    
    const handleStatusChange = (e) => {
        const status = e.target.value;
        setStatusFilter(status);
        window.location.href = route('admin.types.index', {
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
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-base-content leading-tight">
                        Asset Types
                    </h2>
                    <Link href={route('admin.types.create')}>
                        <button type="button" className="btn btn-primary btn-sm">
                            <FiPlus className="mr-1" /> Add Asset Type
                        </button>
                    </Link>
                </div>
            }
        >
            <Head title="Asset Types" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Search and Filter Bar */}
                    <div className="card bg-base-100 shadow-xl mb-6">
                        <div className="card-body p-4">
                            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                                <div className="form-control w-full md:w-1/2">
                                    <div className="input-group">
                                        <input 
                                            type="text" 
                                            placeholder="Search asset types..." 
                                            className="input input-bordered w-full" 
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <button type="submit" className="btn btn-primary btn-square">
                                            <FiSearch />
                                        </button>
                                    </div>
                                </div>
                                <div className="form-control w-full md:w-1/2">
                                    <div className="input-group">
                                        <span className="btn btn-outline no-animation">
                                            <FiFilter className="mr-2" /> Status
                                        </span>
                                        <select 
                                            className="select select-bordered flex-grow"
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
                    </div>
                    
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h3 className="card-title text-base-content mb-4">Asset Types</h3>
                            <div className="divider mt-0"></div>
                            
                            <div className="overflow-x-auto w-full">
                                <table className="table table-zebra w-full">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Description</th>
                                            <th>Status</th>
                                            <th>Sub-types</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {assetTypes.data.length > 0 ? (
                                            assetTypes.data.map((assetType) => (
                                                <tr key={assetType.id}>
                                                    <td className="font-medium">{assetType.name}</td>
                                                    <td>{assetType.description || '-'}</td>
                                                    <td>{statusBadge(assetType.status)}</td>
                                                    <td>
                                                        <div className="flex items-center">
                                                            <span className="badge badge-info">{assetType.sub_types_count || 0}</span>
                                                            {assetType.sub_types_count > 0 && (
                                                                <Link 
                                                                    href={route('admin.types.sub-types.index', assetType.id)} 
                                                                    className="btn btn-ghost btn-xs ml-2"
                                                                >
                                                                    View
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="flex flex-wrap gap-2">
                                                            <Link href={route('admin.types.show', assetType.id)} className="btn btn-ghost btn-xs">
                                                                <FiEye className="text-primary" />
                                                            </Link>
                                                            <Link href={route('admin.types.edit', assetType.id)} className="btn btn-ghost btn-xs">
                                                                <FiEdit className="text-warning" />
                                                            </Link>
                                                            <button 
                                                                type="button"
                                                                className="btn btn-ghost btn-xs" 
                                                                onClick={() => confirmDelete(assetType)}
                                                            >
                                                                <FiTrash2 className="text-error" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-center py-4">
                                                    <div className="alert alert-info">
                                                        No asset types found.
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination */}
                            <Pagination class="mt-6" links={assetTypes.links} />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-base-content">
                        Are you sure you want to delete this asset type?
                    </h2>
                    
                    <p className="mt-1 text-sm text-base-content">
                        This action cannot be undone. All sub-types associated with this asset type will also be deleted.
                    </p>
                    
                    <div className="mt-6 flex justify-end space-x-3">
                        <button className="btn btn-outline" onClick={() => setShowDeleteModal(false)}>
                            Cancel
                        </button>
                        
                        <button className="btn btn-error" onClick={deleteAssetType}>
                            Delete Asset Type
                        </button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
