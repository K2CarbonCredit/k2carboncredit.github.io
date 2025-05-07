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
        >
            <Head title="Asset Types" />

            <div>
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <div className="card-header flex items-center justify-between">
                            <h3 className="card-title text-base-content text-xl font-semibold inline-block">Asset Types</h3>
                            <div className="flex gap-2">
                                <Link href={route('admin.types.create')}>
                                    <button type="button" className="btn btn-primary btn-sm">
                                        <FiPlus className="mr-1" /> Add Asset Type
                                    </button>
                                </Link>
                            </div>
                        </div>

                        <div className="divider mt-0"></div>

                        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
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

                        <div className="overflow-x-auto w-full">
                            <table className="table table-zebra w-full">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                        <th>Sub-Types</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assetTypes.data.length > 0 ? (
                                        assetTypes.data.map((assetType) => (
                                            <tr key={assetType.id}>
                                                <td className="font-medium">{assetType.name}</td>
                                                <td className="max-w-xs truncate">{assetType.description}</td>
                                                <td>{statusBadge(assetType.status)}</td>
                                                <td>
                                                    <div className="flex items-center">
                                                        <span className="badge badge-ghost">{assetType.sub_types_count || 0}</span>
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
                                                            <span className="sr-only">View</span>
                                                        </Link>
                                                        <Link href={route('admin.types.edit', assetType.id)} className="btn btn-ghost btn-xs">
                                                            <FiEdit className="text-warning" />
                                                            <span className="sr-only">Edit</span>
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            className="btn btn-ghost btn-xs"
                                                            onClick={() => confirmDelete(assetType)}
                                                        >
                                                            <FiTrash2 className="text-error" />
                                                            <span className="sr-only">Delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4">
                                            <div className="alert alert-info shadow-lg">
                                                <div>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                    </svg>
                                                    <span>No asset types found.</span>
                                                </div>
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

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-base-content">
                        Are you sure you want to delete this asset type?
                    </h2>

                    <p className="mt-1 text-sm text-base-content">
                        This action cannot be undone. All sub-types associated with this asset type will also be deleted.
                    </p>

                    <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-end">
                        <button className="btn btn-outline w-full sm:w-auto" onClick={() => setShowDeleteModal(false)}>
                            Cancel
                        </button>

                        <button className="btn btn-error w-full sm:w-auto" onClick={deleteAssetType}>
                            Delete Asset Type
                        </button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
