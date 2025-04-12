import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FiEdit, FiMail, FiCalendar, FiShield, FiKey, FiArrowLeft, FiUser } from 'react-icons/fi';

export default function Show({ auth, company, user }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short'
        }).format(date);
    };
    
    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-base-content leading-tight">User Details</h2>
                    <div className="flex space-x-2">
                        <Link href={route('admin.companies.users.edit', [company.id, user.id])}>
                            <button type="button" className="btn btn-primary btn-sm">
                                <FiEdit className="mr-1" /> Edit User
                            </button>
                        </Link>
                        <Link href={route('admin.companies.users.index', company.id)}>
                            <button type="button" className="btn btn-outline btn-sm">
                                <FiArrowLeft className="mr-1" /> Back to Users
                            </button>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`${user.name} - User Details`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* User Info Card */}
                        <div className="md:col-span-2">
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <div className="flex items-center mb-6">
                                        {user.profile_photo_url ? (
                                            <div className="avatar">
                                                <div className="w-20 h-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 mr-4">
                                                    <img 
                                                        src={user.profile_photo_url} 
                                                        alt={user.name} 
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="avatar placeholder mr-4">
                                                <div className="bg-neutral text-neutral-content rounded-full w-20 h-20">
                                                    <span className="text-2xl">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="text-2xl font-bold text-base-content">{user.name}</h3>
                                            {user.title && (
                                                <p className="text-base-content/70">{user.title}</p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="divider"></div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="card bg-base-200 shadow-sm">
                                            <div className="card-body p-4">
                                                <h4 className="card-title text-base">Contact Information</h4>
                                                <ul className="space-y-3 mt-2">
                                                    <li className="flex items-center">
                                                        <div className="bg-primary/10 p-2 rounded-full mr-3">
                                                            <FiMail className="text-primary" />
                                                        </div>
                                                        <a href={`mailto:${user.email}`} className="link link-primary">
                                                            {user.email}
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        
                                        <div className="card bg-base-200 shadow-sm">
                                            <div className="card-body p-4">
                                                <h4 className="card-title text-base">Account Information</h4>
                                                <ul className="space-y-3 mt-2">
                                                    <li className="flex items-center">
                                                        <div className="bg-primary/10 p-2 rounded-full mr-3">
                                                            <FiCalendar className="text-primary" />
                                                        </div>
                                                        <span className="text-base-content/80">Created: {formatDate(user.created_at)}</span>
                                                    </li>
                                                    <li className="flex items-center">
                                                        <div className="bg-primary/10 p-2 rounded-full mr-3">
                                                            <FiCalendar className="text-primary" />
                                                        </div>
                                                        <span className="text-base-content/80">Last Updated: {formatDate(user.updated_at)}</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Role & Permissions Card */}
                        <div>
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <h4 className="card-title text-base-content">Role & Permissions</h4>
                                    <div className="divider mt-0"></div>
                                    
                                    {/* Role */}
                                    <div className="mb-6">
                                        <h5 className="font-medium text-base-content flex items-center">
                                            <div className="bg-primary/10 p-2 rounded-full mr-3">
                                                <FiShield className="text-primary" />
                                            </div>
                                            Role
                                        </h5>
                                        <div className="mt-3 ml-11">
                                            {user.roles && user.roles.length > 0 ? (
                                                user.roles.map(role => {
                                                    const roleLabel = {
                                                        'company_owner': 'Company Owner',
                                                        'company_user': 'Company User',
                                                        'super_admin': 'Super Admin'
                                                    }[role.name] || role.name;
                                                    
                                                    const roleBadgeClass = {
                                                        'company_owner': 'badge-primary',
                                                        'company_user': 'badge-secondary',
                                                        'super_admin': 'badge-accent'
                                                    }[role.name] || 'badge-info';
                                                    
                                                    return (
                                                        <div key={role.id} className={`badge ${roleBadgeClass} badge-lg mr-2`}>
                                                            {roleLabel}
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <p className="text-base-content/70">No roles assigned</p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Permissions */}
                                    <div>
                                        <h5 className="font-medium text-base-content flex items-center">
                                            <div className="bg-primary/10 p-2 rounded-full mr-3">
                                                <FiKey className="text-primary" />
                                            </div>
                                            Permissions
                                        </h5>
                                        <div className="mt-3 ml-11">
                                            {user.permissions && user.permissions.length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {user.permissions.map(permission => (
                                                        <div key={permission.id} className="badge badge-outline badge-lg">
                                                            {permission.name}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-base-content/70">No direct permissions assigned</p>
                                            )}
                                        </div>
                                        
                                        {user.roles && user.roles.length > 0 && user.roles[0].permissions && (
                                            <div className="mt-6 ml-11 card bg-base-200 shadow-sm">
                                                <div className="card-body p-4">
                                                    <h6 className="card-title text-sm">Inherited from Role:</h6>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {user.roles[0].permissions.map(permission => (
                                                            <div key={permission.id} className="badge badge-ghost">
                                                                {permission.name}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Actions */}
                                    <div className="divider"></div>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <Link href={route('admin.companies.users.edit', [company.id, user.id])} className="flex-1">
                                            <button type="button" className="btn btn-outline w-full">
                                                <FiEdit className="mr-2" /> Edit User
                                            </button>
                                        </Link>
                                        <Link href={route('admin.companies.users.destroy', [company.id, user.id])} method="delete" as="button" className="flex-1">
                                            <button type="button" className="btn btn-error w-full">
                                                Delete User
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
