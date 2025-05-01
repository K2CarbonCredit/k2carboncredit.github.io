import { useState, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import SelectInput from '@/Components/SelectInput';
import FileInput from '@/Components/FileInput';
import { FiArrowLeft, FiTruck, FiTag, FiList, FiImage, FiFileText, FiType, FiBatteryCharging, FiHash } from 'react-icons/fi';

export default function Create({ makes, assetTypes, fleets }) {
    const { data, setData, post, processing, errors, setError } = useForm({
        asset_type_id: '',
        asset_subtype_id: '',
        make_id: '',
        model_id: '',
        fuel_type: '',
        registration_number: '',
        chassis_number: '',
        telemetry_provider: '',
        fleet_id: '',
        photos: {},
    });

    const [models, setModels] = useState([]);
    const [assetSubtypes, setAssetSubtypes] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (data.make_id) {
            fetch(route('api.models.by.make', data.make_id))
                .then(res => res.json())
                .then(data => setModels(data));
        }
    }, [data.make_id]);

    useEffect(() => {
        if (data.asset_type_id) {
            fetch(route('api.subtypes.by.type', data.asset_type_id))
                .then(res => res.json())
                .then(data => setAssetSubtypes(data));
        }
    }, [data.asset_type_id]);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        const type = e.target.name.replace('photo_', '');
        
        if (file) {
            // Create a new FormData object
            const updatedPhotos = { ...data.photos };
            updatedPhotos[type] = file;
            setData('photos', updatedPhotos);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Validate photos if fuel type is selected
        if (data.fuel_type && Object.keys(data.photos).length === 0) {
            setError('photos', 'At least one photo is required');
            setIsSubmitting(false);
            return;
        }
        
        // Validate telemetry provider if EV is selected
        if (data.fuel_type === 'ev' && !data.telemetry_provider) {
            setError('telemetry_provider', 'Telemetry provider is required for electric vehicles');
            setIsSubmitting(false);
            return;
        }
        
        // Use regular data object for form submission
        const formData = { ...data };
        
        // Always use FormData for create since we require photos
        const formDataObj = new FormData();
        
        // Add all form fields to FormData
        Object.keys(formData).forEach(key => {
            if (key === 'photos') {
                // Handle photos separately
                Object.keys(data.photos).forEach(photoType => {
                    formDataObj.append(`photos[${photoType}]`, data.photos[photoType]);
                });
            } else {
                formDataObj.append(key, formData[key]);
            }
        });
        
        post(route('company.fleet.vehicles.store'), formDataObj, {
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
                    <h2 className="font-semibold text-xl text-base-content leading-tight">Add New Vehicle</h2>
                    <Link href={route('company.fleet.vehicles.index')}>
                        <button type="button" className="btn btn-outline btn-sm">
                            <FiArrowLeft className="mr-1" /> Back to Fleet
                        </button>
                    </Link>
                </div>
            }
        >
            <Head title="Add Vehicle" />

            <div className="py-6">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h3 className="card-title text-base-content mb-4">Vehicle Information</h3>
                        <div className="divider mt-0"></div>
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="form-control">
                                        <InputLabel htmlFor="asset_type_id" value="Asset Type" />
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <FiTruck className="text-primary" />
                                            </div>
                                            <SelectInput
                                                id="asset_type_id"
                                                className="mt-1 block w-full pl-10"
                                                value={data.asset_type_id}
                                                onChange={e => setData('asset_type_id', e.target.value)}
                                            >
                                                <option value="">Select type</option>
                                                {assetTypes.map(type => (
                                                    <option key={type.id} value={type.id.toString()}>
                                                        {type.name}
                                                    </option>
                                                ))}
                                            </SelectInput>
                                        </div>
                                        <InputError message={errors.asset_type_id} className="mt-2" />
                                    </div>

                                    <div className="form-control">
                                        <InputLabel htmlFor="asset_subtype_id" value="Asset Subtype" />
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <FiType className="text-primary" />
                                            </div>
                                            <SelectInput
                                                id="asset_subtype_id"
                                                className="mt-1 block w-full pl-10"
                                                value={data.asset_subtype_id}
                                                onChange={e => setData('asset_subtype_id', e.target.value)}
                                            >
                                                <option value="">Select subtype</option>
                                                {assetSubtypes.map(subtype => (
                                                    <option key={subtype.id} value={subtype.id.toString()}>
                                                        {subtype.name}
                                                    </option>
                                                ))}
                                            </SelectInput>
                                        </div>
                                        <InputError message={errors.asset_subtype_id} className="mt-2" />
                                    </div>

                                    <div className="form-control">
                                        <InputLabel htmlFor="make_id" value="Make" />
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <FiTag className="text-primary" />
                                            </div>
                                            <SelectInput
                                                id="make_id"
                                                className="mt-1 block w-full pl-10"
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
                                        </div>
                                        <InputError message={errors.make_id} className="mt-2" />
                                    </div>

                                    <div className="form-control">
                                        <InputLabel htmlFor="model_id" value="Model" />
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <FiList className="text-primary" />
                                            </div>
                                            <SelectInput
                                                id="model_id"
                                                className="mt-1 block w-full pl-10"
                                                value={data.model_id}
                                                onChange={e => setData('model_id', e.target.value)}
                                            >
                                                <option value="">Select model</option>
                                                {models.map(model => (
                                                    <option key={model.id} value={model.id.toString()}>
                                                        {model.name}
                                                    </option>
                                                ))}
                                            </SelectInput>
                                        </div>
                                        <InputError message={errors.model_id} className="mt-2" />
                                    </div>

                                    <div className="form-control">
                                        <InputLabel htmlFor="fuel_type" value="Fuel Type" />
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <FiBatteryCharging className="text-primary" />
                                            </div>
                                            <SelectInput
                                                id="fuel_type"
                                                className="mt-1 block w-full pl-10"
                                                value={data.fuel_type}
                                                onChange={e => setData('fuel_type', e.target.value)}
                                            >
                                                <option value="">Select fuel type</option>
                                                <option value="diesel">Diesel</option>
                                                <option value="petrol">Petrol</option>
                                                <option value="ev">Electric</option>
                                            </SelectInput>
                                        </div>
                                        <InputError message={errors.fuel_type} className="mt-2" />
                                    </div>
                                </div>

                                <div className="form-control md:col-span-2">
                                    <InputLabel htmlFor="registration_number" value="Registration Number" />
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <FiFileText className="text-primary" />
                                        </div>
                                        <TextInput
                                            id="registration_number"
                                            type="text"
                                            className="mt-1 block w-full pl-10"
                                            value={data.registration_number}
                                            onChange={e => setData('registration_number', e.target.value)}
                                        />
                                    </div>
                                    <InputError message={errors.registration_number} className="mt-2" />
                                </div>

                                <div className="form-control md:col-span-2">
                                    <InputLabel htmlFor="chassis_number" value="Chassis Number" />
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <FiHash className="text-primary" />
                                        </div>
                                        <TextInput
                                            id="chassis_number"
                                            type="text"
                                            className="mt-1 block w-full pl-10"
                                            value={data.chassis_number}
                                            onChange={e => setData('chassis_number', e.target.value)}
                                        />
                                    </div>
                                    <InputError message={errors.chassis_number} className="mt-2" />
                                </div>

                                {data.fuel_type === 'ev' && (
                                    <div className="form-control md:col-span-2">
                                        <InputLabel htmlFor="telemetry_provider" value="Telemetry Provider" />
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <FiBatteryCharging className="text-primary" />
                                            </div>
                                            <SelectInput
                                                id="telemetry_provider"
                                                className="mt-1 block w-full pl-10"
                                                value={data.telemetry_provider}
                                                onChange={e => setData('telemetry_provider', e.target.value)}
                                            >
                                                <option value="">Select provider</option>
                                                <option value="provider1">Provider 1</option>
                                                <option value="provider2">Provider 2</option>
                                                <option value="provider3">Provider 3</option>
                                            </SelectInput>
                                        </div>
                                        <InputError message={errors.telemetry_provider} className="mt-2" />
                                    </div>
                                )}

                                <div className="mb-8 md:col-span-2">
                                    <h3 className="card-title text-base-content mb-4 text-base">Vehicle Photos</h3>
                                    <div className="divider mt-0"></div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="form-control">
                                            <InputLabel htmlFor="photo_front" value="Front View" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FiImage className="text-primary" />
                                                </div>
                                                <FileInput
                                                    id="photo_front"
                                                    name="photo_front"
                                                    className="mt-1 block w-full pl-10"
                                                    onChange={handlePhotoChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-control">
                                            <InputLabel htmlFor="photo_back" value="Back View" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FiImage className="text-primary" />
                                                </div>
                                                <FileInput
                                                    id="photo_back"
                                                    name="photo_back"
                                                    className="mt-1 block w-full pl-10"
                                                    onChange={handlePhotoChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-control">
                                            <InputLabel htmlFor="photo_left" value="Left Side" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FiImage className="text-primary" />
                                                </div>
                                                <FileInput
                                                    id="photo_left"
                                                    name="photo_left"
                                                    className="mt-1 block w-full pl-10"
                                                    onChange={handlePhotoChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-control">
                                            <InputLabel htmlFor="photo_right" value="Right Side" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FiImage className="text-primary" />
                                                </div>
                                                <FileInput
                                                    id="photo_right"
                                                    name="photo_right"
                                                    className="mt-1 block w-full pl-10"
                                                    onChange={handlePhotoChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <InputError message={errors.photos} className="mt-2" />
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium mb-4">Fleet Assignment</h3>
                                    <div className="form-control">
                                        <InputLabel htmlFor="fleet_id" value="Assign to Fleet (Optional)" />
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <FiTruck className="text-primary" />
                                            </div>
                                            <SelectInput
                                                id="fleet_id"
                                                name="fleet_id"
                                                value={data.fleet_id}
                                                className="mt-1 block w-full pl-10"
                                                onChange={(e) => setData('fleet_id', e.target.value)}
                                            >
                                                <option value="">Select a fleet (optional)</option>
                                                {fleets.map((fleet) => (
                                                    <option key={fleet.id} value={fleet.id}>
                                                        {fleet.name}
                                                    </option>
                                                ))}
                                            </SelectInput>
                                        </div>
                                        <InputError message={errors.fleet_id} className="mt-2" />
                                        <p className="text-sm text-base-content/70 mt-1">
                                            You can assign this vehicle to a fleet now or later from the fleet management page.
                                        </p>
                                    </div>
                                </div>

                                <div className="divider"></div>
                                <div className="flex flex-col sm:flex-row gap-2 justify-end">
                                    <Link href={route('company.fleet.vehicles.index')}>
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
                                        Add Vehicle
                                    </button>
                                </div>
                            </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
