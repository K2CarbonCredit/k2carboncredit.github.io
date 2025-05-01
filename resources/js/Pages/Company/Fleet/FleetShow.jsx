import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FiArrowLeft, FiEdit, FiTrash2, FiPlus, FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiTruck, FiInfo } from 'react-icons/fi';
import Pagination from '@/Components/Pagination';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';

export default function FleetShow({ fleet, availableVehicles }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedVehicles, setSelectedVehicles] = useState([]);
    const { delete: destroy, post, processing } = useForm();
    
    const handleRemoveVehicle = (vehicleId) => {
        if (confirm('Are you sure you want to remove this vehicle from the fleet?')) {
            setIsDeleting(true);
            post(route('company.fleets.remove-vehicles', fleet.id), {
                vehicle_ids: [vehicleId],
            }, {
                onSuccess: () => setIsDeleting(false),
                onError: () => setIsDeleting(false),
                preserveScroll: true,
            });
        }
    };
    
    const handleAssignVehicles = () => {
        if (selectedVehicles.length === 0) {
            alert('Please select at least one vehicle to assign to this fleet.');
            return;
        }
        
        post(route('company.fleets.assign-vehicles', fleet.id), {
            vehicle_ids: selectedVehicles,
        }, {
            onSuccess: () => {
                setShowAssignModal(false);
                setSelectedVehicles([]);
            },
            preserveScroll: true,
        });
    };
    
    const toggleVehicleSelection = (vehicleId) => {
        if (selectedVehicles.includes(vehicleId)) {
            setSelectedVehicles(selectedVehicles.filter(id => id !== vehicleId));
        } else {
            setSelectedVehicles([...selectedVehicles, vehicleId]);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Fleet: ${fleet.name}`} />

            <div className="container mx-auto py-6">
                <div className="mb-6 flex justify-between">
                    <Link href={route('company.fleets.index')} className="btn btn-outline btn-sm">
                        <FiArrowLeft className="mr-2" /> Back to Fleets
                    </Link>
                    <div className="flex gap-2">
                        <Link href={route('company.fleets.edit', fleet.id)} className="btn btn-outline btn-sm">
                            <FiEdit className="mr-2" /> Edit Fleet
                        </Link>
                        <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => setShowAssignModal(true)}
                        >
                            <FiPlus className="mr-2" /> Assign Vehicles
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Fleet Information Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-base-100 rounded-lg shadow">
                            <div className="p-6">
                                <h2 className="text-2xl font-semibold mb-4">{fleet.name}</h2>
                                <div className={`badge ${fleet.status === 'active' ? 'badge-success' : 'badge-warning'} mb-4`}>
                                    {fleet.status === 'active' ? 'Active' : 'Inactive'}
                                </div>
                                
                                {fleet.description && (
                                    <p className="text-base-content/70 mb-6">{fleet.description}</p>
                                )}
                                
                                <div className="divider"></div>
                                
                                <h3 className="text-lg font-medium mb-3">Fleet Manager</h3>
                                {fleet.manager_name ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <FiUser className="text-primary mr-3" />
                                            <span>{fleet.manager_name}</span>
                                        </div>
                                        {fleet.manager_email && (
                                            <div className="flex items-center">
                                                <FiMail className="text-primary mr-3" />
                                                <a href={`mailto:${fleet.manager_email}`} className="text-primary hover:underline">
                                                    {fleet.manager_email}
                                                </a>
                                            </div>
                                        )}
                                        {fleet.manager_phone && (
                                            <div className="flex items-center">
                                                <FiPhone className="text-primary mr-3" />
                                                <span>{fleet.manager_phone}</span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-base-content/70">No manager assigned</p>
                                )}
                                
                                <div className="divider"></div>
                                
                                <h3 className="text-lg font-medium mb-3">Location</h3>
                                {fleet.location ? (
                                    <div className="flex items-center">
                                        <FiMapPin className="text-primary mr-3" />
                                        <span>{fleet.location}</span>
                                    </div>
                                ) : (
                                    <p className="text-base-content/70">No location specified</p>
                                )}
                                
                                <div className="divider"></div>
                                
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <FiCalendar className="text-primary mr-3" />
                                        <span className="text-sm">Created: {new Date(fleet.created_at).toLocaleDateString()}</span>
                                    </div>
                                    {fleet.updated_at !== fleet.created_at && (
                                        <div className="flex items-center">
                                            <FiCalendar className="text-primary mr-3" />
                                            <span className="text-sm">Updated: {new Date(fleet.updated_at).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Fleet Vehicles */}
                    <div className="lg:col-span-2">
                        <div className="bg-base-100 rounded-lg shadow">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">Fleet Vehicles</h2>
                                    <div className="badge badge-primary">{fleet.vehicles.length} Vehicles</div>
                                </div>
                                
                                {fleet.vehicles.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="table table-zebra w-full">
                                            <thead>
                                                <tr>
                                                    <th>Make & Model</th>
                                                    <th>Registration</th>
                                                    <th>Type</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {fleet.vehicles.map((vehicle) => (
                                                    <tr key={vehicle.id}>
                                                        <td>
                                                            <div className="font-medium">{vehicle.make.name} {vehicle.model.name}</div>
                                                        </td>
                                                        <td>{vehicle.registration_number}</td>
                                                        <td>
                                                            <div className="text-sm">
                                                                {vehicle.assetType?.name} - {vehicle.assetSubType?.name}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className={`badge ${vehicle.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                                                                {vehicle.status}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="flex space-x-2">
                                                                <Link href={route('company.fleet.vehicles.edit', vehicle.id)} className="btn btn-ghost btn-xs">
                                                                    <FiEdit className="text-info" />
                                                                </Link>
                                                                <button
                                                                    onClick={() => handleRemoveVehicle(vehicle.id)}
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
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-base-content/70">
                                        <FiTruck className="w-16 h-16 mb-4 opacity-50" />
                                        <p className="text-lg mb-2">No vehicles in this fleet</p>
                                        <p className="mb-6">Assign vehicles to this fleet to manage them together.</p>
                                        <button 
                                            className="btn btn-primary btn-sm"
                                            onClick={() => setShowAssignModal(true)}
                                        >
                                            <FiPlus className="mr-2" /> Assign Vehicles
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Fleet Statistics */}
                        <div className="bg-base-100 rounded-lg shadow mt-6">
                            <div className="p-6">
                                <h2 className="text-xl font-semibold mb-4">Fleet Statistics</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="stat bg-base-200 rounded-lg p-4">
                                        <div className="stat-title">Total Vehicles</div>
                                        <div className="stat-value">{fleet.vehicles.length}</div>
                                    </div>
                                    
                                    <div className="stat bg-base-200 rounded-lg p-4">
                                        <div className="stat-title">Active Vehicles</div>
                                        <div className="stat-value">{fleet.vehicles.filter(v => v.status === 'active').length}</div>
                                    </div>
                                    
                                    <div className="stat bg-base-200 rounded-lg p-4">
                                        <div className="stat-title">Pending Vehicles</div>
                                        <div className="stat-value">{fleet.vehicles.filter(v => v.status === 'pending').length}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Assign Vehicles Modal */}
            <Modal show={showAssignModal} onClose={() => setShowAssignModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium mb-4">Assign Vehicles to Fleet</h2>
                    
                    {availableVehicles && availableVehicles.length > 0 ? (
                        <>
                            <div className="mb-4">
                                <p className="text-sm text-base-content/70 mb-2">
                                    Select vehicles to assign to this fleet. Only vehicles that are not already assigned to a fleet are shown.
                                </p>
                                
                                <div className="overflow-y-auto max-h-96 mt-4">
                                    <table className="table table-compact w-full">
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>Make & Model</th>
                                                <th>Registration</th>
                                                <th>Type</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {availableVehicles.map((vehicle) => (
                                                <tr key={vehicle.id} className="hover">
                                                    <td>
                                                        <input 
                                                            type="checkbox" 
                                                            className="checkbox checkbox-primary"
                                                            checked={selectedVehicles.includes(vehicle.id)}
                                                            onChange={() => toggleVehicleSelection(vehicle.id)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <div className="font-medium">{vehicle.make.name} {vehicle.model.name}</div>
                                                    </td>
                                                    <td>{vehicle.registration_number}</td>
                                                    <td>
                                                        <div className="text-sm">
                                                            {vehicle.assetType?.name} - {vehicle.assetSubType?.name}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-2 mt-6">
                                <button 
                                    type="button" 
                                    className="btn btn-outline"
                                    onClick={() => setShowAssignModal(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-primary"
                                    onClick={handleAssignVehicles}
                                    disabled={processing || selectedVehicles.length === 0}
                                >
                                    {processing ? <span className="loading loading-spinner loading-sm mr-2"></span> : null}
                                    Assign Selected Vehicles
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-base-content/70">
                            <FiInfo className="w-12 h-12 mb-4 opacity-50" />
                            <p className="text-lg mb-2">No available vehicles</p>
                            <p className="mb-6 text-center">All vehicles are already assigned to fleets or there are no vehicles in the system.</p>
                            <div className="flex gap-2">
                                <button 
                                    type="button" 
                                    className="btn btn-outline"
                                    onClick={() => setShowAssignModal(false)}
                                >
                                    Close
                                </button>
                                <Link href={route('company.fleet.vehicles.create')} className="btn btn-primary">
                                    <FiPlus className="mr-2" /> Create New Vehicle
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
