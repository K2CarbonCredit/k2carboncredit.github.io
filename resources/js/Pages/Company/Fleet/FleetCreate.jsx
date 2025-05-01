import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import SelectInput from '@/Components/SelectInput';
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiMapPin, FiTag, FiFileText } from 'react-icons/fi';

export default function FleetCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        manager_name: '',
        manager_email: '',
        manager_phone: '',
        location: '',
        status: 'active',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        post(route('company.fleets.store'), {
            onSuccess: () => {
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-base-content leading-tight">Create New Fleet</h2>
                </div>
            }
        >
            <Head title="Create New Fleet" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link href={route('company.fleets.index')} className="btn btn-outline btn-sm">
                            <FiArrowLeft className="mr-2" /> Back to Fleets
                        </Link>
                    </div>
                    
                    <div className="bg-base-100 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium mb-4">Fleet Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="form-control">
                                            <InputLabel htmlFor="name" value="Fleet Name *" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FiTag className="text-primary" />
                                                </div>
                                                <TextInput
                                                    id="name"
                                                    type="text"
                                                    name="name"
                                                    value={data.name}
                                                    className="mt-1 block w-full pl-10"
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <InputError message={errors.name} className="mt-2" />
                                        </div>
                                        
                                        <div className="form-control">
                                            <InputLabel htmlFor="status" value="Status" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FiTag className="text-primary" />
                                                </div>
                                                <SelectInput
                                                    id="status"
                                                    name="status"
                                                    value={data.status}
                                                    className="mt-1 block w-full pl-10"
                                                    onChange={(e) => setData('status', e.target.value)}
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                </SelectInput>
                                            </div>
                                            <InputError message={errors.status} className="mt-2" />
                                        </div>
                                        
                                        <div className="form-control md:col-span-2">
                                            <InputLabel htmlFor="description" value="Description" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FiFileText className="text-primary" />
                                                </div>
                                                <TextInput
                                                    id="description"
                                                    type="text"
                                                    name="description"
                                                    value={data.description}
                                                    className="mt-1 block w-full pl-10"
                                                    onChange={(e) => setData('description', e.target.value)}
                                                />
                                            </div>
                                            <InputError message={errors.description} className="mt-2" />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="divider"></div>
                                
                                <div>
                                    <h3 className="text-lg font-medium mb-4">Fleet Manager</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="form-control">
                                            <InputLabel htmlFor="manager_name" value="Manager Name" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FiUser className="text-primary" />
                                                </div>
                                                <TextInput
                                                    id="manager_name"
                                                    type="text"
                                                    name="manager_name"
                                                    value={data.manager_name}
                                                    className="mt-1 block w-full pl-10"
                                                    onChange={(e) => setData('manager_name', e.target.value)}
                                                />
                                            </div>
                                            <InputError message={errors.manager_name} className="mt-2" />
                                        </div>
                                        
                                        <div className="form-control">
                                            <InputLabel htmlFor="manager_email" value="Manager Email" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FiMail className="text-primary" />
                                                </div>
                                                <TextInput
                                                    id="manager_email"
                                                    type="email"
                                                    name="manager_email"
                                                    value={data.manager_email}
                                                    className="mt-1 block w-full pl-10"
                                                    onChange={(e) => setData('manager_email', e.target.value)}
                                                />
                                            </div>
                                            <InputError message={errors.manager_email} className="mt-2" />
                                        </div>
                                        
                                        <div className="form-control">
                                            <InputLabel htmlFor="manager_phone" value="Manager Phone" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FiPhone className="text-primary" />
                                                </div>
                                                <TextInput
                                                    id="manager_phone"
                                                    type="text"
                                                    name="manager_phone"
                                                    value={data.manager_phone}
                                                    className="mt-1 block w-full pl-10"
                                                    onChange={(e) => setData('manager_phone', e.target.value)}
                                                />
                                            </div>
                                            <InputError message={errors.manager_phone} className="mt-2" />
                                        </div>
                                        
                                        <div className="form-control">
                                            <InputLabel htmlFor="location" value="Location" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FiMapPin className="text-primary" />
                                                </div>
                                                <TextInput
                                                    id="location"
                                                    type="text"
                                                    name="location"
                                                    value={data.location}
                                                    className="mt-1 block w-full pl-10"
                                                    onChange={(e) => setData('location', e.target.value)}
                                                />
                                            </div>
                                            <InputError message={errors.location} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                <div className="divider"></div>
                                <div className="flex flex-col sm:flex-row gap-2 justify-end">
                                    <Link href={route('company.fleets.index')}>
                                        <button type="button" className="btn btn-outline w-full sm:w-auto">
                                            Cancel
                                        </button>
                                    </Link>
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-full sm:w-auto"
                                        disabled={processing || isSubmitting}
                                    >
                                        {(processing || isSubmitting) ? <span className="loading loading-spinner loading-sm mr-2"></span> : null}
                                        Create Fleet
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
