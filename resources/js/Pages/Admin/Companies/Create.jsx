import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import TextareaInput from '@/Components/TextareaInput';
import { FiArrowLeft, FiHome, FiMail, FiPhone, FiGlobe, FiBriefcase, FiMapPin, FiFileText, FiUser, FiLock } from 'react-icons/fi';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        address: '',
        city: '',
        state: '',
        country: '',
        postal_code: '',
        phone: '',
        website: '',
        industry: '',
        description: '',
        status: 'active',
        
        // Company owner details
        owner_name: '',
        owner_email: '',
        owner_password: '',
    });
    
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.companies.store'), {
            onSuccess: () => reset(),
        });
    };
    
    return (
        <AdminLayout
            user={auth?.user}
        >
            <Head title="Create Company" />

            <div>
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <div className="card-header flex items-center justify-between mb-4">
                            <h3 className="card-title text-base-content text-xl font-semibold inline-block">Create New Company</h3>
                            <Link href={route('admin.companies.index')}>
                                <button type="button" className="btn btn-outline btn-sm">
                                    <FiArrowLeft className="mr-1" /> Back to Companies
                                </button>
                            </Link>
                        </div>
                        
                        <form onSubmit={handleSubmit}>
                                <div className="mb-8">
                                    <h3 className="text-lg font-medium text-base-content mb-4">Company Information</h3>
                                    <div className="divider mt-0"></div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Company Name */}
                                        <div className="form-control">
                                            <InputLabel htmlFor="name" value="Company Name" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FiHome className="text-primary" />
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
                                        
                                        {/* Company Email */}
                                        <div className="form-control">
                                            <InputLabel htmlFor="email" value="Company Email" />
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
                                        
                                        {/* Phone */}
                                        <div className="form-control">
                                            <InputLabel htmlFor="phone" value="Phone" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FiPhone className="text-primary" />
                                                </div>
                                                <TextInput
                                                    id="phone"
                                                    type="text"
                                                    className="mt-1 block w-full pl-10"
                                                    value={data.phone}
                                                    onChange={(e) => setData('phone', e.target.value)}
                                                />
                                            </div>
                                            <InputError message={errors.phone} className="mt-2" />
                                        </div>
                                        
                                        {/* Website */}
                                        <div className="form-control">
                                            <InputLabel htmlFor="website" value="Website" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FiGlobe className="text-primary" />
                                                </div>
                                                <TextInput
                                                    id="website"
                                                    type="url"
                                                    className="mt-1 block w-full pl-10"
                                                    value={data.website}
                                                    onChange={(e) => setData('website', e.target.value)}
                                                    placeholder="https://example.com"
                                                />
                                            </div>
                                            <InputError message={errors.website} className="mt-2" />
                                        </div>
                                        
                                        {/* Industry */}
                                        <div className="form-control">
                                            <InputLabel htmlFor="industry" value="Industry" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FiBriefcase className="text-primary" />
                                                </div>
                                                <TextInput
                                                    id="industry"
                                                    type="text"
                                                    className="mt-1 block w-full pl-10"
                                                    value={data.industry}
                                                    onChange={(e) => setData('industry', e.target.value)}
                                                />
                                            </div>
                                            <InputError message={errors.industry} className="mt-2" />
                                        </div>
                                        
                                        {/* Status */}
                                        <div className="form-control">
                                            <InputLabel htmlFor="status" value="Status" />
                                            <div className="relative">
                                                <SelectInput
                                                    id="status"
                                                    className="mt-1 block w-full select select-bordered"
                                                    value={data.status}
                                                    onChange={(e) => setData('status', e.target.value)}
                                                    required
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                    <option value="pending">Pending</option>
                                                </SelectInput>
                                            </div>
                                            <InputError message={errors.status} className="mt-2" />
                                        </div>
                                    </div>
                                    
                                    {/* Address */}
                                    <div className="mt-6">
                                        <h4 className="font-medium text-base-content mb-3">Address Information</h4>
                                        <div className="form-control">
                                            <InputLabel htmlFor="address" value="Address" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FiMapPin className="text-primary" />
                                                </div>
                                                <TextInput
                                                    id="address"
                                                    type="text"
                                                    className="mt-1 block w-full pl-10"
                                                    value={data.address}
                                                    onChange={(e) => setData('address', e.target.value)}
                                                />
                                            </div>
                                            <InputError message={errors.address} className="mt-2" />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
                                        {/* City */}
                                        <div className="form-control">
                                            <InputLabel htmlFor="city" value="City" />
                                            <TextInput
                                                id="city"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.city}
                                                onChange={(e) => setData('city', e.target.value)}
                                            />
                                            <InputError message={errors.city} className="mt-2" />
                                        </div>
                                        
                                        {/* State/Province */}
                                        <div className="form-control">
                                            <InputLabel htmlFor="state" value="State/Province" />
                                            <TextInput
                                                id="state"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.state}
                                                onChange={(e) => setData('state', e.target.value)}
                                            />
                                            <InputError message={errors.state} className="mt-2" />
                                        </div>
                                        
                                        {/* Country */}
                                        <div className="form-control">
                                            <InputLabel htmlFor="country" value="Country" />
                                            <TextInput
                                                id="country"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.country}
                                                onChange={(e) => setData('country', e.target.value)}
                                            />
                                            <InputError message={errors.country} className="mt-2" />
                                        </div>
                                        
                                        {/* Postal Code */}
                                        <div className="form-control">
                                            <InputLabel htmlFor="postal_code" value="Postal Code" />
                                            <TextInput
                                                id="postal_code"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.postal_code}
                                                onChange={(e) => setData('postal_code', e.target.value)}
                                            />
                                            <InputError message={errors.postal_code} className="mt-2" />
                                        </div>
                                    </div>
                                    
                                    {/* Description */}
                                    <div className="form-control mt-6">
                                        <InputLabel htmlFor="description" value="Description" />
                                        <div className="relative">
                                            <div className="absolute top-3 left-3 pointer-events-none">
                                                <FiFileText className="text-primary" />
                                            </div>
                                            <TextareaInput
                                                id="description"
                                                className="mt-1 block w-full pl-10"
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                rows={4}
                                            />
                                        </div>
                                        <InputError message={errors.description} className="mt-2" />
                                    </div>
                                </div>
                                
                                <div className="mb-8">
                                    <h3 className="text-lg font-medium text-base-content mb-4">Company Owner</h3>
                                    <div className="divider mt-0"></div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Owner Name */}
                                        <div className="form-control">
                                            <InputLabel htmlFor="owner_name" value="Owner Name" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FiUser className="text-primary" />
                                                </div>
                                                <TextInput
                                                    id="owner_name"
                                                    type="text"
                                                    className="mt-1 block w-full pl-10"
                                                    value={data.owner_name}
                                                    onChange={(e) => setData('owner_name', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <InputError message={errors.owner_name} className="mt-2" />
                                        </div>
                                        
                                        {/* Owner Email */}
                                        <div className="form-control">
                                            <InputLabel htmlFor="owner_email" value="Owner Email" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FiMail className="text-primary" />
                                                </div>
                                                <TextInput
                                                    id="owner_email"
                                                    type="email"
                                                    className="mt-1 block w-full pl-10"
                                                    value={data.owner_email}
                                                    onChange={(e) => setData('owner_email', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <InputError message={errors.owner_email} className="mt-2" />
                                        </div>
                                        
                                        {/* Owner Password */}
                                        <div className="form-control md:col-span-2">
                                            <InputLabel htmlFor="owner_password" value="Owner Password" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FiLock className="text-primary" />
                                                </div>
                                                <TextInput
                                                    id="owner_password"
                                                    type="password"
                                                    className="mt-1 block w-full pl-10"
                                                    value={data.owner_password}
                                                    onChange={(e) => setData('owner_password', e.target.value)}
                                                    required
                                                    autoComplete="new-password"
                                                />
                                            </div>
                                            <InputError message={errors.owner_password} className="mt-2" />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="divider"></div>
                                <div className="flex flex-col sm:flex-row gap-2 justify-end">
                                    <Link href={route('admin.companies.index')}>
                                        <button type="button" className="btn btn-outline w-full sm:w-auto">
                                            Cancel
                                        </button>
                                    </Link>
                                    <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={processing}>
                                        {processing ? <span className="loading loading-spinner loading-sm mr-2"></span> : null}
                                        Create Company
                                    </button>
                                </div>
                            </form>
                    </div>
                </div>
                <div className="h-16"></div>
            </div>
        </AdminLayout>
    );
}
