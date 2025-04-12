import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FiEdit, FiTrash2, FiEye, FiUserPlus, FiFilter } from 'react-icons/fi';
import Pagination from '@/Components/Pagination';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import Modal from '@/Components/Modal';

export default function Index({ auth, users, filters, roles }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    
    const { data, setData, get, processing } = useForm({
        search: filters.search || '',
        role: filters.role || 'all',
        sort_field: filters.sort_field || 'name',
        sort_direction: filters.sort_direction || 'asc',
    });
    
    const handleSearch = (e) => {
        e.preventDefault();
        get(route('admin.users.index'), {
            preserveState: true,
            preserveScroll: true,
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
        
        get(route('admin.users.index'), {
            preserveState: true,
            preserveScroll: true,
        });
    };
    
    const confirmDelete = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };
    
    const deleteUser = () => {
        if (userToDelete) {
            window.location.href = route('admin.users.destroy', userToDelete.id);
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
    
    const getRoleBadge = (user) => {
        const role = user.roles && user.roles.length > 0 ? user.roles[0].name : null;
        
        if (!role) return null;
        
        const colors = {
            super_admin: 'badge-accent',
            company_owner: 'badge-primary',
            company_user: 'badge-secondary',
        };
        
        const labels = {
            super_admin: 'Super Admin',
            company_owner: 'Company Owner',
            company_user: 'Company User',
        };
        
        return (
            <div className={`badge ${colors[role] || 'badge-ghost'}`}>
                {labels[role] || role}
            </div>
        );
    };
    
    return (
        <AdminLayout user={auth.user}>
            <Head title="User Management" />

            <div className="flex-1 overflow-y-auto md:pt-4 pt-4 px-6 bg-base-200">
                <div className="card w-full p-6 bg-base-100 shadow-xl mt-2">
                    <div className="text-xl font-semibold inline-block">
                        User Management
                        <div className="inline-block float-right">
                            <Link href={route('admin.users.create')}>
                                <button className="btn px-6 btn-sm normal-case btn-primary">
                                    <FiUserPlus className="mr-1" /> Add User
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="divider mt-2"></div>
                    
                    {/* Filters */}
                    <div className="mb-4">
                        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                            <div className="form-control flex-1">
                                <div className="input-group">
                                    <TextInput
                                        type="text"
                                        placeholder="Search users..."
                                        value={data.search}
                                        onChange={(e) => setData('search', e.target.value)}
                                        className="w-full"
                                    />
                                    <button type="submit" className="btn btn-primary" disabled={processing}>
                                        Search
                                    </button>
                                </div>
                            </div>
                            
                            <div className="form-control md:w-64">
                                <div className="input-group">
                                    <span className="bg-base-300 px-3 flex items-center">
                                        <FiFilter />
                                    </span>
                                    <SelectInput
                                        value={data.role}
                                        onChange={(e) => {
                                            setData('role', e.target.value);
                                            get(route('admin.users.index'), {
                                                preserveState: true,
                                                preserveScroll: true,
                                            });
                                        }}
                                        className="w-full select-bordered"
                                    >
                                        {Object.entries(roles).map(([value, label]) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </SelectInput>
                                </div>
                            </div>
                        </form>
                    </div>
                    
                    {/* Users Table */}
                    <div className="overflow-x-auto">
                        <div className="card bg-base-100">
                            <div className="card-body p-0">
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
                                                onClick={() => handleSort('email')}
                                            >
                                                Email {getSortIcon('email')}
                                            </th>
                                            <th>Role</th>
                                            <th>Company</th>
                                            <th 
                                                className="cursor-pointer"
                                                onClick={() => handleSort('created_at')}
                                            >
                                                Created {getSortIcon('created_at')}
                                            </th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.data.length > 0 ? (
                                            users.data.map(user => (
                                                <tr key={user.id}>
                                                    <td>
                                                        <div className="flex items-center space-x-3">
                                                            <div className="avatar">
                                                                <div className="mask mask-squircle w-10 h-10">
                                                                    {user.profile_photo_url ? (
                                                                        <img src={user.profile_photo_url} alt={user.name} />
                                                                    ) : (
                                                                        <div className="bg-primary text-primary-content w-full h-full flex items-center justify-center rounded-full">
                                                                            {user.name.charAt(0).toUpperCase()}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="font-bold">{user.name}</div>
                                                                {user.title && (
                                                                    <div className="text-sm opacity-50">{user.title}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>{user.email}</td>
                                                    <td>{getRoleBadge(user)}</td>
                                                    <td>
                                                        {user.company ? (
                                                            <Link href={route('admin.companies.show', user.company.id)}>
                                                                <span className="link link-hover">{user.company.name}</span>
                                                            </Link>
                                                        ) : (
                                                            <span className="opacity-50">None</span>
                                                        )}
                                                    </td>
                                                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                                    <td>
                                                        <div className="flex space-x-2">
                                                            <Link href={route('admin.users.show', user.id)}>
                                                                <button className="btn btn-sm btn-outline">
                                                                    <FiEye className="mr-1" /> View
                                                                </button>
                                                            </Link>
                                                            <Link href={route('admin.users.edit', user.id)}>
                                                                <button className="btn btn-sm btn-outline">
                                                                    <FiEdit className="mr-1" /> Edit
                                                                </button>
                                                            </Link>
                                                            <button 
                                                                className="btn btn-sm btn-error" 
                                                                onClick={() => confirmDelete(user)}
                                                            >
                                                                <FiTrash2 className="mr-1" /> Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center py-4">
                                                    No users found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination */}
                            <Pagination className="mt-6" links={users.links} />
                        </div>
                    </div>
                </div>
                <div className="h-16"></div>
            </div>
            
            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-base-content">
                        Are you sure you want to delete this user?
                    </h2>
                    
                    <p className="mt-1 text-sm text-base-content">
                        This action cannot be undone. The user will be permanently removed from the system.
                    </p>
                    
                    <div className="mt-6 flex justify-end space-x-3">
                        <button className="btn btn-outline" onClick={() => setShowDeleteModal(false)}>
                            Cancel
                        </button>
                        
                        <button className="btn btn-error" onClick={deleteUser}>
                            Delete User
                        </button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
