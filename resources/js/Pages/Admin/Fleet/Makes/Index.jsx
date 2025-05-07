import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FiPlus, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi';
import Pagination from '@/Components/Pagination';
import Modal from '@/Components/Modal';

export default function Index({ makes }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [makeToDelete, setMakeToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    const confirmDelete = (id) => {
        setMakeToDelete(id);
        setShowDeleteModal(true);
    };
    
    const handleDelete = () => {
        if (makeToDelete) {
            window.location.href = route('admin.fleet.makes.destroy', makeToDelete);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // Implement search functionality if needed
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
        <AdminLayout>
            <Head title="Vehicle Makes" />

            <div>
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                            <h3 className="card-title text-base-content">Vehicle Makes List</h3>
                            <div className="flex gap-2">
                                <Link href={route('admin.fleet.makes.create')}>
                                    <button className="btn btn-primary btn-sm">
                                        <FiPlus className="mr-1" />
                                        Add Make
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <div className="divider mt-0"></div>

                        {/* Filters */}
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 my-6">
                            <div className="form-control flex-grow">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <FiSearch className="text-primary" />
                                    </div>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full pl-10"
                                        placeholder="Search makes..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Search
                            </button>
                        </form>
                
                        <div className="overflow-x-auto bg-base-100 border border-base-300 rounded-lg">
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
                                    {makes.data.length > 0 ? (
                                        makes.data.map((make) => (
                                            <tr key={make.id}>
                                                <td className="font-medium">{make.name}</td>
                                                <td>{make.description || '-'}</td>
                                                <td>{statusBadge(make.status)}</td>
                                                <td>
                                                    <div className="flex flex-wrap gap-2">
                                                        <Link href={route('admin.fleet.makes.edit', make.id)} className="btn btn-ghost btn-xs">
                                                            <FiEdit className="text-warning" />
                                                            <span className="sr-only">Edit</span>
                                                        </Link>
                                                        <button
                                                            onClick={() => confirmDelete(make.id)}
                                                            className="btn btn-ghost btn-xs"
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
                                            <td colSpan="4" className="text-center py-4">
                                                <div className="alert alert-info shadow-lg">
                                                    <div>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                        </svg>
                                                        <span>No vehicle makes found.</span>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            
                            {/* Pagination */}
                            <div className="p-4">
                                {makes.links && <Pagination class="mt-2" links={makes.links} />}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="h-16"></div>
                
                {/* Delete Confirmation Modal */}
                <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                    <div className="p-6">
                        <h2 className="text-lg font-medium text-base-content">
                            Are you sure you want to delete this vehicle make?
                        </h2>
                        
                        <p className="mt-1 text-sm text-base-content">
                            This action cannot be undone. All related vehicle models will also be affected.
                        </p>
                        
                        <div className="mt-6 flex justify-end space-x-3">
                            <button className="btn btn-outline" onClick={() => setShowDeleteModal(false)}>
                                Cancel
                            </button>
                            
                            <button className="btn btn-error" onClick={handleDelete}>
                                Delete Make
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        </AdminLayout>
    );
}
