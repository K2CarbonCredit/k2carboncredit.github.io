import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FiPlus, FiEdit2, FiTrash2, FiTool, FiArrowLeft } from 'react-icons/fi';
import Pagination from '@/Components/Pagination';
import Modal from '@/Components/Modal';

export default function Index({ equipment }) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [equipmentToDelete, setEquipmentToDelete] = useState(null);

    const confirmDelete = (equipment) => {
        setEquipmentToDelete(equipment);
        setDeleteModalOpen(true);
    };

    const closeModal = () => {
        setDeleteModalOpen(false);
        setEquipmentToDelete(null);
    };

    const deleteEquipment = () => {
        if (equipmentToDelete) {
            window.location.href = route('company.fleet.equipment.destroy', equipmentToDelete.id);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-base-content leading-tight">Fleet Equipment</h2>
                    <div className="flex space-x-2">
                        <Link href={route('company.fleet.index')}>
                            <button type="button" className="btn btn-outline btn-sm">
                                <FiArrowLeft className="mr-1" /> Back to Fleet
                            </button>
                        </Link>
                        <Link href={route('company.fleet.equipment.create')}>
                            <button type="button" className="btn btn-primary btn-sm">
                                <FiPlus className="mr-1" /> Add Equipment
                            </button>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Fleet Equipment" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-base-100 rounded-lg shadow overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Subtype</th>
                                    <th>Serial Number</th>
                                    <th>Status</th>
                                    <th>Maintenance Due</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {equipment.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4">
                                            No equipment found. <Link href={route('company.fleet.equipment.create')} className="text-primary">Add your first equipment</Link>
                                        </td>
                                    </tr>
                                ) : (
                                    equipment.data.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.name}</td>
                                            <td>{item.asset_type?.name || 'N/A'}</td>
                                            <td>{item.asset_sub_type?.name || 'N/A'}</td>
                                            <td>{item.serial_number || 'N/A'}</td>
                                            <td>
                                                <span className={`badge ${
                                                    item.status === 'active' ? 'badge-success' :
                                                    item.status === 'maintenance' ? 'badge-warning' :
                                                    item.status === 'inactive' ? 'badge-error' :
                                                    'badge-ghost'
                                                }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td>
                                                {item.next_maintenance_date ? (
                                                    <span className={`${
                                                        new Date(item.next_maintenance_date) <= new Date() ? 'text-error' : ''
                                                    }`}>
                                                        {new Date(item.next_maintenance_date).toLocaleDateString()}
                                                    </span>
                                                ) : (
                                                    'Not scheduled'
                                                )}
                                            </td>
                                            <td className="text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <Link href={route('company.fleet.equipment.edit', item.id)}>
                                                        <button className="btn btn-ghost btn-xs">
                                                            <FiEdit2 />
                                                        </button>
                                                    </Link>
                                                    <button
                                                        onClick={() => confirmDelete(item)}
                                                        className="btn btn-ghost btn-xs text-error"
                                                    >
                                                        <FiTrash2 />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="mt-6">
                        <Pagination links={equipment.links} />
                    </div>
                </div>
            </div>

            <Modal show={deleteModalOpen} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-base-content">Delete Equipment</h2>
                    <p className="mt-1 text-sm text-base-content/70">
                        Are you sure you want to delete this equipment? This action cannot be undone.
                    </p>
                    <div className="mt-6 flex justify-end space-x-2">
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={closeModal}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn btn-error"
                            onClick={deleteEquipment}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
