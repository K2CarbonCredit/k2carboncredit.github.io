import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FaBuilding, FaUsers, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaCalendarAlt } from 'react-icons/fa';

// Card component for dashboard stats
const StatCard = ({ title, value, icon, color }) => {
    return (
        <div className="card bg-base-100 shadow-md">
            <div className="card-body p-6">
                <div className="flex items-center">
                    <div className={`p-3 rounded-full ${color} text-white mr-4`}>
                        {icon}
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">{title}</p>
                        <p className="text-2xl font-semibold">{value}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Company list component
const CompanyList = ({ companies, title }) => {
    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Company
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Owner
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Users
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {companies.map((company) => (
                            <tr key={company.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{company.name}</div>
                                    <div className="text-sm text-gray-500">{company.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {company.owner ? (
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{company.owner.name}</div>
                                            <div className="text-sm text-gray-500">{company.owner.email}</div>
                                        </div>
                                    ) : (
                                        <span className="text-sm text-gray-500">No owner</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${company.status === 'active' ? 'bg-green-100 text-green-800' : 
                                          company.status === 'inactive' ? 'bg-red-100 text-red-800' : 
                                          'bg-yellow-100 text-yellow-800'}`}>
                                        {company.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {company.users_count}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(company.created_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Chart component (placeholder)
const Chart = ({ data, title }) => {
    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
            <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
                <p className="text-gray-500">Chart will be displayed here</p>
                {/* Implement actual chart with a library like Chart.js or Recharts */}
            </div>
        </div>
    );
};

export default function Dashboard({ auth, stats, recentCompanies, topCompanies, growthData, statusDistribution }) {
    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <StatCard 
                            title="Total Companies" 
                            value={stats.totalCompanies} 
                            icon={<FaBuilding size={24} />} 
                            color="bg-blue-500" 
                        />
                        <StatCard 
                            title="Total Users" 
                            value={stats.totalUsers} 
                            icon={<FaUsers size={24} />} 
                            color="bg-green-500" 
                        />
                        <StatCard 
                            title="New Companies (30d)" 
                            value={stats.newCompanies} 
                            icon={<FaCalendarAlt size={24} />} 
                            color="bg-purple-500" 
                        />
                        <StatCard 
                            title="New Users (30d)" 
                            value={stats.newUsers} 
                            icon={<FaCalendarAlt size={24} />} 
                            color="bg-yellow-500" 
                        />
                    </div>

                    {/* Status Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <StatCard 
                            title="Active Companies" 
                            value={stats.activeCompanies} 
                            icon={<FaCheckCircle size={24} />} 
                            color="bg-green-500" 
                        />
                        <StatCard 
                            title="Inactive Companies" 
                            value={stats.inactiveCompanies} 
                            icon={<FaTimesCircle size={24} />} 
                            color="bg-red-500" 
                        />
                        <StatCard 
                            title="Pending Companies" 
                            value={stats.pendingCompanies} 
                            icon={<FaHourglassHalf size={24} />} 
                            color="bg-yellow-500" 
                        />
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <Chart 
                            data={growthData} 
                            title="Monthly Growth" 
                        />
                        <Chart 
                            data={statusDistribution} 
                            title="Company Status Distribution" 
                        />
                    </div>

                    {/* Recent Companies */}
                    <div className="mb-6">
                        <CompanyList 
                            companies={recentCompanies} 
                            title="Recent Companies" 
                        />
                    </div>

                    {/* Top Companies */}
                    <div className="mb-6">
                        <CompanyList 
                            companies={topCompanies} 
                            title="Top Companies by User Count" 
                        />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
