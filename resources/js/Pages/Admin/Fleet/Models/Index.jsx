import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiFilter } from 'react-icons/fi';
import Pagination from '@/Components/Pagination';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';

export default function Index({ models, filters }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [modelToDelete, setModelToDelete] = useState(null);

    const { data, setData, get, processing } = useForm({
        search: filters?.search || '',
        status: filters?.status || '',
    });

    const confirmDelete = (id) => {
        setModelToDelete(id);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (modelToDelete) {
            window.location.href = route('admin.fleet.models.destroy', modelToDelete);
        }
    };

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        get(route('admin.fleet.models.index'), {
            preserveState: true,
            replace: true
        });
    };

    const handleFilterChange = (e) => {
        setData(e.target.name, e.target.value);
        setTimeout(() => {
            handleSearch(new Event('submit'));
        }, 100);
    };
    return (
        <AdminLayout>
            <Head title="Vehicle Models" />

            <div>
                <div className="card bg-base-100 shadow-xl mb-6">
                    <div className="card-body">
                        <div className="card-header flex items-center justify-between mb-4">
                            <h3 className="card-title text-base-content text-xl font-semibold inline-block">Vehicle Models</h3>
                            <div className="flex gap-2">
                                <Link href={route('admin.fleet.models.create')}>
                                    <button className="btn btn-primary btn-sm">
                                        <FiPlus className="mr-2" />
                                        Add Model
                                    </button>
                                </Link>
                            </div>
                        </div>

                        <div className="divider mt-0"></div>
                        
                        {/* Filters */}
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-6">
                            <div className="form-control flex-grow">
                                <div className="input-group">
                                    <TextInput
                                        type="text"
                                        name="search"
                                        placeholder="Search models..."
                                        value={data.search}
                                        onChange={(e) => setData('search', e.target.value)}
                                        className="input input-bordered w-full"
                                    />
                                    <button type="submit" className="btn btn-square">
                                        <FiSearch />
                                    </button>
                                </div>
                            </div>
                            <div className="form-control w-full sm:w-40">
                                <div className="input-group">
                                    <span className="input-group-addon bg-base-200 px-3 flex items-center border border-r-0 border-base-300 rounded-l-md">
                                        <FiFilter className="text-base-content/70" />
                                    </span>
                                    <select
                                        name="status"
                                        className="select select-bordered w-full"
                                        value={data.status}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </form>

                        <div className="card-body p-0 overflow-x-auto">
                        <table className="table table-zebra w-full border-b border-base-300">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Make</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {models.data.length > 0 ? (
                                models.data.map((model) => (
                                    <tr key={model.id}>
                                        <td>{model.name}</td>
                                        <td>{model.make.name}</td>
                                        <td>{model.description}</td>
                                        <td>
                                            <div className={`badge ${model.status === 'active' ? 'badge-success' : 'badge-warning'} badge-sm`}>
                                                {model.status === 'active' ? 'Active' : 'Inactive'}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex space-x-2">
                                                <Link href={route('admin.fleet.models.edit', model.id)} className="btn btn-ghost btn-xs">
                                                    <FiEdit className="text-info" />
                                                    <span className="sr-only">Edit</span>
                                                </Link>
                                                <button
                                                    onClick={() => confirmDelete(model.id)}
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
                                    <td colSpan="5" className="text-center py-4">
                                        <div className="alert alert-info shadow-lg">
                                            <div>
                                                <span>No vehicle models found.</span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="mt-6 flex">
                    {models.links && <Pagination class="" links={models.links} />}
                </div>
                    </div>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                    <div className="p-6">
                        <h2 className="text-lg font-medium text-base-content">
                            Are you sure you want to delete this vehicle model?
                        </h2>

                        <p className="mt-1 text-sm text-base-content">
                            This action cannot be undone.
                        </p>

                        <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-end">
                            <button className="btn btn-outline w-full sm:w-auto" onClick={() => setShowDeleteModal(false)}>
                                Cancel
                            </button>

                            <button className="btn btn-error w-full sm:w-auto" onClick={handleDelete}>
                                Delete Model
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        </AdminLayout>
    );
}
