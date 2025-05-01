import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FiPlus, FiEdit, FiTrash2, FiAlertCircle, FiTruck, FiUsers, FiMapPin } from 'react-icons/fi';
import Pagination from '@/Components/Pagination';

export default function FleetIndex({ fleets }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const { delete: destroy, processing } = useForm();
    
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this fleet? This action cannot be undone if the fleet contains vehicles.')) {
            setIsDeleting(true);
            destroy(route('company.fleets.destroy', id), {
                onSuccess: () => setIsDeleting(false),
                onError: () => setIsDeleting(false),
                preserveScroll: true,
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Fleet Management" />

            <div className="container mx-auto py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-base-content">Fleet Management</h1>
                    <Link href={route('company.fleets.create')} className="btn btn-primary btn-sm">
                        <FiPlus className="mr-2" />
                        Add New Fleet
                    </Link>
                </div>

                <div className="bg-base-100 rounded-lg shadow overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>Fleet Name</th>
                                <th>Manager</th>
                                <th>Location</th>
                                <th>Vehicles</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fleets.data.length > 0 ? (
                                fleets.data.map((fleet) => (
                                    <tr key={fleet.id}>
                                        <td>
                                            <Link href={route('company.fleets.show', fleet.id)} className="font-medium text-primary hover:underline">
                                                {fleet.name}
                                            </Link>
                                        </td>
                                        <td>{fleet.manager_name || 'Not assigned'}</td>
                                        <td>{fleet.location || 'Not specified'}</td>
                                        <td>{fleet.vehicles_count}</td>
                                        <td>
                                            <div className={`badge ${fleet.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                                                {fleet.status === 'active' ? 'Active' : 'Inactive'}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex space-x-2">
                                                <Link href={route('company.fleets.edit', fleet.id)} className="btn btn-ghost btn-xs">
                                                    <FiEdit className="text-info" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(fleet.id)}
                                                    className="btn btn-ghost btn-xs"
                                                    disabled={processing || isDeleting || fleet.vehicles_count > 0}
                                                    title={fleet.vehicles_count > 0 ? "Cannot delete a fleet with vehicles" : "Delete fleet"}
                                                >
                                                    {(processing || isDeleting) ? 
                                                        <span className="loading loading-spinner loading-xs"></span> : 
                                                        <FiTrash2 className={fleet.vehicles_count > 0 ? "text-base-300" : "text-error"} />
                                                    }
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-8">
                                        <div className="flex flex-col items-center justify-center text-base-content/70">
                                            <FiAlertCircle className="w-8 h-8 mb-2" />
                                            <p>No fleets found.</p>
                                            <Link href={route('company.fleets.create')} className="btn btn-primary btn-sm mt-4">
                                                <FiPlus className="mr-2" />
                                                Create Your First Fleet
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {fleets.links && <Pagination className="mt-6" links={fleets.links} />}

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <div className="flex items-center mb-2">
                                <FiTruck className="text-primary text-2xl mr-3" />
                                <h2 className="card-title">Manage Vehicles</h2>
                            </div>
                            <p className="text-base-content/70 mb-4">
                                View and manage all vehicles across your fleets.
                            </p>
                            <div className="card-actions justify-end">
                                <Link href={route('company.fleet.vehicles.index')} className="btn btn-outline btn-sm">
                                    View Vehicles
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <div className="flex items-center mb-2">
                                <FiUsers className="text-primary text-2xl mr-3" />
                                <h2 className="card-title">Fleet Managers</h2>
                            </div>
                            <p className="text-base-content/70 mb-4">
                                Assign and manage fleet managers for your fleets.
                            </p>
                            <div className="card-actions justify-end">
                                <Link href="#" className="btn btn-outline btn-sm">
                                    Manage Team
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <div className="flex items-center mb-2">
                                <FiMapPin className="text-primary text-2xl mr-3" />
                                <h2 className="card-title">Fleet Locations</h2>
                            </div>
                            <p className="text-base-content/70 mb-4">
                                View and manage fleet locations and coverage areas.
                            </p>
                            <div className="card-actions justify-end">
                                <Link href="#" className="btn btn-outline btn-sm">
                                    View Map
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
