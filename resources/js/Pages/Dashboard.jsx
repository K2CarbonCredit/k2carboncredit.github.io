import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight">
                        Company Dashboard
                    </h2>
                    <div className="flex space-x-2">
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-sm btn-outline">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Last 30 Days
                            </div>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                <li><a>Today</a></li>
                                <li><a>Last 7 Days</a></li>
                                <li><a>Last 30 Days</a></li>
                                <li><a>This Month</a></li>
                                <li><a>This Quarter</a></li>
                                <li><a>This Year</a></li>
                            </ul>
                        </div>
                        <button className="btn btn-sm btn-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            New Report
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Company Dashboard" />

            <div className="p-4 md:p-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="card bg-base-100 shadow-md">
                        <div className="card-body p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="card-title text-lg">Total Emissions</h3>
                                    <p className="text-3xl font-bold mt-2">1,245 <span className="text-sm font-normal">tCO₂e</span></p>
                                    <p className="text-sm text-success mt-1">↓ 12% from last month</p>
                                </div>
                                <div className="bg-primary/10 p-3 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-md">
                        <div className="card-body p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="card-title text-lg">Carbon Offsets</h3>
                                    <p className="text-3xl font-bold mt-2">845 <span className="text-sm font-normal">tCO₂e</span></p>
                                    <p className="text-sm text-success mt-1">↑ 8% from last month</p>
                                </div>
                                <div className="bg-success/10 p-3 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-md">
                        <div className="card-body p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="card-title text-lg">Net Emissions</h3>
                                    <p className="text-3xl font-bold mt-2">400 <span className="text-sm font-normal">tCO₂e</span></p>
                                    <p className="text-sm text-error mt-1">↑ 5% from last month</p>
                                </div>
                                <div className="bg-warning/10 p-3 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-md">
                        <div className="card-body p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="card-title text-lg">Projects</h3>
                                    <p className="text-3xl font-bold mt-2">12 <span className="text-sm font-normal">active</span></p>
                                    <p className="text-sm text-info mt-1">3 pending approval</p>
                                </div>
                                <div className="bg-info/10 p-3 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Emissions Trend Chart */}
                    <div className="lg:col-span-2 card bg-base-100 shadow-md">
                        <div className="card-body">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="card-title">Emissions Trend</h3>
                                <div className="flex space-x-2">
                                    <button className="btn btn-xs btn-ghost">Monthly</button>
                                    <button className="btn btn-xs btn-ghost">Quarterly</button>
                                    <button className="btn btn-xs btn-primary">Yearly</button>
                                </div>
                            </div>
                            <div className="h-64 w-full bg-base-200 rounded-lg flex items-center justify-center">
                                <p className="text-base-content/50">Emissions Chart Placeholder</p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="card bg-base-100 shadow-md">
                        <div className="card-body">
                            <h3 className="card-title mb-4">Recent Activity</h3>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <div className="bg-primary/10 p-2 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium">New offset project approved</p>
                                        <p className="text-sm text-base-content/70">Solar Farm Initiative - 250 tCO₂e</p>
                                        <p className="text-xs text-base-content/50 mt-1">2 hours ago</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <div className="bg-warning/10 p-2 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium">Emissions threshold exceeded</p>
                                        <p className="text-sm text-base-content/70">Manufacturing Plant B - 15% above target</p>
                                        <p className="text-xs text-base-content/50 mt-1">Yesterday</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <div className="bg-info/10 p-2 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium">Quarterly report generated</p>
                                        <p className="text-sm text-base-content/70">Q1 2025 Emissions Summary</p>
                                        <p className="text-xs text-base-content/50 mt-1">2 days ago</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <div className="bg-success/10 p-2 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium">Reduction target achieved</p>
                                        <p className="text-sm text-base-content/70">Office Operations - 20% reduction</p>
                                        <p className="text-xs text-base-content/50 mt-1">1 week ago</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-actions justify-center mt-4">
                                <button className="btn btn-sm btn-ghost">View All Activity</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
