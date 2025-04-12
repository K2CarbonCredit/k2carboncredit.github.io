import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SelectInput from '@/Components/SelectInput';
import TextAreaInput from '@/Components/TextAreaInput';
import { FiArrowLeft, FiSave } from 'react-icons/fi';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        api_endpoint: '',
        api_key: '',
        logo: '',
        status: 'active',
        integration_details: JSON.stringify({
            authentication_type: 'api_key',
            data_format: 'json',
            supported_features: []
        }, null, 2)
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.telemetry-providers.store'));
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-base-content leading-tight">
                        Add New Telemetry Provider
                    </h2>
                    <Link href={route('admin.telemetry-providers.index')}>
                        <button type="button" className="btn btn-outline btn-sm">
                            <FiArrowLeft className="mr-1" /> Back to Providers
                        </button>
                    </Link>
                </div>
            }
        >
            <Head title="Add Telemetry Provider" />

            <div className="py-6">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h3 className="card-title text-base-content mb-4">Provider Information</h3>
                        <div className="divider mt-0"></div>

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="form-control w-full">
                                    <InputLabel htmlFor="name" value="Provider Name" required />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div className="form-control w-full">
                                    <InputLabel htmlFor="status" value="Status" required />
                                    <SelectInput
                                        id="status"
                                        name="status"
                                        value={data.status}
                                        className="mt-1 block w-full select select-bordered"
                                        onChange={(e) => setData('status', e.target.value)}
                                        required
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </SelectInput>
                                    <InputError message={errors.status} className="mt-2" />
                                </div>

                                <div className="form-control w-full">
                                    <InputLabel htmlFor="api_endpoint" value="API Endpoint" />
                                    <TextInput
                                        id="api_endpoint"
                                        type="text"
                                        name="api_endpoint"
                                        value={data.api_endpoint}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('api_endpoint', e.target.value)}
                                    />
                                    <InputError message={errors.api_endpoint} className="mt-2" />
                                </div>

                                <div className="form-control w-full">
                                    <InputLabel htmlFor="api_key" value="API Key" />
                                    <TextInput
                                        id="api_key"
                                        type="text"
                                        name="api_key"
                                        value={data.api_key}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('api_key', e.target.value)}
                                    />
                                    <InputError message={errors.api_key} className="mt-2" />
                                </div>

                                <div className="form-control w-full">
                                    <InputLabel htmlFor="logo" value="Logo URL" />
                                    <TextInput
                                        id="logo"
                                        type="text"
                                        name="logo"
                                        value={data.logo}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('logo', e.target.value)}
                                    />
                                    <InputError message={errors.logo} className="mt-2" />
                                </div>
                            </div>

                            <div className="form-control w-full mt-6">
                                <InputLabel htmlFor="description" value="Description" />
                                <TextAreaInput
                                    id="description"
                                    name="description"
                                    value={data.description}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                />
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            <div className="form-control w-full mt-6">
                                <InputLabel htmlFor="integration_details" value="Integration Details (JSON)" />
                                <TextAreaInput
                                    id="integration_details"
                                    name="integration_details"
                                    value={data.integration_details}
                                    className="mt-1 block w-full font-mono text-sm"
                                    onChange={(e) => setData('integration_details', e.target.value)}
                                    rows={10}
                                />
                                <div className="text-xs text-base-content/70 mt-1">
                                    Enter JSON configuration for this provider's integration details.
                                </div>
                                <InputError message={errors.integration_details} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-end mt-8 gap-4">
                                <Link
                                    href={route('admin.telemetry-providers.index')}
                                    className="btn btn-outline"
                                >
                                    Cancel
                                </Link>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={processing}
                                >
                                    <FiSave className="mr-1" /> Save Provider
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
