import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import Checkbox from '@/Components/Checkbox';
import { FiArrowLeft, FiUser, FiMail, FiLock, FiBriefcase, FiImage, FiEye } from 'react-icons/fi';

export default function Edit({ auth, company, user, roles, permissionGroups, userPermissions }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
        role: user.roles && user.roles.length > 0 ? user.roles[0].name : 'company_user',
        permissions: userPermissions || [],
        title: user.title || '',
        profile_photo_url: user.profile_photo_url || '',
    });
    
    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.companies.users.update', [company.id, user.id]));
    };
    
    const handlePermissionChange = (e) => {
        const { value, checked } = e.target;
        
        if (checked) {
            setData('permissions', [...data.permissions, value]);
        } else {
            setData('permissions', data.permissions.filter(permission => permission !== value));
        }
    };
    
    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-base-content leading-tight">
                        Edit User - {user.name}
                    </h2>
                    <div className="flex gap-2">
                        <Link href={route('admin.companies.users.show', [company.id, user.id])}>
                            <button type="button" className="btn btn-outline btn-sm">
                                <FiEye className="mr-1" /> View User
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
            <Head title={`Edit ${user.name}`} />

            <div className="py-6">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h3 className="card-title text-base-content mb-4">{user.name}</h3>
                        <div className="divider mt-0"></div>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="mb-8">
                                <h3 className="card-title text-base-content mb-4 text-base">User Information</h3>
                                <div className="divider mt-0"></div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name */}
                                    <div className="form-control">
                                        <InputLabel htmlFor="name" value="Name" />
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <FiUser className="text-primary" />
                                            </div>
                                            <TextInput
                                                id="name"
                                                type="text"
                                                className="mt-1 block w-full pl-10"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <InputError message={errors.name} className="mt-2" />
                                    </div>
                                    
                                    {/* Email */}
                                    <div className="form-control">
                                        <InputLabel htmlFor="email" value="Email" />
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <FiMail className="text-primary" />
                                            </div>
                                            <TextInput
                                                id="email"
                                                type="email"
                                                className="mt-1 block w-full pl-10"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <InputError message={errors.email} className="mt-2" />
                                    </div>
                                    
                                    {/* Password */}
                                    <div className="form-control">
                                        <InputLabel htmlFor="password" value="Password (leave blank to keep current)" />
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <FiLock className="text-primary" />
                                            </div>
                                            <TextInput
                                                id="password"
                                                type="password"
                                                className="mt-1 block w-full pl-10"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                autoComplete="new-password"
                                            />
                                        </div>
                                        <InputError message={errors.password} className="mt-2" />
                                    </div>
                                    
                                    {/* Password Confirmation */}
                                    <div className="form-control">
                                        <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <FiLock className="text-primary" />
                                            </div>
                                            <TextInput
                                                id="password_confirmation"
                                                type="password"
                                                className="mt-1 block w-full pl-10"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                autoComplete="new-password"
                                            />
                                        </div>
                                        <InputError message={errors.password_confirmation} className="mt-2" />
                                    </div>
                                    
                                    {/* Job Title */}
                                    <div className="form-control">
                                        <InputLabel htmlFor="title" value="Job Title" />
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <FiBriefcase className="text-primary" />
                                            </div>
                                            <TextInput
                                                id="title"
                                                type="text"
                                                className="mt-1 block w-full pl-10"
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
                                                placeholder="e.g. Project Manager"
                                            />
                                        </div>
                                        <InputError message={errors.title} className="mt-2" />
                                    </div>
                                    
                                    {/* Profile Photo URL */}
                                    <div className="form-control">
                                        <InputLabel htmlFor="profile_photo_url" value="Profile Photo URL" />
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <FiImage className="text-primary" />
                                            </div>
                                            <TextInput
                                                id="profile_photo_url"
                                                type="url"
                                                className="mt-1 block w-full pl-10"
                                                value={data.profile_photo_url}
                                                onChange={(e) => setData('profile_photo_url', e.target.value)}
                                                placeholder="https://example.com/photo.jpg"
                                            />
                                        </div>
                                        <InputError message={errors.profile_photo_url} className="mt-2" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mb-8">
                                <h3 className="text-lg font-medium text-gray-700 mb-4">Role & Permissions</h3>
                                
                                {/* Role */}
                                <div className="mb-6">
                                    <InputLabel htmlFor="role" value="Role" />
                                    <SelectInput
                                        id="role"
                                        className="mt-1 block w-full"
                                        value={data.role}
                                        onChange={(e) => setData('role', e.target.value)}
                                        required
                                    >
                                        {roles.map(role => (
                                            <option key={role.id} value={role.name}>
                                                {role.name === 'company_owner' ? 'Company Owner' : 'Company User'}
                                            </option>
                                        ))}
                                    </SelectInput>
                                    <InputError message={errors.role} className="mt-2" />
                                    <p className="text-sm text-gray-500 mt-1">
                                        {data.role === 'company_owner' 
                                            ? 'Company Owners have full access to manage the company and its users.' 
                                            : 'Company Users have limited access based on assigned permissions.'}
                                    </p>
                                </div>
                                
                                {/* Permissions */}
                                {data.role === 'company_user' && (
                                    <div>
                                        <InputLabel value="Additional Permissions" />
                                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {Object.entries(permissionGroups).map(([group, permissions]) => (
                                                <div key={group} className="border rounded-md p-4">
                                                    <h4 className="font-semibold mb-2 capitalize">{group}</h4>
                                                    <div className="space-y-2">
                                                        {permissions.map(permission => (
                                                            <label key={permission.id} className="flex items-center">
                                                                <Checkbox
                                                                    name="permissions[]"
                                                                    value={permission.name}
                                                                    checked={data.permissions.includes(permission.name)}
                                                                    onChange={handlePermissionChange}
                                                                />
                                                                <span className="ml-2 text-sm text-gray-600">
                                                                    {permission.name}
                                                                </span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <InputError message={errors.permissions} className="mt-2" />
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex items-center justify-end mt-8">
                                <Link href={route('admin.companies.users.show', [company.id, user.id])}>
                                    <button type="button" className="btn btn-outline btn-sm mr-2">
                                        Cancel
                                    </button>
                                </Link>
                                <button type="submit" className="btn btn-primary btn-sm" disabled={processing}>
                                    Update User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
