import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FiArrowLeft, FiSave, FiWifi, FiPlus, FiCheck, FiX, FiSettings, FiAlertCircle, FiInfo } from 'react-icons/fi';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import TextAreaInput from '@/Components/TextAreaInput';

export default function TelemetryConfiguration({ auth, providers = [], company, isImpersonating, flash }) {
    // State for provider configuration
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isValidJson, setIsValidJson] = useState(true);
    
    // Form for configuring a provider
    const { data, setData, post, processing, errors, reset } = useForm({
        status: 'active',
        api_key: '',
        settings: JSON.stringify({
            data_collection_interval: 60, // in minutes
            metrics: ['temperature', 'humidity', 'pressure'],
            alerts_enabled: true
        }, null, 2)
    });

    // Validate JSON settings
    const validateJsonSettings = (jsonString) => {
        try {
            JSON.parse(jsonString);
            setIsValidJson(true);
            return true;
        } catch (e) {
            setIsValidJson(false);
            return false;
        }
    };

    // Handle selecting a provider to configure
    const selectProvider = (provider) => {
        setSelectedProvider(provider);
        reset();
        setData({
            status: provider.is_integrated ? (provider.status || 'active') : 'active',
            api_key: provider.api_key || '',
            settings: provider.settings 
                ? JSON.stringify(JSON.parse(provider.settings), null, 2) 
                : JSON.stringify({
                    data_collection_interval: 60,
                    metrics: ['temperature', 'humidity', 'pressure'],
                    alerts_enabled: true
                }, null, 2)
        });
        setIsValidJson(true);
    };

    // Handle settings change with validation
    const handleSettingsChange = (e) => {
        const value = e.target.value;
        setData('settings', value);
        validateJsonSettings(value);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate JSON before submitting
        if (!validateJsonSettings(data.settings)) {
            return;
        }
        
        // Check if status is being changed to inactive
        if (selectedProvider.is_integrated && 
            selectedProvider.status === 'active' && 
            data.status === 'inactive') {
            setShowConfirmation(true);
            return;
        }
        
        submitForm();
    };
    
    // Submit the form after confirmation
    const submitForm = () => {
        post(route('company.telemetry.save-configuration', selectedProvider.id), {
            onSuccess: () => {
                setSelectedProvider(null);
                setShowConfirmation(false);
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="font-bold text-2xl text-base-content leading-tight">
                            {selectedProvider ? `Configure ${selectedProvider.name}` : 'Telemetry Integrations'}
                        </h2>
                        <p className="text-base-content/70 mt-1">
                            {selectedProvider ? 'Configure your integration settings' : 'Manage your telemetry data collection integrations'}
                        </p>
                    </div>
                    {selectedProvider && (
                        <button 
                            type="button" 
                            className="btn btn-outline btn-sm gap-2"
                            onClick={() => setSelectedProvider(null)}
                        >
                            <FiArrowLeft className="w-4 h-4" /> Back to Integrations
                        </button>
                    )}
                </div>
            }
        >
            <Head title={selectedProvider ? `Configure ${selectedProvider.name}` : 'Telemetry Integrations'} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Impersonation Status */}
                    {isImpersonating && (
                        <div className="alert alert-warning mb-6">
                            <FiAlertCircle className="flex-shrink-0 w-6 h-6" />
                            <div>
                                <h3 className="font-bold">Admin Impersonation Mode</h3>
                                <div className="text-sm">You are currently viewing and managing telemetry integrations for {company?.name}.</div>
                            </div>
                        </div>
                    )}
                    {/* Flash Messages */}
                    {flash && flash.error && (
                        <div className="alert alert-error mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{flash.error}</span>
                        </div>
                    )}
                    
                    {flash && flash.success && (
                        <div className="alert alert-success mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{flash.success}</span>
                        </div>
                    )}

                    {/* Provider List View */}
                    {!selectedProvider && (
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h3 className="card-title text-xl font-bold mb-2">Available Telemetry Providers</h3>
                                <div className="alert alert-info mb-6">
                                    <FiInfo className="flex-shrink-0 w-6 h-6" />
                                    <span>Connect your company to these telemetry providers to collect and analyze data from your systems.</span>
                                </div>

                                {providers.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-8 text-center">
                                        <div className="bg-base-200 rounded-full p-6 mb-4">
                                            <FiWifi className="w-16 h-16 text-base-content/50" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">No Telemetry Providers Available</h3>
                                        <p className="text-base-content/70 max-w-md mb-6">
                                            There are currently no telemetry providers configured for your company. 
                                            Please check back later or contact your administrator.
                                        </p>
                                        {auth.user.hasRole('super_admin') && (
                                            <Link href={route('admin.telemetry-providers.index')} className="btn btn-primary">
                                                <FiPlus className="w-4 h-4 mr-2" /> Add Telemetry Providers
                                            </Link>
                                        )}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {providers.map((provider) => (
                                            <div key={provider.id} className="card bg-base-200 hover:shadow-xl transition-all duration-300 border border-base-300">
                                                <div className="card-body p-5">
                                                    <div className="flex items-center gap-4 mb-3">
                                                        <div className="avatar">
                                                            <div className="w-14 h-14 rounded-lg bg-base-300 flex items-center justify-center shadow-inner">
                                                                {provider.logo ? (
                                                                    <img src={provider.logo} alt={provider.name} className="object-contain" />
                                                                ) : (
                                                                    <FiWifi className="text-primary" size={28} />
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-lg">{provider.name}</h4>
                                                            <div className="badge badge-lg mt-1 gap-1 font-medium" 
                                                                 data-theme={provider.is_integrated ? "light" : ""}
                                                                 style={{ 
                                                                    backgroundColor: provider.is_integrated ? '#e6f7e6' : '#f5f5f5',
                                                                    color: provider.is_integrated ? '#2e7d32' : '#666666'
                                                                 }}>
                                                                {provider.is_integrated ? (
                                                                    <>
                                                                        <FiCheck className="mr-1" /> Connected
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <FiX className="mr-1" /> Not Connected
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="divider my-2"></div>
                                                    
                                                    <p className="text-sm text-base-content/80 mb-4 line-clamp-3">{provider.description}</p>
                                                    
                                                    {provider.is_integrated && provider.connected_at && (
                                                        <div className="text-xs text-base-content/60 mb-3">
                                                            Connected since: {new Date(provider.connected_at).toLocaleDateString()}
                                                        </div>
                                                    )}
                                                    
                                                    <div className="card-actions justify-end mt-auto pt-2">
                                                        <button 
                                                            type="button" 
                                                            className={`btn ${provider.is_integrated ? 'btn-secondary' : 'btn-primary'} btn-sm gap-1`}
                                                            onClick={() => selectProvider(provider)}
                                                        >
                                                            {provider.is_integrated ? (
                                                                <>
                                                                    <FiSettings className="w-4 h-4" /> Configure
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <FiPlus className="w-4 h-4" /> Connect
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Provider Configuration View */}
                    {selectedProvider && (
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
                                    <div className="avatar">
                                        <div className="w-20 h-20 rounded-lg bg-base-300 flex items-center justify-center shadow-inner">
                                            {selectedProvider.logo ? (
                                                <img src={selectedProvider.logo} alt={selectedProvider.name} className="object-contain" />
                                            ) : (
                                                <FiWifi className="text-primary" size={40} />
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold card-title">{selectedProvider.name}</h3>
                                        <div className="badge badge-accent badge-outline mt-1 mb-2">{selectedProvider.type || 'Integration'}</div>
                                        <p className="text-base-content/70">{selectedProvider.description}</p>
                                    </div>
                                </div>

                                <div className="divider"></div>

                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-8">
                                        <div className="form-control w-full">
                                            <div className="flex justify-between items-center">
                                                <InputLabel htmlFor="status" value="Integration Status" className="text-base font-medium" />
                                                <div className="badge badge-neutral">{selectedProvider.is_integrated ? 'Currently Active' : 'Not Connected'}</div>
                                            </div>
                                            <select
                                                id="status"
                                                name="status"
                                                value={data.status || 'active'}
                                                onChange={(e) => setData('status', e.target.value)}
                                                className="select select-bordered w-full max-w-xs mt-2"
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                            <div className="label">
                                                <span className="label-text-alt">Set to inactive to temporarily disable this integration</span>
                                            </div>
                                            <InputError message={errors.status} className="text-error text-sm" />
                                        </div>

                                        <div className="form-control w-full">
                                            <InputLabel htmlFor="api_key" value="API Key" className="text-base font-medium" />
                                            <div className="join w-full mt-2">
                                                <TextInput
                                                    id="api_key"
                                                    type="text"
                                                    name="api_key"
                                                    value={data.api_key}
                                                    className="input input-bordered join-item w-full font-mono"
                                                    onChange={(e) => setData('api_key', e.target.value)}
                                                    placeholder="Enter your API key for this provider"
                                                />
                                            </div>
                                            <div className="label">
                                                <span className="label-text-alt">This API key will be used to authenticate with the telemetry provider's services</span>
                                            </div>
                                            <InputError message={errors.api_key} className="text-error text-sm" />
                                        </div>

                                        <div className="form-control w-full">
                                            <InputLabel htmlFor="settings" value="Integration Settings (JSON)" className="text-base font-medium" />
                                            <div className="relative">
                                                <TextAreaInput
                                                    id="settings"
                                                    name="settings"
                                                    value={data.settings}
                                                    className={`textarea textarea-bordered w-full font-mono text-sm mt-2 h-48 ${!isValidJson ? 'textarea-error' : ''}`}
                                                    onChange={handleSettingsChange}
                                                    placeholder='{"data_collection_interval": 60, "metrics": ["temperature", "humidity"], "alerts_enabled": true}'
                                                />
                                                <div className="absolute top-4 right-4">
                                                    {isValidJson ? (
                                                        <div className="badge badge-success gap-1">
                                                            <FiCheck className="w-3 h-3" /> Valid JSON
                                                        </div>
                                                    ) : (
                                                        <div className="badge badge-error gap-1">
                                                            <FiX className="w-3 h-3" /> Invalid JSON
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="label">
                                                <span className="label-text-alt">Configure the settings for this telemetry integration in JSON format</span>
                                            </div>
                                            {!isValidJson && (
                                                <div className="text-error text-sm mb-2">Please enter valid JSON format</div>
                                            )}
                                            <InputError message={errors.settings} className="text-error text-sm" />
                                        </div>

                                        <div className="alert alert-info bg-info/10 border border-info/30">
                                            <FiInfo className="w-6 h-6 text-info" />
                                            <div>
                                                <h3 className="font-bold">Configuration Note</h3>
                                                <div className="text-sm">After saving, you may need to configure your devices to send data to this telemetry provider using the API key above.</div>
                                            </div>
                                        </div>

                                        <div className="divider"></div>

                                        <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
                                            <Link
                                                href={route('company.telemetry.index')}
                                                className="btn btn-outline w-full sm:w-auto"
                                            >
                                                Cancel
                                            </Link>

                                            <button
                                                type="submit"
                                                className="btn btn-primary w-full sm:w-auto gap-2"
                                                disabled={processing}
                                            >
                                                <FiSave className="w-4 h-4" /> Save Configuration
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                    
                    {/* Confirmation Modal */}
                    {showConfirmation && (
                        <div className="modal modal-open">
                            <div className="modal-box">
                                <h3 className="font-bold text-lg">Deactivate Integration?</h3>
                                <p className="py-4">
                                    Are you sure you want to deactivate the integration with {selectedProvider?.name}? 
                                    This will temporarily stop data collection from this provider.
                                </p>
                                <div className="modal-action">
                                    <button 
                                        className="btn btn-outline" 
                                        onClick={() => setShowConfirmation(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        className="btn btn-error" 
                                        onClick={submitForm}
                                    >
                                        Deactivate
                                    </button>
                                </div>
                            </div>
                            <div className="modal-backdrop" onClick={() => setShowConfirmation(false)}></div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
