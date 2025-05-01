import { useState, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import SelectInput from '@/Components/SelectInput';
import FileInput from '@/Components/FileInput';
import { FiArrowLeft, FiTruck, FiTag, FiList, FiImage, FiFileText, FiType, FiBatteryCharging, FiHash } from 'react-icons/fi';

export default function Edit({ vehicle, makes, assetTypes, fleets }) {
    const { data, setData, put, processing, errors, setError } = useForm({
        asset_type_id: vehicle.asset_type_id.toString(),
        asset_subtype_id: vehicle.asset_subtype_id.toString(),
        make_id: vehicle.make_id.toString(),
        model_id: vehicle.model_id.toString(),
        fuel_type: vehicle.fuel_type,
        registration_number: vehicle.registration_number,
        chassis_number: vehicle.chassis_number,
        telemetry_provider: vehicle.telemetry_provider || '',
        fleet_id: vehicle.fleet_id ? vehicle.fleet_id.toString() : '',
        onboarding_status: vehicle.onboarding_status || {
            information: false,
            photos: false,
            telemetry: false,
            manual_verification: false
        },
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
        
        // Validate telemetry provider if EV is selected
        if (data.fuel_type === 'ev' && !data.telemetry_provider) {
            setError('telemetry_provider', 'Telemetry provider is required for electric vehicles');
            setIsSubmitting(false);
            return;
        }
        
        // Use the regular data object with the onboarding_status as a JSON string
        const formData = {
            ...data,
            onboarding_status: JSON.stringify(data.onboarding_status)
        };
        
        // Only use FormData if we have photos to upload
        if (Object.keys(data.photos).length > 0) {
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
            
            put(route('company.fleet.vehicles.update', vehicle.id), formDataObj, {
                onSuccess: () => {
                    setIsSubmitting(false);
                },
                onError: () => {
                    setIsSubmitting(false);
                }
            });
        } else {
            // Use regular JSON submission if no photos
            put(route('company.fleet.vehicles.update', vehicle.id), formData, {
                onSuccess: () => {
                    setIsSubmitting(false);
                },
                onError: () => {
                    setIsSubmitting(false);
                }
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-base-content leading-tight">Edit Vehicle</h2>
                    <Link href={route('company.fleet.vehicles.index')}>
                        <button type="button" className="btn btn-outline btn-sm">
                            <FiArrowLeft className="mr-1" /> Back to Fleet
                        </button>
                    </Link>
                </div>
            }
        >
            <Head title="Edit Vehicle" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="text-xl font-semibold mb-4">Vehicle Details</h2>
                            <p className="text-sm text-base-content/70 mb-6">Update the details of this vehicle.</p>
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-control w-full">
                                        <InputLabel htmlFor="asset_type_id" value="Asset Type" className="label-text font-medium" />
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
                                        <InputError message={errors.asset_type_id} className="text-error text-sm mt-1" />
                                    </div>

                                    <div className="form-control w-full">
                                        <InputLabel htmlFor="asset_subtype_id" value="Asset Subtype" className="label-text font-medium" />
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <FiTag className="text-primary" />
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
                                        <InputError message={errors.asset_subtype_id} className="text-error text-sm mt-1" />
                                    </div>

                                    <div className="form-control w-full">
                                        <InputLabel htmlFor="make_id" value="Make" className="label-text font-medium" />
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <FiType className="text-primary" />
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
                                        <InputError message={errors.make_id} className="text-error text-sm mt-1" />
                                    </div>

                                    <div className="form-control w-full">
                                        <InputLabel htmlFor="model_id" value="Model" className="label-text font-medium" />
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
                                        <InputError message={errors.model_id} className="text-error text-sm mt-1" />
                                    </div>

                                    <div className="form-control w-full">
                                        <InputLabel htmlFor="fuel_type" value="Fuel Type" className="label-text font-medium" />
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
                                        <InputError message={errors.fuel_type} className="text-error text-sm mt-1" />
                                    </div>

                                    {data.fuel_type === 'ev' && (
                                        <div className="form-control w-full">
                                            <InputLabel htmlFor="telemetry_provider" value="Telemetry Provider" className="label-text font-medium" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FiTruck className="text-primary" />
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
                                            <InputError message={errors.telemetry_provider} className="text-error text-sm mt-1" />
                                        </div>
                                    )}

                                    <div className="form-control w-full">
                                        <InputLabel htmlFor="registration_number" value="Registration Number" className="label-text font-medium" />
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
                                        <InputError message={errors.registration_number} className="text-error text-sm mt-1" />
                                    </div>

                                    <div className="form-control w-full">
                                        <InputLabel htmlFor="chassis_number" value="Chassis Number" className="label-text font-medium" />
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
                                        <InputError message={errors.chassis_number} className="text-error text-sm mt-1" />
                                    </div>
                                </div>

                                <div className="form-control w-full">
                                    <InputLabel value="Vehicle Photos" className="label-text font-medium mb-2" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="form-control">
                                            <InputLabel htmlFor="photo_front" value="Front View" />
                                            {vehicle.photos?.front && (
                                                <div className="mb-2">
                                                    <img 
                                                        src={`/storage/${vehicle.photos.front}`} 
                                                        alt="Front view" 
                                                        className="w-full h-32 object-cover rounded-md" 
                                                    />
                                                </div>
                                            )}
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
                                            {vehicle.photos?.back && (
                                                <div className="mb-2">
                                                    <img 
                                                        src={`/storage/${vehicle.photos.back}`} 
                                                        alt="Back view" 
                                                        className="w-full h-32 object-cover rounded-md" 
                                                    />
                                                </div>
                                            )}
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
                                            {vehicle.photos?.left && (
                                                <div className="mb-2">
                                                    <img 
                                                        src={`/storage/${vehicle.photos.left}`} 
                                                        alt="Left side view" 
                                                        className="w-full h-32 object-cover rounded-md" 
                                                    />
                                                </div>
                                            )}
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
                                            {vehicle.photos?.right && (
                                                <div className="mb-2">
                                                    <img 
                                                        src={`/storage/${vehicle.photos.right}`} 
                                                        alt="Right side view" 
                                                        className="w-full h-32 object-cover rounded-md" 
                                                    />
                                                </div>
                                            )}
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

                                <div className="form-control w-full">
                                    <InputLabel value="Onboarding Status" className="label-text font-medium mb-2" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="form-control">
                                            <label className="label cursor-pointer justify-start gap-2">
                                                <input 
                                                    type="checkbox" 
                                                    className="checkbox checkbox-primary" 
                                                    checked={data.onboarding_status?.information || false}
                                                    onChange={(e) => setData('onboarding_status', {
                                                        ...data.onboarding_status,
                                                        information: e.target.checked
                                                    })}
                                                />
                                                <span className="label-text">Information Complete</span>
                                            </label>
                                        </div>
                                        <div className="form-control">
                                            <label className="label cursor-pointer justify-start gap-2">
                                                <input 
                                                    type="checkbox" 
                                                    className="checkbox checkbox-primary" 
                                                    checked={data.onboarding_status?.photos || false}
                                                    onChange={(e) => setData('onboarding_status', {
                                                        ...data.onboarding_status,
                                                        photos: e.target.checked
                                                    })}
                                                />
                                                <span className="label-text">Photos Uploaded</span>
                                            </label>
                                        </div>
                                        <div className="form-control">
                                            <label className="label cursor-pointer justify-start gap-2">
                                                <input 
                                                    type="checkbox" 
                                                    className="checkbox checkbox-primary" 
                                                    checked={data.onboarding_status?.telemetry || false}
                                                    onChange={(e) => setData('onboarding_status', {
                                                        ...data.onboarding_status,
                                                        telemetry: e.target.checked
                                                    })}
                                                />
                                                <span className="label-text">Telemetry Connected</span>
                                            </label>
                                        </div>
                                        <div className="form-control">
                                            <label className="label cursor-pointer justify-start gap-2">
                                                <input 
                                                    type="checkbox" 
                                                    className="checkbox checkbox-primary" 
                                                    checked={data.onboarding_status?.manual_verification || false}
                                                    onChange={(e) => setData('onboarding_status', {
                                                        ...data.onboarding_status,
                                                        manual_verification: e.target.checked
                                                    })}
                                                />
                                                <span className="label-text">Manually Verified</span>
                                            </label>
                                        </div>
                                    </div>
                                    <InputError message={errors.onboarding_status} className="text-error text-sm mt-1" />
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
                                        Update Vehicle
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
