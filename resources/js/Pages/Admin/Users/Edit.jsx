import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import Checkbox from '@/Components/Checkbox';
import { FiArrowLeft, FiUser, FiMail, FiLock, FiBriefcase, FiImage, FiBuilding } from 'react-icons/fi';

export default function Edit({ auth, user, roles, permissionGroups, userPermissions, companies }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
        role: user.roles && user.roles.length > 0 ? user.roles[0].name : '',
        permissions: userPermissions || [],
        company_id: user.company_id || '',
        title: user.title || '',
        profile_photo_url: user.profile_photo_url || '',
    });
    
    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.users.update', user.id));
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
                        Edit User: {user.name}
                    </h2>
                    <Link href={route('admin.users.show', user.id)}>
                        <button type="button" className="btn btn-outline btn-sm">
                            <FiArrowLeft className="mr-1" /> Back to User
                        </button>
                    </Link>
                </div>
            }
        >
            <Head title={`Edit User: ${user.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-8">
                                    <h3 className="text-lg font-medium text-base-content mb-4 border-b pb-2">User Information</h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Name */}
                                        <div className="form-control">
                                            <InputLabel htmlFor="name" value="Name" />
                                            <div className="relative">
                                                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content opacity-70" />
                                                <TextInput
                                                    id="name"
                                                    type="text"
                                                    className="pl-10"
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
                                                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content opacity-70" />
                                                <TextInput
                                                    id="email"
                                                    type="email"
                                                    className="pl-10"
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
                                                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content opacity-70" />
                                                <TextInput
                                                    id="password"
                                                    type="password"
                                                    className="pl-10"
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                />
                                            </div>
                                            <InputError message={errors.password} className="mt-2" />
                                        </div>
                                        
                                        {/* Password Confirmation */}
                                        <div className="form-control">
                                            <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                                            <div className="relative">
                                                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content opacity-70" />
                                                <TextInput
                                                    id="password_confirmation"
                                                    type="password"
                                                    className="pl-10"
                                                    value={data.password_confirmation}
                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                />
                                            </div>
                                            <InputError message={errors.password_confirmation} className="mt-2" />
                                        </div>
                                        
                                        {/* Company */}
                                        <div className="form-control">
                                            <InputLabel htmlFor="company_id" value="Company" />
                                            <div className="relative">
                                                <FiBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content opacity-70" />
                                                <SelectInput
                                                    id="company_id"
                                                    className="pl-10"
                                                    value={data.company_id}
                                                    onChange={(e) => setData('company_id', e.target.value)}
                                                >
                                                    <option value="">No Company</option>
                                                    {companies.map(company => (
                                                        <option key={company.id} value={company.id}>
                                                            {company.name}
                                                        </option>
                                                    ))}
                                                </SelectInput>
                                            </div>
                                            <InputError message={errors.company_id} className="mt-2" />
                                        </div>
                                        
                                        {/* Title */}
                                        <div className="form-control">
                                            <InputLabel htmlFor="title" value="Job Title" />
                                            <div className="relative">
                                                <FiBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content opacity-70" />
                                                <TextInput
                                                    id="title"
                                                    type="text"
                                                    className="pl-10"
                                                    value={data.title}
                                                    onChange={(e) => setData('title', e.target.value)}
                                                />
                                            </div>
                                            <InputError message={errors.title} className="mt-2" />
                                        </div>
                                        
                                        {/* Profile Photo URL */}
                                        <div className="form-control">
                                            <InputLabel htmlFor="profile_photo_url" value="Profile Photo URL" />
                                            <div className="relative">
                                                <FiImage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content opacity-70" />
                                                <TextInput
                                                    id="profile_photo_url"
                                                    type="url"
                                                    className="pl-10"
                                                    value={data.profile_photo_url}
                                                    onChange={(e) => setData('profile_photo_url', e.target.value)}
                                                />
                                            </div>
                                            <InputError message={errors.profile_photo_url} className="mt-2" />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mb-8">
                                    <h3 className="text-lg font-medium text-base-content mb-4 border-b pb-2">Role & Permissions</h3>
                                    
                                    {/* Role Selection */}
                                    <div className="form-control mb-6">
                                        <InputLabel htmlFor="role" value="Role" />
                                        <SelectInput
                                            id="role"
                                            className="mt-1"
                                            value={data.role}
                                            onChange={(e) => setData('role', e.target.value)}
                                        >
                                            {roles.map(role => (
                                                <option key={role.id} value={role.name}>
                                                    {role.name}
                                                </option>
                                            ))}
                                        </SelectInput>
                                        <InputError message={errors.role} className="mt-2" />
                                        <p className="text-sm text-base-content/70 mt-2">
                                            {data.role === 'super_admin' 
                                                ? 'Super Admins have full access to the entire system.' 
                                                : data.role === 'company_owner'
                                                ? 'Company Owners have full access to manage their company and its users.' 
                                                : 'Company Users have limited access based on assigned permissions.'}
                                        </p>
                                    </div>
                                    
                                    {/* Permissions */}
                                    {data.role !== 'super_admin' && (
                                        <div>
                                            <InputLabel value="Additional Permissions" />
                                            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {Object.entries(permissionGroups).map(([group, permissions]) => (
                                                    <div key={group} className="card bg-base-200 shadow-sm">
                                                        <div className="card-body p-4">
                                                            <h4 className="card-title text-sm capitalize">{group}</h4>
                                                            <div className="space-y-2">
                                                                {permissions.map(permission => (
                                                                    <label key={permission.id} className="flex items-center cursor-pointer">
                                                                        <input 
                                                                            type="checkbox"
                                                                            className="checkbox checkbox-sm checkbox-primary mr-2"
                                                                            name="permissions[]"
                                                                            value={permission.name}
                                                                            checked={data.permissions.includes(permission.name)}
                                                                            onChange={handlePermissionChange}
                                                                        />
                                                                        <span className="text-sm text-base-content/80">
                                                                            {permission.name}
                                                                        </span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <InputError message={errors.permissions} className="mt-2" />
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex items-center justify-end mt-8">
                                    <Link href={route('admin.users.show', user.id)}>
                                        <button type="button" className="btn btn-outline mr-2">Cancel</button>
                                    </Link>
                                    <button type="submit" className="btn btn-primary ml-4" disabled={processing}>
                                        Update User
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
