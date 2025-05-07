import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { FiArrowLeft, FiSave } from 'react-icons/fi';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        status: 'active',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.fleet.makes.store'));
    };

    return (
        <AdminLayout>
            <Head title="Add Vehicle Make" />

            <div>
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <div className="card-header flex items-center justify-between mb-4">
                            <h3 className="card-title text-base-content text-xl font-semibold inline-block">Add New Vehicle Make</h3>
                            <div className="flex gap-2">
                                <Link href={route('admin.fleet.makes.index')}>
                                    <button type="button" className="btn btn-outline btn-sm">
                                        <FiArrowLeft className="mr-1" /> Back to Makes
                                    </button>
                                </Link>
                            </div>
                        </div>
                        
                        <h3 className="card-title text-base-content mb-4">Make Information</h3>
                        <div className="divider mt-0"></div>
                        <p className="text-sm text-base-content/70 mb-6">Create a new vehicle make that will be available for company users.</p>
                        
                        <form onSubmit={submit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="form-control w-full">
                                    <InputLabel htmlFor="name" value="Name" required />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        className="mt-1 block w-full"
                                        placeholder="Enter make name (e.g. Toyota, Honda)"
                                        onChange={e => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div className="form-control w-full">
                                    <InputLabel htmlFor="status" value="Status" required />
                                    <select
                                        id="status"
                                        name="status"
                                        className="select select-bordered w-full mt-1"
                                        value={data.status || 'active'}
                                        onChange={(e) => setData('status', e.target.value)}
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                    <InputError message={errors.status} className="mt-2" />
                                </div>
                            </div>

                            <div className="form-control w-full mt-6">
                                <InputLabel htmlFor="description" value="Description" />
                                <textarea
                                    id="description"
                                    className="textarea textarea-bordered w-full mt-1"
                                    placeholder="Enter a brief description of this make"
                                    rows="3"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                />
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 justify-end mt-8 pt-4 border-t">
                                <Link href={route('admin.fleet.makes.index')}>
                                    <button type="button" className="btn btn-outline w-full sm:w-auto">
                                        Cancel
                                    </button>
                                </Link>
                                <button
                                    type="submit"
                                    className="btn btn-primary w-full sm:w-auto"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm mr-2"></span> Saving...
                                        </>
                                    ) : (
                                        <>
                                            <FiSave className="mr-1" /> Save Make
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
