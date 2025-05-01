import { useState, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import SelectInput from '@/Components/SelectInput';
import FileInput from '@/Components/FileInput';
import { FiArrowLeft, FiTool, FiTag, FiList, FiImage, FiFileText, FiType, FiBatteryCharging, FiHash, FiCalendar, FiInfo } from 'react-icons/fi';

export default function Create({ assetTypes, manufacturers }) {
    const { data, setData, post, processing, errors, setError } = useForm({
        name: '',
        asset_type_id: '',
        asset_sub_type_id: '',
        model_number: '',
        serial_number: '',
        manufacturer_id: '',
        power_source: '',
        capacity: '',
        weight: '',
        dimensions: {
            length: '',
            width: '',
            height: '',
            unit: 'cm'
        },
        maintenance_schedule: {
            frequency: '',
            unit: 'months'
        },
        last_maintenance_date: '',
        next_maintenance_date: '',
        photos: {},
        notes: '',
    });

    const [assetSubtypes, setAssetSubtypes] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            const updatedPhotos = { ...data.photos };
            updatedPhotos[type] = file;
            setData('photos', updatedPhotos);
        }
    };

    const handleDimensionsChange = (e, field) => {
        setData('dimensions', {
            ...data.dimensions,
            [field]: e.target.value
        });
    };

    const handleMaintenanceScheduleChange = (e, field) => {
        setData('maintenance_schedule', {
            ...data.maintenance_schedule,
            [field]: e.target.value
        });
    };

    const submit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Validate photos
        if (Object.keys(data.photos).length === 0) {
            setError('photos', 'At least one photo is required');
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
            } else if (key === 'dimensions' || key === 'maintenance_schedule') {
                // Handle nested objects
                formDataObj.append(key, JSON.stringify(formData[key]));
            } else {
                formDataObj.append(key, formData[key]);
            }
        });
        
        post(route('company.fleet.equipment.store'), formDataObj, {
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
                    <h2 className="font-semibold text-xl text-base-content leading-tight">Add New Equipment</h2>
                    <Link href={route('company.fleet.equipment.index')}>
                        <button type="button" className="btn btn-outline btn-sm">
                            <FiArrowLeft className="mr-1" /> Back to Equipment
                        </button>
                    </Link>
                </div>
            }
        >
            <Head title="Add New Equipment" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="text-xl font-semibold mb-4">Equipment Details</h2>
                            <p className="text-sm text-base-content/70 mb-6">Add a new piece of equipment to your fleet.</p>
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-control w-full">
                                        <InputLabel htmlFor="name" value="Equipment Name" className="label-text font-medium" />
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <FiTool className="text-primary" />
                                            </div>
                                            <TextInput
                                                id="name"
                                                type="text"
                                                className="mt-1 block w-full pl-10"
                                                value={data.name}
                                                onChange={e => setData('name', e.target.value)}
                                            />
                                        </div>
                                        <InputError message={errors.name} className="text-error text-sm mt-1" />
                                    </div>

                                    <div className="form-control w-full">
                                        <InputLabel htmlFor="manufacturer_id" value="Manufacturer" />
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <FiTag className="text-primary" />
                                            </div>
                                            <SelectInput
                                                id="manufacturer_id"
                                                name="manufacturer_id"
                                                value={data.manufacturer_id}
                                                className="mt-1 block w-full pl-10"
                                                onChange={(e) => setData('manufacturer_id', e.target.value)}
                                            >
                                                <option value="">Select Manufacturer</option>
                                                {manufacturers.map((manufacturer) => (
                                                    <option key={manufacturer.id} value={manufacturer.id}>{manufacturer.name}</option>
                                                ))}
                                            </SelectInput>
                                        </div>
                                        <InputError message={errors.manufacturer_id} className="mt-2" />
                                    </div>

                                    <div className="form-control w-full">
                                        <InputLabel htmlFor="asset_type_id" value="Asset Type" className="label-text font-medium" />
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <FiType className="text-primary" />
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
                                        <InputLabel htmlFor="asset_sub_type_id" value="Asset Subtype *" />
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <FiType className="text-primary" />
                                            </div>
                                            <SelectInput
                                                id="asset_sub_type_id"
                                                name="asset_sub_type_id"
                                                value={data.asset_sub_type_id}
                                                className="mt-1 block w-full pl-10"
                                                onChange={(e) => setData('asset_sub_type_id', e.target.value)}
                                            >
                                                <option value="">Select subtype</option>
                                                {assetSubtypes.map(subtype => (
                                                    <option key={subtype.id} value={subtype.id.toString()}>
                                                        {subtype.name}
                                                    </option>
                                                ))}
                                            </SelectInput>
                                        </div>
                                        <InputError message={errors.asset_sub_type_id} className="text-error text-sm mt-1" />
                                    </div>

                                    <div className="form-control w-full">
                                        <InputLabel htmlFor="manufacturer" value="Manufacturer" className="label-text font-medium" />
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <FiList className="text-primary" />
                                            </div>
                                            <TextInput
                                                id="manufacturer"
                                                type="text"
                                                className="mt-1 block w-full pl-10"
                                                value={data.manufacturer}
                                                onChange={e => setData('manufacturer', e.target.value)}
                                            />
                                        </div>
                                        <InputError message={errors.manufacturer} className="text-error text-sm mt-1" />
                                    </div>

                                    <div className="form-control w-full">
                                        <InputLabel htmlFor="model_number" value="Model Number" className="label-text font-medium" />
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <FiFileText className="text-primary" />
                                            </div>
                                            <TextInput
                                                id="model_number"
                                                type="text"
                                                className="mt-1 block w-full pl-10"
                                                value={data.model_number}
                                                onChange={e => setData('model_number', e.target.value)}
                                            />
                                        </div>
                                        <InputError message={errors.model_number} className="text-error text-sm mt-1" />
                                    </div>

                                    <div className="form-control w-full">
                                        <InputLabel htmlFor="serial_number" value="Serial Number" className="label-text font-medium" />
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <FiHash className="text-primary" />
                                            </div>
                                            <TextInput
                                                id="serial_number"
                                                type="text"
                                                className="mt-1 block w-full pl-10"
                                                value={data.serial_number}
                                                onChange={e => setData('serial_number', e.target.value)}
                                            />
                                        </div>
                                        <InputError message={errors.serial_number} className="text-error text-sm mt-1" />
                                    </div>

                                    <div className="form-control w-full">
                                        <InputLabel htmlFor="power_source" value="Power Source" className="label-text font-medium" />
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <FiBatteryCharging className="text-primary" />
                                            </div>
                                            <SelectInput
                                                id="power_source"
                                                className="mt-1 block w-full pl-10"
                                                value={data.power_source}
                                                onChange={e => setData('power_source', e.target.value)}
                                            >
                                                <option value="">Select power source</option>
                                                <option value="electric">Electric</option>
                                                <option value="diesel">Diesel</option>
                                                <option value="petrol">Petrol</option>
                                                <option value="manual">Manual</option>
                                                <option value="hybrid">Hybrid</option>
                                                <option value="other">Other</option>
                                            </SelectInput>
                                        </div>
                                        <InputError message={errors.power_source} className="text-error text-sm mt-1" />
                                    </div>
                                </div>

                                <div className="divider">Specifications</div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-control w-full">
                                        <InputLabel htmlFor="capacity" value="Capacity" className="label-text font-medium" />
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <FiInfo className="text-primary" />
                                            </div>
                                            <TextInput
                                                id="capacity"
                                                type="number"
                                                step="0.01"
                                                className="mt-1 block w-full pl-10"
                                                value={data.capacity}
                                                onChange={e => setData('capacity', e.target.value)}
                                                placeholder="e.g., 500 (kg, liters, etc.)"
                                            />
                                        </div>
                                        <InputError message={errors.capacity} className="text-error text-sm mt-1" />
                                    </div>

                                    <div className="form-control w-full">
                                        <InputLabel htmlFor="weight" value="Weight (kg)" className="label-text font-medium" />
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <FiInfo className="text-primary" />
                                            </div>
                                            <TextInput
                                                id="weight"
                                                type="number"
                                                step="0.01"
                                                className="mt-1 block w-full pl-10"
                                                value={data.weight}
                                                onChange={e => setData('weight', e.target.value)}
                                            />
                                        </div>
                                        <InputError message={errors.weight} className="text-error text-sm mt-1" />
                                    </div>

                                    <div className="form-control w-full col-span-2">
                                        <InputLabel value="Dimensions" className="label-text font-medium" />
                                        <div className="grid grid-cols-4 gap-2">
                                            <div className="form-control">
                                                <InputLabel htmlFor="dimensions_length" value="Length" className="label-text text-sm" />
                                                <TextInput
                                                    id="dimensions_length"
                                                    type="number"
                                                    step="0.01"
                                                    className="mt-1 block w-full"
                                                    value={data.dimensions.length}
                                                    onChange={e => handleDimensionsChange(e, 'length')}
                                                />
                                            </div>
                                            <div className="form-control">
                                                <InputLabel htmlFor="dimensions_width" value="Width" className="label-text text-sm" />
                                                <TextInput
                                                    id="dimensions_width"
                                                    type="number"
                                                    step="0.01"
                                                    className="mt-1 block w-full"
                                                    value={data.dimensions.width}
                                                    onChange={e => handleDimensionsChange(e, 'width')}
                                                />
                                            </div>
                                            <div className="form-control">
                                                <InputLabel htmlFor="dimensions_height" value="Height" className="label-text text-sm" />
                                                <TextInput
                                                    id="dimensions_height"
                                                    type="number"
                                                    step="0.01"
                                                    className="mt-1 block w-full"
                                                    value={data.dimensions.height}
                                                    onChange={e => handleDimensionsChange(e, 'height')}
                                                />
                                            </div>
                                            <div className="form-control">
                                                <InputLabel htmlFor="dimensions_unit" value="Unit" className="label-text text-sm" />
                                                <SelectInput
                                                    id="dimensions_unit"
                                                    className="mt-1 block w-full"
                                                    value={data.dimensions.unit}
                                                    onChange={e => handleDimensionsChange(e, 'unit')}
                                                >
                                                    <option value="cm">Centimeters</option>
                                                    <option value="m">Meters</option>
                                                    <option value="in">Inches</option>
                                                    <option value="ft">Feet</option>
                                                </SelectInput>
                                            </div>
                                        </div>
                                        <InputError message={errors.dimensions} className="text-error text-sm mt-1" />
                                    </div>
                                </div>

                                <div className="divider">Maintenance</div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-control w-full col-span-2">
                                        <InputLabel value="Maintenance Schedule" className="label-text font-medium" />
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="form-control">
                                                <InputLabel htmlFor="maintenance_frequency" value="Frequency" className="label-text text-sm" />
                                                <TextInput
                                                    id="maintenance_frequency"
                                                    type="number"
                                                    className="mt-1 block w-full"
                                                    value={data.maintenance_schedule.frequency}
                                                    onChange={e => handleMaintenanceScheduleChange(e, 'frequency')}
                                                />
                                            </div>
                                            <div className="form-control">
                                                <InputLabel htmlFor="maintenance_unit" value="Unit" className="label-text text-sm" />
                                                <SelectInput
                                                    id="maintenance_unit"
                                                    className="mt-1 block w-full"
                                                    value={data.maintenance_schedule.unit}
                                                    onChange={e => handleMaintenanceScheduleChange(e, 'unit')}
                                                >
                                                    <option value="days">Days</option>
                                                    <option value="weeks">Weeks</option>
                                                    <option value="months">Months</option>
                                                    <option value="years">Years</option>
                                                </SelectInput>
                                            </div>
                                        </div>
                                        <InputError message={errors.maintenance_schedule} className="text-error text-sm mt-1" />
                                    </div>

                                    <div className="form-control w-full">
                                        <InputLabel htmlFor="last_maintenance_date" value="Last Maintenance Date" className="label-text font-medium" />
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <FiCalendar className="text-primary" />
                                            </div>
                                            <TextInput
                                                id="last_maintenance_date"
                                                type="date"
                                                className="mt-1 block w-full pl-10"
                                                value={data.last_maintenance_date}
                                                onChange={e => setData('last_maintenance_date', e.target.value)}
                                            />
                                        </div>
                                        <InputError message={errors.last_maintenance_date} className="text-error text-sm mt-1" />
                                    </div>

                                    <div className="form-control w-full">
                                        <InputLabel htmlFor="next_maintenance_date" value="Next Maintenance Date" className="label-text font-medium" />
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <FiCalendar className="text-primary" />
                                            </div>
                                            <TextInput
                                                id="next_maintenance_date"
                                                type="date"
                                                className="mt-1 block w-full pl-10"
                                                value={data.next_maintenance_date}
                                                onChange={e => setData('next_maintenance_date', e.target.value)}
                                            />
                                        </div>
                                        <InputError message={errors.next_maintenance_date} className="text-error text-sm mt-1" />
                                    </div>
                                </div>

                                <div className="form-control w-full">
                                    <InputLabel htmlFor="notes" value="Notes" className="label-text font-medium" />
                                    <textarea
                                        id="notes"
                                        className="textarea textarea-bordered w-full h-24"
                                        value={data.notes}
                                        onChange={e => setData('notes', e.target.value)}
                                    />
                                    <InputError message={errors.notes} className="text-error text-sm mt-1" />
                                </div>

                                <div className="form-control w-full">
                                    <InputLabel value="Equipment Photos" className="label-text font-medium mb-2" />
                                    <div className="grid grid-cols-2 gap-4">
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
                                            <InputLabel htmlFor="photo_side" value="Side View" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FiImage className="text-primary" />
                                                </div>
                                                <FileInput
                                                    id="photo_side"
                                                    name="photo_side"
                                                    className="mt-1 block w-full pl-10"
                                                    onChange={handlePhotoChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-control">
                                            <InputLabel htmlFor="photo_nameplate" value="Nameplate/Serial" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FiImage className="text-primary" />
                                                </div>
                                                <FileInput
                                                    id="photo_nameplate"
                                                    name="photo_nameplate"
                                                    className="mt-1 block w-full pl-10"
                                                    onChange={handlePhotoChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-control">
                                            <InputLabel htmlFor="photo_other" value="Other" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FiImage className="text-primary" />
                                                </div>
                                                <FileInput
                                                    id="photo_other"
                                                    name="photo_other"
                                                    className="mt-1 block w-full pl-10"
                                                    onChange={handlePhotoChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <InputError message={errors.photos} className="mt-2" />
                                </div>

                                <div className="divider"></div>
                                <div className="flex flex-col sm:flex-row gap-2 justify-end">
                                    <Link href={route('company.fleet.equipment.index')}>
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
                                        Add Equipment
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
