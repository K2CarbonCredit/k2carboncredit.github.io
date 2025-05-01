import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import SelectInput from '@/Components/SelectInput';

export default function Edit({ make }) {
    const { data, setData, put, processing, errors } = useForm({
        name: make.name,
        description: make.description || '',
        status: make.status,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.fleet.makes.update', make.id));
    };

    return (
        <AdminLayout>
            <Head title="Edit Vehicle Make" />

            <div className="container mx-auto py-6">
                <div className="max-w-3xl mx-auto">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title text-xl font-semibold mb-4">Edit Vehicle Make</h2>
                            <p className="text-sm text-base-content/70 mb-6">Update the details of this vehicle make.</p>
                            
                            <form onSubmit={submit} className="space-y-6">
                                <div className="form-control w-full">
                                    <InputLabel htmlFor="name" value="Name" className="label-text font-medium" />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        className="input input-bordered w-full"
                                        placeholder="Enter make name (e.g. Toyota, Honda)"
                                        onChange={e => setData('name', e.target.value)}
                                    />
                                    <InputError message={errors.name} className="text-error text-sm mt-1" />
                                </div>

                                <div className="form-control w-full">
                                    <InputLabel htmlFor="description" value="Description" className="label-text font-medium" />
                                    <textarea
                                        id="description"
                                        className="textarea textarea-bordered w-full"
                                        placeholder="Enter a brief description of this make"
                                        rows="3"
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                    />
                                    <InputError message={errors.description} className="text-error text-sm mt-1" />
                                </div>

                                <div className="form-control w-full">
                                    <InputLabel htmlFor="status" value="Status" className="label-text font-medium" />
                                    <SelectInput
                                        id="status"
                                        className="select select-bordered w-full"
                                        value={data.status}
                                        onChange={e => setData('status', e.target.value)}
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </SelectInput>
                                    <InputError message={errors.status} className="text-error text-sm mt-1" />
                                </div>

                                <div className="flex justify-end gap-2 mt-8">
                                    <Link href={route('admin.fleet.makes.index')} className="btn btn-outline">
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={processing}
                                    >
                                        {processing ? <span className="loading loading-spinner loading-sm"></span> : null}
                                        Update Make
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
