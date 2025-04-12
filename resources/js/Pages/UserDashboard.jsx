import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function UserDashboard() {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight">
                        My Dashboard
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
                            New Goal
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="My Dashboard" />

            <div className="p-4 md:p-6">
                {/* Personal Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="card bg-base-100 shadow-md">
                        <div className="card-body p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="card-title text-lg">My Emissions</h3>
                                    <p className="text-3xl font-bold mt-2">78 <span className="text-sm font-normal">tCO₂e</span></p>
                                    <p className="text-sm text-success mt-1">↓ 5% from last month</p>
                                </div>
                                <div className="bg-primary/10 p-3 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-md">
                        <div className="card-body p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="card-title text-lg">Team Ranking</h3>
                                    <p className="text-3xl font-bold mt-2">3<span className="text-sm font-normal">/12</span></p>
                                    <p className="text-sm text-success mt-1">↑ 2 positions this month</p>
                                </div>
                                <div className="bg-success/10 p-3 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-md">
                        <div className="card-body p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="card-title text-lg">Goals Completed</h3>
                                    <p className="text-3xl font-bold mt-2">5 <span className="text-sm font-normal">/ 8</span></p>
                                    <p className="text-sm text-info mt-1">2 in progress</p>
                                </div>
                                <div className="bg-info/10 p-3 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-md">
                        <div className="card-body p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="card-title text-lg">Carbon Points</h3>
                                    <p className="text-3xl font-bold mt-2">1,250</p>
                                    <p className="text-sm text-warning mt-1">750 until next reward</p>
                                </div>
                                <div className="bg-warning/10 p-3 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Personal Emissions Chart */}
                    <div className="lg:col-span-2 card bg-base-100 shadow-md">
                        <div className="card-body">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="card-title">My Emissions Breakdown</h3>
                                <div className="flex space-x-2">
                                    <button className="btn btn-xs btn-ghost">Travel</button>
                                    <button className="btn btn-xs btn-ghost">Office</button>
                                    <button className="btn btn-xs btn-primary">All</button>
                                </div>
                            </div>
                            <div className="h-64 w-full bg-base-200 rounded-lg flex items-center justify-center">
                                <p className="text-base-content/50">Personal Emissions Chart Placeholder</p>
                            </div>
                        </div>
                    </div>

                    {/* Goals & Challenges */}
                    <div className="card bg-base-100 shadow-md">
                        <div className="card-body">
                            <h3 className="card-title mb-4">My Goals</h3>
                            <div className="space-y-4">
                                <div className="bg-base-200 rounded-lg p-3">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-medium">Reduce commute emissions</h4>
                                        <span className="badge badge-success">In Progress</span>
                                    </div>
                                    <p className="text-sm text-base-content/70">Use public transport 3 days/week</p>
                                    <div className="w-full bg-base-300 rounded-full h-2.5 mt-2">
                                        <div className="bg-success h-2.5 rounded-full" style={{ width: '70%' }}></div>
                                    </div>
                                    <p className="text-xs text-base-content/50 mt-1">70% complete</p>
                                </div>

                                <div className="bg-base-200 rounded-lg p-3">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-medium">Paperless workflow</h4>
                                        <span className="badge badge-info">New</span>
                                    </div>
                                    <p className="text-sm text-base-content/70">Reduce paper usage by 90%</p>
                                    <div className="w-full bg-base-300 rounded-full h-2.5 mt-2">
                                        <div className="bg-info h-2.5 rounded-full" style={{ width: '15%' }}></div>
                                    </div>
                                    <p className="text-xs text-base-content/50 mt-1">15% complete</p>
                                </div>

                                <div className="bg-base-200 rounded-lg p-3">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-medium">Energy conservation</h4>
                                        <span className="badge badge-success">In Progress</span>
                                    </div>
                                    <p className="text-sm text-base-content/70">Reduce office energy usage by 20%</p>
                                    <div className="w-full bg-base-300 rounded-full h-2.5 mt-2">
                                        <div className="bg-success h-2.5 rounded-full" style={{ width: '45%' }}></div>
                                    </div>
                                    <p className="text-xs text-base-content/50 mt-1">45% complete</p>
                                </div>
                            </div>
                            <div className="card-actions justify-center mt-4">
                                <button className="btn btn-sm btn-ghost">View All Goals</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Team Leaderboard */}
                <div className="mt-6">
                    <div className="card bg-base-100 shadow-md">
                        <div className="card-body">
                            <h3 className="card-title mb-4">Team Leaderboard</h3>
                            <div className="overflow-x-auto">
                                <table className="table table-zebra">
                                    <thead>
                                        <tr>
                                            <th>Rank</th>
                                            <th>Team Member</th>
                                            <th>Emissions Reduced</th>
                                            <th>Goals Completed</th>
                                            <th>Carbon Points</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="bg-success/10">
                                            <td>1</td>
                                            <td>
                                                <div className="flex items-center space-x-3">
                                                    <div className="avatar">
                                                        <div className="mask mask-squircle w-8 h-8">
                                                            <img src="https://placehold.co/100x100" alt="Avatar" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold">Sarah Johnson</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>32%</td>
                                            <td>8/10</td>
                                            <td>2,450</td>
                                        </tr>
                                        <tr className="bg-info/10">
                                            <td>2</td>
                                            <td>
                                                <div className="flex items-center space-x-3">
                                                    <div className="avatar">
                                                        <div className="mask mask-squircle w-8 h-8">
                                                            <img src="https://placehold.co/100x100" alt="Avatar" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold">Michael Chen</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>28%</td>
                                            <td>7/10</td>
                                            <td>1,950</td>
                                        </tr>
                                        <tr className="bg-warning/10">
                                            <td>3</td>
                                            <td>
                                                <div className="flex items-center space-x-3">
                                                    <div className="avatar">
                                                        <div className="mask mask-squircle w-8 h-8">
                                                            <img src="https://placehold.co/100x100" alt="Avatar" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold">You</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>25%</td>
                                            <td>5/8</td>
                                            <td>1,250</td>
                                        </tr>
                                        <tr>
                                            <td>4</td>
                                            <td>
                                                <div className="flex items-center space-x-3">
                                                    <div className="avatar">
                                                        <div className="mask mask-squircle w-8 h-8">
                                                            <img src="https://placehold.co/100x100" alt="Avatar" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold">Alex Rodriguez</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>22%</td>
                                            <td>6/10</td>
                                            <td>1,100</td>
                                        </tr>
                                        <tr>
                                            <td>5</td>
                                            <td>
                                                <div className="flex items-center space-x-3">
                                                    <div className="avatar">
                                                        <div className="mask mask-squircle w-8 h-8">
                                                            <img src="https://placehold.co/100x100" alt="Avatar" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold">Emily Wilson</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>18%</td>
                                            <td>4/10</td>
                                            <td>950</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
