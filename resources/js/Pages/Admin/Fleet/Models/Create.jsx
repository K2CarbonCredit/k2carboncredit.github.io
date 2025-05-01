import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import SelectInput from '@/Components/SelectInput';

export default function Create({ makes }) {
    const { data, setData, post, processing, errors } = useForm({
        make_id: '',
        name: '',
        description: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.fleet.models.store'));
    };

    return (
        <AdminLayout>
            <Head title="Add Vehicle Model" />

            <div className="container mx-auto py-6">
                <div className="max-w-3xl mx-auto">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title text-xl font-semibold mb-4">Add Vehicle Model</h2>
                            <p className="text-sm text-base-content/70 mb-6">Create a new vehicle model that will be available for company users.</p>
                            
                            <form onSubmit={submit} className="space-y-6">
                                <div className="form-control w-full">
                                    <InputLabel htmlFor="make_id" value="Make" className="label-text font-medium" />
                                    <SelectInput
                                        id="make_id"
                                        className="select select-bordered w-full"
                                        value={data.make_id}
                                        onChange={e => setData('make_id', e.target.value)}
                                    >
                                        <option value="">Select make</option>
                                        {makes.map(make => (
                                            <option key={make.id} value={make.id.toString()}>
                                                {make.name}
                                            </option>
                                        ))}
                                    </SelectInput>
                                    <InputError message={errors.make_id} className="text-error text-sm mt-1" />
                                </div>

                                <div className="form-control w-full">
                                    <InputLabel htmlFor="name" value="Name" className="label-text font-medium" />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        className="input input-bordered w-full"
                                        placeholder="Enter model name (e.g. Corolla, Civic)"
                                        onChange={e => setData('name', e.target.value)}
                                    />
                                    <InputError message={errors.name} className="text-error text-sm mt-1" />
                                </div>

                                <div className="form-control w-full">
                                    <InputLabel htmlFor="description" value="Description" className="label-text font-medium" />
                                    <textarea
                                        id="description"
                                        className="textarea textarea-bordered w-full"
                                        placeholder="Enter a brief description of this model"
                                        rows="3"
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                    />
                                    <InputError message={errors.description} className="text-error text-sm mt-1" />
                                </div>

                                <div className="flex justify-end gap-2 mt-8">
                                    <Link href={route('admin.fleet.models.index')} className="btn btn-outline">
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={processing}
                                    >
                                        {processing ? <span className="loading loading-spinner loading-sm"></span> : null}
                                        Create Model
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
