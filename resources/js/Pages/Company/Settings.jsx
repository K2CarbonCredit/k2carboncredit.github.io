import React, { useState } from 'react';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FiSettings, FiUsers, FiWifi, FiCreditCard, FiShield, FiCheck, FiX } from 'react-icons/fi';

export default function Settings({ auth, tab = null, providers = [], flash }) {
    // Get the current tab from the URL query parameter or use the provided tab prop
    const currentTab = tab || (new URLSearchParams(window.location.search).get('tab')) || 'general';
    
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-base-content leading-tight">
                        Company Settings
                    </h2>
                </div>
            }
        >
            <Head title="Company Settings" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Main Content */}
                    <div className="card bg-base-100 shadow-md w-full">
                        <div className="card-body">
                            {/* Tabs at the top */}
                            <div className="tabs tabs-boxed bg-base-200 mb-6">
                                <Link 
                                    href={route('company.settings')} 
                                    className={`tab ${currentTab === 'general' ? 'tab-active' : ''}`}
                                >
                                    <FiSettings className="mr-2" /> General
                                </Link>
                                <Link 
                                    href={route('company.settings') + '?tab=users'} 
                                    className={`tab ${currentTab === 'users' ? 'tab-active' : ''}`}
                                >
                                    <FiUsers className="mr-2" /> Users
                                </Link>
                                <Link 
                                    href={route('company.settings') + '?tab=integrations'} 
                                    className={`tab ${currentTab === 'integrations' ? 'tab-active' : ''}`}
                                >
                                    <FiWifi className="mr-2" /> Integrations
                                </Link>
                                <Link 
                                    href={route('company.settings') + '?tab=billing'} 
                                    className={`tab ${currentTab === 'billing' ? 'tab-active' : ''}`}
                                >
                                    <FiCreditCard className="mr-2" /> Billing
                                </Link>
                                <Link 
                                    href={route('company.settings') + '?tab=security'} 
                                    className={`tab ${currentTab === 'security' ? 'tab-active' : ''}`}
                                >
                                    <FiShield className="mr-2" /> Security
                                </Link>
                            </div>
                            
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
                            {currentTab === 'integrations' ? (
                                <IntegrationsTab providers={providers} />
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <FiSettings className="w-16 h-16 text-base-content/30 mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
                                    <p className="text-base-content/70 text-center max-w-md">
                                        This settings section is currently under development and will be available soon.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function IntegrationsTab({ providers = [] }) {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">Telemetry Integrations</h3>
            <p className="text-base-content/70 mb-6">
                Connect your company with telemetry providers to automatically collect and process data from your assets.
            </p>
            
            <div className="divider"></div>
            
            <div className="space-y-6">
                {providers.length > 0 ? (
                    <TelemetryIntegrations providers={providers} />
                ) : (
                    <div className="text-center py-8">
                        <div className="text-base-content/50 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.5 12.5a1 1 0 10-2 0 1 1 0 002 0zm7 0a1 1 0 10-2 0 1 1 0 002 0zm-7 7a1 1 0 10-2 0 1 1 0 002 0zm7 0a1 1 0 10-2 0 1 1 0 002 0zm-7-14a1 1 0 10-2 0 1 1 0 002 0zm7 0a1 1 0 10-2 0 1 1 0 002 0z" />
                            </svg>
                        </div>
                        <h4 className="text-lg font-medium mb-2">No Telemetry Providers Available</h4>
                        <p className="text-base-content/70 max-w-md mx-auto">
                            There are currently no telemetry providers configured. Please contact your administrator to set up telemetry integrations.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

function TelemetryIntegrations({ providers = [] }) {
    const [isToggling, setIsToggling] = useState(false);
    const { post } = useForm();
    
    const handleToggle = (provider) => {
        setIsToggling(true);
        
        const newStatus = provider.is_integrated && provider.status === 'active' ? 'inactive' : 'active';
        
        post(route('company.telemetry.toggle', provider.id), {
            status: newStatus,
            api_key: provider.api_key || '',
            settings: provider.settings || null,
        }, {
            onSuccess: () => {
                setIsToggling(false);
            },
            onError: () => {
                setIsToggling(false);
            }
        });
    };
    
    return (
        <div>
            <h4 className="font-medium mb-4">Available Telemetry Providers</h4>
            
            <div className="space-y-4">
                {providers.length === 0 ? (
                    <div className="alert alert-info">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span>No telemetry providers are currently available. Please contact your administrator.</span>
                    </div>
                ) : (
                    providers.map((provider) => (
                        <div key={provider.id} className="card bg-base-200">
                            <div className="card-body p-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-10 h-10 bg-base-300 flex items-center justify-center">
                                                {provider.logo ? (
                                                    <img src={provider.logo} alt={provider.name} />
                                                ) : (
                                                    <FiWifi className="text-primary" size={18} />
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <h5 className="font-semibold">{provider.name}</h5>
                                            <p className="text-sm text-base-content/70">{provider.description || 'No description available.'}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <div className="form-control">
                                            <label className="cursor-pointer label">
                                                <span className="label-text mr-2">Enable</span>
                                                <input 
                                                    type="checkbox" 
                                                    className="toggle toggle-primary" 
                                                    checked={provider.is_integrated && provider.status === 'active'}
                                                    onChange={() => handleToggle(provider)}
                                                    disabled={isToggling}
                                                />
                                            </label>
                                        </div>
                                        <Link 
                                            href={route('company.telemetry.configure', provider.id)} 
                                            className="btn btn-sm btn-outline"
                                        >
                                            Configure
                                        </Link>
                                    </div>
                                </div>
                                
                                {provider.is_integrated && (
                                    <div className="mt-2 pt-2 border-t border-base-300">
                                        <div className="text-xs text-base-content/70">
                                            {provider.status === 'active' ? (
                                                <span className="text-success flex items-center gap-1">
                                                    <FiCheck size={12} /> Connected since {new Date(provider.connected_at).toLocaleDateString()}
                                                </span>
                                            ) : (
                                                <span className="text-error flex items-center gap-1">
                                                    <FiX size={12} /> Integration disabled
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
