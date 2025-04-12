import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FiEdit, FiTrash2, FiEye, FiUserPlus } from 'react-icons/fi';
import Pagination from '@/Components/Pagination';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';

export default function Index({ auth, company, users, filters, roles }) {
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
        get(route('admin.companies.users.index', company.id), {
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
        
        get(route('admin.companies.users.index', company.id), {
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
            window.location.href = route('admin.companies.users.destroy', [company.id, userToDelete.id]);
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
            company_owner: 'badge-primary',
            company_user: 'badge-secondary',
            super_admin: 'badge-accent',
        };
        
        const labels = {
            company_owner: 'Company Owner',
            company_user: 'Company User',
            super_admin: 'Super Admin',
        };
        
        return (
            <div className={`badge ${colors[role] || 'badge-ghost'}`}>
                {labels[role] || role}
            </div>
        );
    };
    
    return (
        <AdminLayout
            user={auth.user}
        >
            <Head title={`${company.name} - Users`} />

            <div className="flex-1 overflow-y-auto md:pt-4 pt-4 px-6 bg-base-200">
                <div className="card w-full p-6 bg-base-100 shadow-xl mt-2">
                    <div className="text-xl font-semibold inline-block">
                        {company.name} - Users List
                        <div className="inline-block float-right">
                            <Link href={route('admin.companies.users.create', company.id)}>
                                <button className="btn px-6 btn-sm normal-case btn-primary">Add User</button>
                            </Link>
                            <Link href={route('admin.companies.show', company.id)} className="ml-2">
                                <button className="btn px-6 btn-sm normal-case btn-outline">Back to Company</button>
                            </Link>
                        </div>
                    </div>
                    <div className="divider mt-2"></div>
                    <div className="h-full w-full pb-6 bg-base-100">
                            {/* Filters */}
                            <form onSubmit={handleSearch} className="flex flex-wrap gap-4 mb-6">
                                <div className="flex-grow">
                                    <TextInput
                                        type="text"
                                        placeholder="Search users..."
                                        value={data.search}
                                        onChange={(e) => setData('search', e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                                <div className="w-40">
                                    <SelectInput
                                        value={data.role}
                                        onChange={(e) => {
                                            setData('role', e.target.value);
                                            setTimeout(() => handleSearch(new Event('submit')), 100);
                                        }}
                                        className="w-full"
                                    >
                                        {Object.entries(roles).map(([value, label]) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </SelectInput>
                                </div>
                                <div>
                                    <PrimaryButton type="submit" disabled={processing}>
                                        Filter
                                    </PrimaryButton>
                                </div>
                            </form>
                            
                            {/* Users Table */}
                            <div className="overflow-x-auto">
                                <table className="table w-full">
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
                                            <th 
                                                className="cursor-pointer"
                                                onClick={() => handleSort('created_at')}
                                            >
                                                Joined {getSortIcon('created_at')}
                                            </th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.data.length > 0 ? (
                                            users.data.map((user) => (
                                                <tr key={user.id}>
                                                    <td className="flex items-center space-x-3">
                                                        <div className="avatar">
                                                            <div className="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center">
                                                                {user.profile_photo_url ? (
                                                                    <img src={user.profile_photo_url} alt={user.name} />
                                                                ) : (
                                                                    <span className="text-base-content font-bold">
                                                                        {user.name.charAt(0).toUpperCase()}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="font-bold">{user.name}</div>
                                                            {user.title && (
                                                                <div className="text-sm opacity-50">{user.title}</div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td>{user.email}</td>
                                                    <td>{getRoleBadge(user)}</td>
                                                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                                    <td>
                                                        <div className="flex space-x-2">
                                                            <Link href={route('admin.companies.users.show', [company.id, user.id])}>
                                                                <button className="btn btn-sm btn-outline">
                                                                    <FiEye className="mr-1" /> View
                                                                </button>
                                                            </Link>
                                                            <Link href={route('admin.companies.users.edit', [company.id, user.id])}>
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
                                                <td colSpan="5" className="text-center py-4">
                                                    No users found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination */}
                            <Pagination class="mt-6" links={users.links} />
                        </div>
                    </div>
                {/* </div> */}
                <div className="h-16"></div>
            </div>
            
            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-base-content">
                        Are you sure you want to delete this user?
                    </h2>
                    
                    <p className="mt-1 text-sm text-base-content">
                        This action cannot be undone. The user will be permanently removed from the company.
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
