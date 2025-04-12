import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FiEdit, FiTrash2, FiArrowLeft, FiMail, FiBriefcase, FiCalendar, FiShield } from 'react-icons/fi';
import Modal from '@/Components/Modal';

export default function Show({ auth, user }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    const deleteUser = () => {
        window.location.href = route('admin.users.destroy', user.id);
    };
    
    const getRoleBadge = (role) => {
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
            <Head title={`User: ${user.name}`} />

            <div className="flex-1 overflow-y-auto md:pt-4 pt-4 px-6 bg-base-200">
                <div className="card w-full p-6 bg-base-100 shadow-xl mt-2">
                    <div className="text-xl font-semibold inline-block">
                        User Profile
                        <div className="inline-block float-right">
                            <Link href={route('admin.users.index')}>
                                <button className="btn btn-outline btn-sm">
                                    <FiArrowLeft className="mr-1" /> Back to Users
                                </button>
                            </Link>
                            <Link href={route('admin.users.edit', user.id)} className="ml-2">
                                <button className="btn btn-primary btn-sm">
                                    <FiEdit className="mr-1" /> Edit User
                                </button>
                            </Link>
                            <button 
                                className="btn btn-error btn-sm ml-2" 
                                onClick={() => setShowDeleteModal(true)}
                            >
                                <FiTrash2 className="mr-1" /> Delete
                            </button>
                        </div>
                    </div>
                    <div className="divider mt-2"></div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* User Avatar and Basic Info */}
                        <div className="col-span-1">
                            <div className="card bg-base-200">
                                <div className="card-body items-center text-center">
                                    <div className="avatar">
                                        <div className="w-24 h-24 rounded-full">
                                            {user.profile_photo_url ? (
                                                <img src={user.profile_photo_url} alt={user.name} />
                                            ) : (
                                                <div className="bg-primary text-primary-content w-full h-full flex items-center justify-center text-3xl font-bold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <h2 className="card-title mt-4">{user.name}</h2>
                                    {user.title && (
                                        <p className="text-base-content/70">{user.title}</p>
                                    )}
                                    <div className="mt-2">
                                        {user.roles && user.roles.map(role => (
                                            <div key={role.id} className="mb-1">
                                                {getRoleBadge(role.name)}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* User Details */}
                        <div className="col-span-2">
                            <div className="card bg-base-200 h-full">
                                <div className="card-body">
                                    <h2 className="card-title mb-4">User Information</h2>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-center">
                                            <FiMail className="text-primary mr-3" />
                                            <div>
                                                <div className="text-sm font-medium text-base-content/70">Email</div>
                                                <div>{user.email}</div>
                                            </div>
                                        </div>
                                        
                                        {user.company && (
                                            <div className="flex items-center">
                                                <FiBriefcase className="text-primary mr-3" />
                                                <div>
                                                    <div className="text-sm font-medium text-base-content/70">Company</div>
                                                    <div>
                                                        <Link href={route('admin.companies.show', user.company.id)}>
                                                            <span className="link link-hover">{user.company.name}</span>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div className="flex items-center">
                                            <FiCalendar className="text-primary mr-3" />
                                            <div>
                                                <div className="text-sm font-medium text-base-content/70">Joined</div>
                                                <div>{new Date(user.created_at).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start">
                                            <FiShield className="text-primary mr-3 mt-1" />
                                            <div>
                                                <div className="text-sm font-medium text-base-content/70">Permissions</div>
                                                {user.permissions && user.permissions.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {user.permissions.map(permission => (
                                                            <span key={permission.id} className="badge badge-outline">
                                                                {permission.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-base-content/50 italic">No specific permissions assigned</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
