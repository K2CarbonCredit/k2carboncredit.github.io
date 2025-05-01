import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FiPlus, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi';
import Pagination from '@/Components/Pagination';
import Modal from '@/Components/Modal';

export default function Index({ makes }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [makeToDelete, setMakeToDelete] = useState(null);
    
    const confirmDelete = (id) => {
        setMakeToDelete(id);
        setShowDeleteModal(true);
    };
    
    const handleDelete = () => {
        if (makeToDelete) {
            window.location.href = route('admin.fleet.makes.destroy', makeToDelete);
        }
    };
    return (
        <AdminLayout>
            <Head title="Vehicle Makes" />

            <div className="container mx-auto py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-base-content">Vehicle Makes</h1>
                    <div className="flex space-x-2">
                        <Link href={route('admin.fleet.makes.create')}>
                            <button className="btn btn-primary btn-sm">
                                <FiPlus className="mr-2" />
                                Add Make
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body p-0 overflow-x-auto">
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
                                        <td>{make.name}</td>
                                        <td>{make.description}</td>
                                        <td>
                                            <div className={`badge ${make.status === 'active' ? 'badge-success' : 'badge-error'}`}>
                                                {make.status}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex space-x-2">
                                                <Link href={route('admin.fleet.makes.edit', make.id)} className="btn btn-ghost btn-xs">
                                                    <FiEdit className="text-info" />
                                                </Link>
                                                <button
                                                    onClick={() => confirmDelete(make.id)}
                                                    className="btn btn-ghost btn-xs"
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
                                        <div className="alert alert-info">No vehicle makes found.</div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    </div>
                </div>
                
                {makes.links && <Pagination class="mt-6" links={makes.links} />}
                
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
