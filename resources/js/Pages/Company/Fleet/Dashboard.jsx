import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FiTruck, FiTool, FiPlusCircle, FiBarChart2, FiFileText, FiAlertTriangle } from 'react-icons/fi';

export default function Dashboard({ vehicleStats, equipmentStats }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-base-content leading-tight">Fleet Management</h2>
                </div>
            }
        >
            <Head title="Fleet Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Fleet Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <div className="flex justify-between items-center">
                                    <h3 className="card-title">Total Vehicles</h3>
                                    <FiTruck className="text-primary text-2xl" />
                                </div>
                                <p className="text-3xl font-bold">{vehicleStats?.total || 0}</p>
                                <div className="text-sm text-base-content/70">
                                    <span className="badge badge-success mr-1">{vehicleStats?.active || 0} Active</span>
                                    <span className="badge badge-error">{vehicleStats?.inactive || 0} Inactive</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <div className="flex justify-between items-center">
                                    <h3 className="card-title">Total Equipment</h3>
                                    <FiTool className="text-primary text-2xl" />
                                </div>
                                <p className="text-3xl font-bold">{equipmentStats?.total || 0}</p>
                                <div className="text-sm text-base-content/70">
                                    <span className="badge badge-success mr-1">{equipmentStats?.active || 0} Active</span>
                                    <span className="badge badge-warning mr-1">{equipmentStats?.maintenance || 0} Maintenance</span>
                                    <span className="badge badge-error">{equipmentStats?.inactive || 0} Inactive</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <div className="flex justify-between items-center">
                                    <h3 className="card-title">Maintenance Due</h3>
                                    <FiAlertTriangle className="text-warning text-2xl" />
                                </div>
                                <p className="text-3xl font-bold">{equipmentStats?.maintenanceDue || 0}</p>
                                <div className="text-sm text-base-content/70">
                                    Equipment requiring maintenance
                                </div>
                            </div>
                        </div>
                        
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <div className="flex justify-between items-center">
                                    <h3 className="card-title">Onboarding</h3>
                                    <FiFileText className="text-primary text-2xl" />
                                </div>
                                <p className="text-3xl font-bold">{(vehicleStats?.onboarding || 0) + (equipmentStats?.onboarding || 0)}</p>
                                <div className="text-sm text-base-content/70">
                                    Assets in onboarding process
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Fleet Management Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <div className="flex items-center mb-4">
                                    <FiTruck className="text-primary text-3xl mr-3" />
                                    <h2 className="card-title">Vehicle Fleet</h2>
                                </div>
                                <p className="text-base-content/70 mb-6">
                                    Manage your vehicle fleet including cars, trucks, and other motor vehicles.
                                </p>
                                <div className="card-actions justify-between">
                                    <Link href={route('company.fleet.vehicles.index')}>
                                        <button className="btn btn-outline">
                                            View All Vehicles
                                        </button>
                                    </Link>
                                    <Link href={route('company.fleet.vehicles.create')}>
                                        <button className="btn btn-primary">
                                            <FiPlusCircle className="mr-2" /> Add Vehicle
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <div className="flex items-center mb-4">
                                    <FiTool className="text-primary text-3xl mr-3" />
                                    <h2 className="card-title">Equipment Fleet</h2>
                                </div>
                                <p className="text-base-content/70 mb-6">
                                    Manage your equipment fleet including machinery, tools, and other non-vehicle assets.
                                </p>
                                <div className="card-actions justify-between">
                                    <Link href={route('company.fleet.equipment.index')}>
                                        <button className="btn btn-outline">
                                            View All Equipment
                                        </button>
                                    </Link>
                                    <Link href={route('company.fleet.equipment.create')}>
                                        <button className="btn btn-primary">
                                            <FiPlusCircle className="mr-2" /> Add Equipment
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Fleet Reports */}
                    <div className="mt-8">
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <div className="flex items-center mb-4">
                                    <FiBarChart2 className="text-primary text-3xl mr-3" />
                                    <h2 className="card-title">Fleet Reports</h2>
                                </div>
                                <p className="text-base-content/70 mb-6">
                                    Access detailed reports and analytics for your entire fleet.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Link href="#">
                                        <button className="btn btn-outline w-full">
                                            Asset Utilization
                                        </button>
                                    </Link>
                                    <Link href="#">
                                        <button className="btn btn-outline w-full">
                                            Maintenance History
                                        </button>
                                    </Link>
                                    <Link href="#">
                                        <button className="btn btn-outline w-full">
                                            Carbon Emissions
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
