import { useState, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import SelectInput from '@/Components/SelectInput';
import FileInput from '@/Components/FileInput';
import { FiArrowLeft, FiTool, FiTag, FiList, FiImage, FiFileText, FiType, FiBatteryCharging, FiHash, FiCalendar, FiInfo } from 'react-icons/fi';

export default function Edit({ equipment, assetTypes, manufacturers }) {
    const { data, setData, put, processing, errors, setError } = useForm({
        name: equipment.name || '',
        asset_type_id: equipment.asset_type_id || '',
        asset_sub_type_id: equipment.asset_sub_type_id || '',
        model_number: equipment.model_number || '',
        serial_number: equipment.serial_number || '',
        manufacturer_id: equipment.manufacturer_id || '',
        power_source: equipment.power_source || '',
        capacity: equipment.capacity || '',
        weight: equipment.weight || '',
        dimensions: equipment.dimensions || {
            length: '',
            width: '',
            height: '',
            unit: 'cm'
        },
        maintenance_schedule: equipment.maintenance_schedule || {
            frequency: '',
            unit: 'months'
        },
        last_maintenance_date: equipment.last_maintenance_date || '',
        next_maintenance_date: equipment.next_maintenance_date || '',
        photos: {},
        notes: equipment.notes || '',
        status: equipment.status || 'active',
    });

    const [assetSubtypes, setAssetSubtypes] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [existingPhotos, setExistingPhotos] = useState(equipment.photos || {});
    const [photoChanged, setPhotoChanged] = useState({});

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
            
            // Mark this photo type as changed
            setPhotoChanged({
                ...photoChanged,
                [type]: true
            });
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
        
        // Check if we have at least one photo (either existing or new)
        const hasExistingPhotos = Object.keys(existingPhotos).length > 0;
        const hasNewPhotos = Object.keys(data.photos).length > 0;
        
        if (!hasExistingPhotos && !hasNewPhotos) {
            setError('photos', 'At least one photo is required');
            setIsSubmitting(false);
            return;
        }
        
        // Determine if we need to use FormData (for file uploads)
        const hasFiles = Object.keys(data.photos).length > 0;
        
        if (hasFiles) {
            // Use FormData for file uploads
            const formData = new FormData();
            
            // Add all form fields to FormData
            Object.keys(data).forEach(key => {
                if (key === 'photos') {
                    // Handle photos separately
                    Object.keys(data.photos).forEach(photoType => {
                        formData.append(`photos[${photoType}]`, data.photos[photoType]);
                    });
                } else if (key === 'dimensions' || key === 'maintenance_schedule') {
                    // Handle nested objects
                    formData.append(key, JSON.stringify(data[key]));
                } else {
                    formData.append(key, data[key]);
                }
            });
            
            // Add _method field for PUT request
            formData.append('_method', 'PUT');
            
            // Submit the form
            put(route('company.fleet.equipment.update', equipment.id), formData, {
                onSuccess: () => {
                    setIsSubmitting(false);
                },
                onError: () => {
                    setIsSubmitting(false);
                }
            });
        } else {
            // Use regular JSON for non-file submissions
            put(route('company.fleet.equipment.update', equipment.id), {
                ...data,
                _method: 'PUT'
            }, {
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
                    <h2 className="font-semibold text-xl text-base-content leading-tight">Edit Equipment</h2>
                </div>
            }
        >
            <Head title="Edit Equipment" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link href={route('company.fleet.equipment.index')} className="btn btn-outline btn-sm">
                            <FiArrowLeft className="mr-2" /> Back to Equipment
                        </Link>
                    </div>
                    
                    <div className="bg-base-100 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="form-control">
                                            <InputLabel htmlFor="name" value="Equipment Name *" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FiTool className="text-primary" />
                                                </div>
                                                <TextInput
                                                    id="name"
                                                    type="text"
                                                    name="name"
                                                    value={data.name}
                                                    className="mt-1 block w-full pl-10"
                                                    autoComplete="name"
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
                                                    <option value="maintenance">Maintenance</option>
                                                    <option value="retired">Retired</option>
                                                </SelectInput>
                                            </div>
                                            <InputError message={errors.status} className="mt-2" />
                                        </div>
                                        
                                        <div className="form-control">
                                            <InputLabel htmlFor="asset_type_id" value="Asset Type *" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FiList className="text-primary" />
                                                </div>
                                                <SelectInput
                                                    id="asset_type_id"
                                                    name="asset_type_id"
                                                    value={data.asset_type_id}
                                                    className="mt-1 block w-full pl-10"
                                                    onChange={(e) => setData('asset_type_id', e.target.value)}
                                                    required
                                                >
                                                    <option value="">Select Asset Type</option>
                                                    {assetTypes.map((type) => (
                                                        <option key={type.id} value={type.id}>{type.name}</option>
                                                    ))}
                                                </SelectInput>
                                            </div>
                                            <InputError message={errors.asset_type_id} className="mt-2" />
                                        </div>
                                        
                                        <div className="form-control">
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
                                                    required
                                                    disabled={!data.asset_type_id}
                                                >
                                                    <option value="">Select Asset Subtype</option>
                                                    {assetSubtypes.map((subtype) => (
                                                        <option key={subtype.id} value={subtype.id}>{subtype.name}</option>
                                                    ))}
                                                </SelectInput>
                                            </div>
                                            <InputError message={errors.asset_sub_type_id} className="mt-2" />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="divider"></div>
                                
                                <div>
                                    <h3 className="text-lg font-medium mb-4">Equipment Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="form-control">
                                            <InputLabel htmlFor="model_number" value="Model Number" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FiHash className="text-primary" />
                                                </div>
                                                <TextInput
                                                    id="model_number"
                                                    type="text"
                                                    name="model_number"
                                                    value={data.model_number}
                                                    className="mt-1 block w-full pl-10"
                                                    onChange={(e) => setData('model_number', e.target.value)}
                                                />
                                            </div>
                                            <InputError message={errors.model_number} className="mt-2" />
                                        </div>
                                        
                                        <div className="form-control">
                                            <InputLabel htmlFor="serial_number" value="Serial Number" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FiHash className="text-primary" />
                                                </div>
                                                <TextInput
                                                    id="serial_number"
                                                    type="text"
                                                    name="serial_number"
                                                    value={data.serial_number}
                                                    className="mt-1 block w-full pl-10"
                                                    onChange={(e) => setData('serial_number', e.target.value)}
                                                />
                                            </div>
                                            <InputError message={errors.serial_number} className="mt-2" />
                                        </div>
                                        
                                        <div className="form-control">
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
                                        
                                        <div className="form-control">
                                            <InputLabel htmlFor="power_source" value="Power Source" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FiBatteryCharging className="text-primary" />
                                                </div>
                                                <SelectInput
                                                    id="power_source"
                                                    name="power_source"
                                                    value={data.power_source}
                                                    className="mt-1 block w-full pl-10"
                                                    onChange={(e) => setData('power_source', e.target.value)}
                                                >
                                                    <option value="">Select Power Source</option>
                                                    <option value="electric">Electric</option>
                                                    <option value="diesel">Diesel</option>
                                                    <option value="gasoline">Gasoline</option>
                                                    <option value="propane">Propane</option>
                                                    <option value="natural_gas">Natural Gas</option>
                                                    <option value="manual">Manual</option>
                                                    <option value="hybrid">Hybrid</option>
                                                    <option value="other">Other</option>
                                                </SelectInput>
                                            </div>
                                            <InputError message={errors.power_source} className="mt-2" />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="divider"></div>
                                
                                <div>
                                    <h3 className="text-lg font-medium mb-4">Specifications</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="form-control">
                                            <InputLabel htmlFor="capacity" value="Capacity" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FiInfo className="text-primary" />
                                                </div>
                                                <TextInput
                                                    id="capacity"
                                                    type="number"
                                                    step="0.01"
                                                    name="capacity"
                                                    value={data.capacity}
                                                    className="mt-1 block w-full pl-10"
                                                    onChange={(e) => setData('capacity', e.target.value)}
                                                />
                                            </div>
                                            <InputError message={errors.capacity} className="mt-2" />
                                        </div>
                                        
                                        <div className="form-control">
                                            <InputLabel htmlFor="weight" value="Weight (kg)" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FiInfo className="text-primary" />
                                                </div>
                                                <TextInput
                                                    id="weight"
                                                    type="number"
                                                    step="0.01"
                                                    name="weight"
                                                    value={data.weight}
                                                    className="mt-1 block w-full pl-10"
                                                    onChange={(e) => setData('weight', e.target.value)}
                                                />
                                            </div>
                                            <InputError message={errors.weight} className="mt-2" />
                                        </div>
                                        
                                        <div className="form-control col-span-1 md:col-span-2">
                                            <InputLabel value="Dimensions" />
                                            <div className="grid grid-cols-4 gap-2 mt-1">
                                                <div className="col-span-1">
                                                    <TextInput
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="Length"
                                                        value={data.dimensions.length}
                                                        onChange={(e) => handleDimensionsChange(e, 'length')}
                                                    />
                                                </div>
                                                <div className="col-span-1">
                                                    <TextInput
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="Width"
                                                        value={data.dimensions.width}
                                                        onChange={(e) => handleDimensionsChange(e, 'width')}
                                                    />
                                                </div>
                                                <div className="col-span-1">
                                                    <TextInput
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="Height"
                                                        value={data.dimensions.height}
                                                        onChange={(e) => handleDimensionsChange(e, 'height')}
                                                    />
                                                </div>
                                                <div className="col-span-1">
                                                    <SelectInput
                                                        value={data.dimensions.unit}
                                                        onChange={(e) => handleDimensionsChange(e, 'unit')}
                                                    >
                                                        <option value="cm">cm</option>
                                                        <option value="m">m</option>
                                                        <option value="in">in</option>
                                                        <option value="ft">ft</option>
                                                    </SelectInput>
                                                </div>
                                            </div>
                                            <InputError message={errors.dimensions} className="mt-2" />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="divider"></div>
                                
                                <div>
                                    <h3 className="text-lg font-medium mb-4">Maintenance Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="form-control">
                                            <InputLabel value="Maintenance Schedule" />
                                            <div className="grid grid-cols-2 gap-2 mt-1">
                                                <div className="col-span-1">
                                                    <TextInput
                                                        type="number"
                                                        placeholder="Frequency"
                                                        value={data.maintenance_schedule.frequency}
                                                        onChange={(e) => handleMaintenanceScheduleChange(e, 'frequency')}
                                                    />
                                                </div>
                                                <div className="col-span-1">
                                                    <SelectInput
                                                        value={data.maintenance_schedule.unit}
                                                        onChange={(e) => handleMaintenanceScheduleChange(e, 'unit')}
                                                    >
                                                        <option value="days">Days</option>
                                                        <option value="weeks">Weeks</option>
                                                        <option value="months">Months</option>
                                                        <option value="years">Years</option>
                                                    </SelectInput>
                                                </div>
                                            </div>
                                            <InputError message={errors.maintenance_schedule} className="mt-2" />
                                        </div>
                                        
                                        <div className="form-control">
                                            <InputLabel htmlFor="last_maintenance_date" value="Last Maintenance Date" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FiCalendar className="text-primary" />
                                                </div>
                                                <TextInput
                                                    id="last_maintenance_date"
                                                    type="date"
                                                    name="last_maintenance_date"
                                                    value={data.last_maintenance_date}
                                                    className="mt-1 block w-full pl-10"
                                                    onChange={(e) => setData('last_maintenance_date', e.target.value)}
                                                />
                                            </div>
                                            <InputError message={errors.last_maintenance_date} className="mt-2" />
                                        </div>
                                        
                                        <div className="form-control">
                                            <InputLabel htmlFor="next_maintenance_date" value="Next Maintenance Date" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FiCalendar className="text-primary" />
                                                </div>
                                                <TextInput
                                                    id="next_maintenance_date"
                                                    type="date"
                                                    name="next_maintenance_date"
                                                    value={data.next_maintenance_date}
                                                    className="mt-1 block w-full pl-10"
                                                    onChange={(e) => setData('next_maintenance_date', e.target.value)}
                                                />
                                            </div>
                                            <InputError message={errors.next_maintenance_date} className="mt-2" />
                                        </div>
                                        
                                        <div className="form-control">
                                            <InputLabel htmlFor="notes" value="Maintenance Notes" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FiFileText className="text-primary" />
                                                </div>
                                                <TextInput
                                                    id="notes"
                                                    type="text"
                                                    name="notes"
                                                    value={data.notes}
                                                    className="mt-1 block w-full pl-10"
                                                    onChange={(e) => setData('notes', e.target.value)}
                                                />
                                            </div>
                                            <InputError message={errors.notes} className="mt-2" />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="divider"></div>
                                
                                <div>
                                    <h3 className="text-lg font-medium mb-4">Photos</h3>
                                    <p className="text-sm text-base-content/70 mb-4">
                                        Upload photos of the equipment. At least one photo is required.
                                    </p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="form-control">
                                            <InputLabel htmlFor="photo_front" value="Front View" />
                                            {existingPhotos.front && !photoChanged.front && (
                                                <div className="mb-2">
                                                    <img 
                                                        src={`/storage/${existingPhotos.front}`} 
                                                        alt="Front view" 
                                                        className="w-32 h-32 object-cover rounded-lg border border-base-300" 
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
                                            <InputLabel htmlFor="photo_side" value="Side View" />
                                            {existingPhotos.side && !photoChanged.side && (
                                                <div className="mb-2">
                                                    <img 
                                                        src={`/storage/${existingPhotos.side}`} 
                                                        alt="Side view" 
                                                        className="w-32 h-32 object-cover rounded-lg border border-base-300" 
                                                    />
                                                </div>
                                            )}
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
                                            {existingPhotos.nameplate && !photoChanged.nameplate && (
                                                <div className="mb-2">
                                                    <img 
                                                        src={`/storage/${existingPhotos.nameplate}`} 
                                                        alt="Nameplate view" 
                                                        className="w-32 h-32 object-cover rounded-lg border border-base-300" 
                                                    />
                                                </div>
                                            )}
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
                                            {existingPhotos.other && !photoChanged.other && (
                                                <div className="mb-2">
                                                    <img 
                                                        src={`/storage/${existingPhotos.other}`} 
                                                        alt="Other view" 
                                                        className="w-32 h-32 object-cover rounded-lg border border-base-300" 
                                                    />
                                                </div>
                                            )}
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
                                        Update Equipment
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
