import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FiEdit, FiTrash2, FiEye, FiSearch, FiFilter, FiPlus, FiWifi, FiCheck, FiX } from 'react-icons/fi';
import Pagination from '@/Components/Pagination';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import Modal from '@/Components/Modal';

export default function Index({ auth, providers, filters, statuses }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [providerToDelete, setProviderToDelete] = useState(null);
    
    const { data, setData, get, processing } = useForm({
        search: filters.search || '',
        status: filters.status || 'all',
        sort_field: filters.sort_field || 'created_at',
        sort_direction: filters.sort_direction || 'desc',
    });
    
    const handleSearch = (e) => {
        e.preventDefault();
        get(route('admin.telemetry-providers.index'), {
            preserveState: true,
            preserveScroll: true,
            only: ['providers', 'filters']
        });
    };
    
    const handleSort = (field) => {
        const direction = 
            data.sort_field === field && data.sort_direction === 'asc' 
                ? 'desc' 
                : 'asc';
        
        setData({
            ...data,
            sort_field: field,
            sort_direction: direction,
        });
        
        get(route('admin.telemetry-providers.index'), {
            preserveState: true,
            preserveScroll: true,
        });
    };
    
    const confirmDelete = (provider) => {
        setProviderToDelete(provider);
        setShowDeleteModal(true);
    };
    
    const deleteProvider = () => {
        if (providerToDelete) {
            window.location.href = route('admin.telemetry-providers.destroy', providerToDelete.id);
        }
    };
    
    const getSortIcon = (field) => {
        if (data.sort_field !== field) {
            return null;
        }
        
        return data.sort_direction === 'asc' 
            ? <span className="ml-1">↑</span> 
            : <span className="ml-1">↓</span>;
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
                        Telemetry Providers
                    </h2>
                    <div className="flex gap-2">
                        <Link href={route('admin.telemetry-providers.create')}>
                            <button type="button" className="btn btn-primary btn-sm">
                                <FiPlus className="mr-1" /> Add Provider
                            </button>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Telemetry Providers" />

            <div className="py-6">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h3 className="card-title text-base-content mb-4">Telemetry Providers List</h3>
                        <div className="divider mt-0"></div>
                        
                        {/* Filters */}
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-6">
                            <div className="form-control flex-grow">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <FiSearch className="text-primary" />
                                    </div>
                                    <TextInput
                                        type="text"
                                        placeholder="Search providers..."
                                        value={data.search}
                                        onChange={(e) => setData('search', e.target.value)}
                                        className="w-full pl-10"
                                    />
                                </div>
                            </div>
                            <div className="form-control w-full sm:w-40">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <FiFilter className="text-primary" />
                                    </div>
                                    <SelectInput
                                        value={data.status}
                                        onChange={(e) => {
                                            setData('status', e.target.value);
                                            setTimeout(() => handleSearch(new Event('submit')), 100);
                                        }}
                                        className="w-full pl-10 select select-bordered"
                                    >
                                        {Object.entries(statuses).map(([value, label]) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </SelectInput>
                                </div>
                            </div>
                            <div>
                                <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={processing}>
                                    Filter
                                </button>
                            </div>
                        </form>
                            
                        {/* Providers Table */}
                        <div className="overflow-x-auto w-full">
                            <table className="table table-zebra w-full">
                                <thead>
                                    <tr>
                                        <th 
                                            className="cursor-pointer"
                                            onClick={() => handleSort('name')}
                                        >
                                            Name {getSortIcon('name')}
                                        </th>
                                        <th 
                                            className="cursor-pointer"
                                            onClick={() => handleSort('api_endpoint')}
                                        >
                                            API Endpoint {getSortIcon('api_endpoint')}
                                        </th>
                                        <th 
                                            className="cursor-pointer"
                                            onClick={() => handleSort('status')}
                                        >
                                            Status {getSortIcon('status')}
                                        </th>
                                        <th 
                                            className="cursor-pointer"
                                            onClick={() => handleSort('created_at')}
                                        >
                                            Created At {getSortIcon('created_at')}
                                        </th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {providers.data && providers.data.length > 0 ? (
                                        providers.data.map((provider) => (
                                            <tr key={provider.id}>
                                                <td className="font-medium">
                                                    <div className="flex items-center gap-3">
                                                        <div className="avatar">
                                                            <div className="mask mask-squircle w-10 h-10 bg-base-300 flex items-center justify-center">
                                                                {provider.logo ? (
                                                                    <img src={provider.logo} alt={provider.name} />
                                                                ) : (
                                                                    <FiWifi className="text-primary" size={18} />
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            {provider.name}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="text-sm opacity-70">
                                                        {provider.api_endpoint || '-'}
                                                    </div>
                                                </td>
                                                <td>
                                                    {provider.status === 'active' ? (
                                                        <div className="badge badge-success flex items-center gap-1">
                                                            <FiCheck size={14} /> Active
                                                        </div>
                                                    ) : (
                                                        <div className="badge badge-error flex items-center gap-1">
                                                            <FiX size={14} /> Inactive
                                                        </div>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="text-sm opacity-70">
                                                        {new Date(provider.created_at).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="flex flex-wrap gap-2">
                                                        <Link href={route('admin.telemetry-providers.show', provider.id)} className="btn btn-ghost btn-xs">
                                                            <FiEye className="text-primary" />
                                                        </Link>
                                                        <Link href={route('admin.telemetry-providers.edit', provider.id)} className="btn btn-ghost btn-xs">
                                                            <FiEdit className="text-warning" />
                                                        </Link>
                                                        <button 
                                                            type="button"
                                                            className="btn btn-ghost btn-xs" 
                                                            onClick={() => confirmDelete(provider)}
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
                                                    No telemetry providers found.
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                            
                        {/* Pagination */}
                        {providers.links && <Pagination class="mt-6" links={providers.links} />}
                    </div>
                </div>
                <div className="h-16"></div>
            </div>
            
            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-base-content">
                        Are you sure you want to delete this telemetry provider?
                    </h2>
                    
                    <p className="mt-1 text-sm text-base-content">
                        This action cannot be undone. All integrations associated with this provider will also be deleted.
                    </p>
                    
                    <div className="mt-6 flex justify-end space-x-3">
                        <button className="btn btn-outline" onClick={() => setShowDeleteModal(false)}>
                            Cancel
                        </button>
                        
                        <button className="btn btn-error" onClick={deleteProvider}>
                            Delete Provider
                        </button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
