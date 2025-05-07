import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { FiSave, FiX, FiArrowLeft, FiPlus } from 'react-icons/fi';

export default function AssetSubTypeCreate({ auth, assetType }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        status: 'active',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.types.sub-types.store', assetType.id));
    };

    return (
        <AdminLayout
            user={auth.user}
        >
            <Head title={`Create Asset Sub-type - ${assetType.name}`} />

            <div>
                <div className="card bg-base-100 shadow-xl mb-6">
                    <div className="card-body">
                        <div className="card-header flex items-center justify-between mb-4">
                            <h3 className="card-title text-base-content text-xl font-semibold inline-block">Create New Asset Sub-type</h3>
                            <div className="flex gap-2">
                                <Link href={route('admin.types.sub-types.index', assetType.id)}>
                                    <button type="button" className="btn btn-outline btn-sm">
                                        <FiArrowLeft className="mr-1" /> Back to Sub-types
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <div className="divider mt-0"></div>

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div className="form-control w-full">
                                    <InputLabel htmlFor="name" value="Name" />
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

                                {/* Status */}
                                <div className="form-control w-full">
                                    <InputLabel htmlFor="status" value="Status" />
                                    <select
                                        id="status"
                                        name="status"
                                        className="select select-bordered w-full mt-1"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                    <InputError message={errors.status} className="mt-2" />
                                </div>

                                {/* Description */}
                                <div className="form-control w-full col-span-1 md:col-span-2">
                                    <InputLabel htmlFor="description" value="Description" />
                                    <textarea
                                        id="description"
                                        name="description"
                                        className="textarea textarea-bordered w-full mt-1"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows="4"
                                    ></textarea>
                                    <InputError message={errors.description} className="mt-2" />
                                </div>
                                </div>

                            <div className="flex items-center justify-end mt-6 gap-4">
                                <Link href={route('admin.types.sub-types.index', assetType.id)} className="btn btn-outline">
                                    <FiX className="mr-2" /> Cancel
                                </Link>
                                <button type="submit" className="btn btn-primary" disabled={processing}>
                                    {processing ? (
                                        <>
                                            <span className="loading loading-spinner loading-xs mr-2"></span> Saving...
                                        </>
                                    ) : (
                                        <>
                                            <FiSave className="mr-2" /> Save Sub-type
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
