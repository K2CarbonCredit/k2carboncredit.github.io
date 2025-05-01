import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FiPlus, FiEdit, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import Pagination from '@/Components/Pagination';

export default function Index({ vehicles }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const { delete: destroy, processing } = useForm();
    
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this vehicle?')) {
            setIsDeleting(true);
            destroy(route('company.fleet.vehicles.destroy', id), {
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
                    <Link href={route('company.fleet.vehicles.create')} className="btn btn-primary btn-sm">
                        <FiPlus className="mr-2" />
                        Add Vehicle
                    </Link>
                </div>

                <div className="bg-base-100 rounded-lg shadow overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>Make</th>
                                <th>Model</th>
                                <th>Year</th>
                                <th>Registration</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehicles.data.length > 0 ? (
                                vehicles.data.map((vehicle) => (
                                    <tr key={vehicle.id}>
                                        <td>{vehicle.make.name}</td>
                                        <td>{vehicle.model.name}</td>
                                        <td>{vehicle.year || 'N/A'}</td>
                                        <td>{vehicle.registration_number}</td>
                                        <td>
                                            <div className={`badge ${vehicle.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                                                {vehicle.status === 'active' ? 'Active' : 'Pending'}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex space-x-2">
                                                <Link href={route('company.fleet.vehicles.edit', vehicle.id)} className="btn btn-ghost btn-xs">
                                                    <FiEdit className="text-info" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(vehicle.id)}
                                                    className="btn btn-ghost btn-xs"
                                                    disabled={processing || isDeleting}
                                                >
                                                    {(processing || isDeleting) ? 
                                                        <span className="loading loading-spinner loading-xs"></span> : 
                                                        <FiTrash2 className="text-error" />
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
                                            <p>No vehicles found.</p>
                                            <Link href={route('company.fleet.vehicles.create')} className="btn btn-primary btn-sm mt-4">
                                                <FiPlus className="mr-2" />
                                                Add Your First Vehicle
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {vehicles.links && <Pagination className="mt-6" links={vehicles.links} />}
            </div>
        </AuthenticatedLayout>
    );
}
