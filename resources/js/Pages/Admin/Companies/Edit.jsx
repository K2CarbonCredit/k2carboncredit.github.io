import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import TextareaInput from '@/Components/TextareaInput';
import { FiUser, FiMail, FiPhone, FiGlobe, FiMapPin, FiInfo, FiFileText, FiImage, FiArrowLeft, FiEye } from 'react-icons/fi';

export default function Edit({ auth, company }) {
    const [logoPreview, setLogoPreview] = useState(company.logo ? `/storage/${company.logo}` : null);

    const { data, setData, post, processing, errors, reset } = useForm({
        _method: 'PUT',
        name: company.name || '',
        email: company.email || '',
        address: company.address || '',
        city: company.city || '',
        state: company.state || '',
        country: company.country || '',
        postal_code: company.postal_code || '',
        phone: company.phone || '',
        website: company.website || '',
        industry: company.industry || '',
        description: company.description || '',
        status: company.status || 'active',
        logo: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.companies.update', company.id));
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        setData('logo', file);

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setLogoPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-base-content leading-tight">Edit Company</h2>
                    <div className="flex gap-2">
                        <Link href={route('admin.companies.show', company.id)}>
                            <button type="button" className="btn btn-outline btn-sm">
                                <FiEye className="mr-1" /> View
                            </button>
                        </Link>
                        <Link href={route('admin.companies.index')}>
                            <button type="button" className="btn btn-outline btn-sm">
                                <FiArrowLeft className="mr-1" /> Back
                            </button>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Edit ${company.name}`} />

            <div className="py-6">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h3 className="card-title text-base-content mb-4">{company.name}</h3>
                        <div className="divider mt-0"></div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-8">
                                <h3 className="card-title text-base-content mb-4 text-base">Company Information</h3>
                                <div className="divider mt-0"></div>

                                {/* Company Logo */}
                                <div className="mb-6">
                                    <div className="form-control">
                                        <InputLabel htmlFor="logo" value="Company Logo" />
                                        <div className="mt-2 flex items-center gap-4">
                                                {logoPreview ? (
                                                    <div className="relative">
                                                        <img
                                                            src={logoPreview}
                                                            alt="Logo Preview"
                                                            className="w-24 h-24 object-cover rounded-md border border-base-300"
                                                        />
                                                        <button
                                                            type="button"
                                                            className="absolute -top-2 -right-2 bg-error text-error-content btn btn-xs btn-circle"
                                                            onClick={() => {
                                                                setData('logo', null);
                                                                setLogoPreview(null);
                                                            }}
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="w-24 h-24 bg-base-300 rounded-md flex items-center justify-center border border-base-300">
                                                        <span className="text-base-content text-xl font-bold">
                                                            {company.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                )}
                                                <label htmlFor="logo" className="cursor-pointer">
                                                    <span className="btn btn-sm btn-outline">
                                                        <FiImage className="mr-2" /> Change Logo
                                                    </span>
                                                    <input
                                                        id="logo"
                                                        name="logo"
                                                        type="file"
                                                        className="hidden"
                                                        onChange={handleLogoChange}
                                                    accept="image/*"
                                                />
                                            </label>
                                        </div>
                                        <p className="text-sm text-base-content/70 mt-1">
                                            Recommended size: 200x200 pixels. Max file size: 2MB.
                                        </p>
                                        <InputError message={errors.logo} className="mt-2" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Company Name */}
                                    <div className="form-control">
                                        <InputLabel htmlFor="name" value="Company Name" />
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
                                                className="mt-1 block w-full"
                                                value={data.website}
                                                onChange={(e) => setData('website', e.target.value)}
                                                placeholder="https://example.com"
                                            />
                                            <InputError message={errors.website} className="mt-2" />
                                        </div>

                                        {/* Industry */}
                                        <div>
                                            <InputLabel htmlFor="industry" value="Industry" />
                                            <TextInput
                                                id="industry"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.industry}
                                                onChange={(e) => setData('industry', e.target.value)}
                                            />
                                            <InputError message={errors.industry} className="mt-2" />
                                        </div>

                                        {/* Status */}
                                        <div>
                                            <InputLabel htmlFor="status" value="Status" />
                                            <SelectInput
                                                id="status"
                                                className="mt-1 block w-full"
                                                value={data.status}
                                                onChange={(e) => setData('status', e.target.value)}
                                                required
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                                <option value="pending">Pending</option>
                                            </SelectInput>
                                            <InputError message={errors.status} className="mt-2" />
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="mt-6">
                                        <InputLabel htmlFor="address" value="Address" />
                                        <TextInput
                                            id="address"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                        />
                                        <InputError message={errors.address} className="mt-2" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
                                        {/* City */}
                                        <div>
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
                                        <div>
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
                                        <div>
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
                                        <div>
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
                                    <div className="mt-6">
                                        <InputLabel htmlFor="description" value="Description" />
                                        <TextareaInput
                                            id="description"
                                            className="mt-1 block w-full"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            rows={4}
                                        />
                                        <InputError message={errors.description} className="mt-2" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-end mt-8">
                                    <Link href={route('admin.companies.show', company.id)}>
                                        <button type="button" className="btn btn-outline mr-2">Cancel</button>
                                    </Link>
                                    <button type="submit" className="btn btn-primary ml-4" disabled={processing}>
                                        Update Company
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="h-16"></div>
            </div>
        </AdminLayout>
    );
}
