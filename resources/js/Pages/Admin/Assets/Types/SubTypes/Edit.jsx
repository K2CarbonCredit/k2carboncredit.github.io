import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { FiSave, FiX, FiArrowLeft } from 'react-icons/fi';

export default function AssetSubTypeEdit({ auth, assetType, subType }) {
    const { data, setData, put, processing, errors } = useForm({
        name: subType.name || '',
        description: subType.description || '',
        status: subType.status || 'active',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.types.sub-types.update', [assetType.id, subType.id]));
    };

    return (
        <AdminLayout
            user={auth.user}
        >
            <Head title={`Edit Asset Sub-type: ${subType.name}`} />

            <div>
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <div className="card-header flex items-center justify-between mb-4">
                            <h3 className="card-title text-base-content text-xl font-semibold inline-block">Edit Sub-type: {subType.name}</h3>
                            <div className="flex gap-2">
                                <Link href={route('admin.types.sub-types.index', assetType.id)}>
                                    <button type="button" className="btn btn-outline btn-sm">
                                        <FiArrowLeft className="mr-1" /> Back to Sub-types
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <h3 className="card-title text-base-content mb-4">Sub-type Information</h3>
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

                            <div className="flex flex-col sm:flex-row gap-2 justify-end mt-8 pt-4 border-t">
                                <Link href={route('admin.types.sub-types.index', assetType.id)}>
                                    <button type="button" className="btn btn-outline w-full sm:w-auto">
                                        <FiX className="mr-2" /> Cancel
                                    </button>
                                </Link>
                                <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={processing}>
                                    {processing ? <span className="loading loading-spinner loading-sm mr-2"></span> : null}
                                    <FiSave className="mr-2" /> Update Sub-type
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
