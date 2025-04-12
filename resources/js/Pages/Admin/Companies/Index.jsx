import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FiEdit, FiTrash2, FiEye, FiUserPlus, FiUsers, FiSearch, FiFilter, FiPlus, FiCreditCard, FiCheck, FiX } from 'react-icons/fi';
import Pagination from '@/Components/Pagination';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import Modal from '@/Components/Modal';

export default function Index({ auth, companies, filters, statuses, subscriptionStatuses }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [companyToDelete, setCompanyToDelete] = useState(null);
    
    const { data, setData, get, processing } = useForm({
        search: filters.search || '',
        status: filters.status || 'all',
        subscription_status: filters.subscription_status || 'all',
        sort_field: filters.sort_field || 'created_at',
        sort_direction: filters.sort_direction || 'desc',
        view: filters.view || 'default',
    });
    
    const handleSearch = (e) => {
        e.preventDefault();
        get(route('admin.companies.index'), {
            preserveState: true,
            preserveScroll: true,
            only: ['companies', 'filters']
        });
    };
    
    const handleSort = (field) => {
        const direction = 
            data.sort_field === field && data.sort_direction === 'asc' 
                ? 'desc' 
                : 'asc';
        
        setData({
            ...data,
            sort_field: field,
            sort_direction: direction,
        });
        
        get(route('admin.companies.index'), {
            preserveState: true,
            preserveScroll: true,
        });
    };
    
    const confirmDelete = (company) => {
        setCompanyToDelete(company);
        setShowDeleteModal(true);
    };
    
    const deleteCompany = () => {
        if (companyToDelete) {
            window.location.href = route('admin.companies.destroy', companyToDelete.id);
        }
    };
    
    const getSortIcon = (field) => {
        if (data.sort_field !== field) {
            return null;
        }
        
        return data.sort_direction === 'asc' 
            ? <span className="ml-1">↑</span> 
            : <span className="ml-1">↓</span>;
    };
    
    const statusBadge = (status) => {
        const colors = {
            active: 'badge-success',
            inactive: 'badge-error',
            pending: 'badge-warning',
        };
        
        return (
            <div className={`badge ${colors[status] || 'badge-ghost'}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </div>
        );
    };
    
    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-base-content leading-tight">
                        {data.view === 'subscriptions' ? 'Company Subscriptions' : 'Companies'}
                    </h2>
                    <div className="flex gap-2">
                        {data.view !== 'subscriptions' ? (
                            <Link href={route('admin.companies.index') + '?view=subscriptions'}>
                                <button type="button" className="btn btn-outline btn-sm">
                                    <FiCreditCard className="mr-1" /> View Subscriptions
                                </button>
                            </Link>
                        ) : (
                            <Link href={route('admin.companies.index')}>
                                <button type="button" className="btn btn-outline btn-sm">
                                    <FiBriefcase className="mr-1" /> View Companies
                                </button>
                            </Link>
                        )}
                        <Link href={route('admin.companies.create')}>
                            <button type="button" className="btn btn-primary btn-sm">
                                <FiPlus className="mr-1" /> Add Company
                            </button>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Companies" />

            <div className="py-6">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h3 className="card-title text-base-content mb-4">Companies List</h3>
                        <div className="divider mt-0"></div>
                        
                        {/* Filters */}
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-6">
                            <div className="form-control flex-grow">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <FiSearch className="text-primary" />
                                    </div>
                                    <TextInput
                                        type="text"
                                        placeholder="Search companies..."
                                        value={data.search}
                                        onChange={(e) => setData('search', e.target.value)}
                                        className="w-full pl-10"
                                    />
                                </div>
                            </div>
                            <div className="form-control w-full sm:w-40">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <FiFilter className="text-primary" />
                                    </div>
                                    <SelectInput
                                        value={data.status}
                                        onChange={(e) => {
                                            setData('status', e.target.value);
                                            setTimeout(() => handleSearch(new Event('submit')), 100);
                                        }}
                                        className="w-full pl-10 select select-bordered"
                                    >
                                        {Object.entries(statuses).map(([value, label]) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </SelectInput>
                                </div>
                            </div>
                            {data.view === 'subscriptions' && (
                                <div className="form-control w-full sm:w-56">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <FiCreditCard className="text-primary" />
                                        </div>
                                        <SelectInput
                                            value={data.subscription_status}
                                            onChange={(e) => {
                                                setData('subscription_status', e.target.value);
                                                setTimeout(() => handleSearch(new Event('submit')), 100);
                                            }}
                                            className="w-full pl-10 select select-bordered"
                                        >
                                            {subscriptionStatuses && Object.entries(subscriptionStatuses).map(([value, label]) => (
                                                <option key={value} value={value}>{label}</option>
                                            ))}
                                        </SelectInput>
                                    </div>
                                </div>
                            )}
                            <div>
                                <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={processing}>
                                    Filter
                                </button>
                            </div>
                        </form>
                            
                        {/* Companies Table */}
                        <div className="overflow-x-auto w-full">
                            <table className="table table-zebra w-full">
                                <thead>
                                    <tr>
                                        <th 
                                            className="cursor-pointer"
                                            onClick={() => handleSort('name')}
                                        >
                                            Name {getSortIcon('name')}
                                        </th>
                                        <th 
                                            className="cursor-pointer"
                                            onClick={() => handleSort('email')}
                                        >
                                            Email {getSortIcon('email')}
                                        </th>
                                        {data.view !== 'subscriptions' ? (
                                            <>
                                                <th 
                                                    className="cursor-pointer"
                                                    onClick={() => handleSort('industry')}
                                                >
                                                    Industry {getSortIcon('industry')}
                                                </th>
                                                <th 
                                                    className="cursor-pointer"
                                                    onClick={() => handleSort('status')}
                                                >
                                                    Status {getSortIcon('status')}
                                                </th>
                                                <th 
                                                    className="cursor-pointer"
                                                    onClick={() => handleSort('users_count')}
                                                >
                                                    Users {getSortIcon('users_count')}
                                                </th>
                                            </>
                                        ) : (
                                            <>
                                                <th>Subscription Plan</th>
                                                <th>Status</th>
                                                <th>Billing Cycle</th>
                                                <th>Renewal Date</th>
                                            </>
                                        )}
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {companies.data.length > 0 ? (
                                        companies.data.map((company) => (
                                            <tr key={company.id}>
                                                <td className="font-medium">{company.name}</td>
                                                <td>{company.email}</td>
                                                
                                                {data.view !== 'subscriptions' ? (
                                                    <>
                                                        <td>{company.industry || '-'}</td>
                                                        <td>
                                                            <div className={`badge ${company.status === 'active' ? 'badge-success' : company.status === 'inactive' ? 'badge-error' : 'badge-warning'}`}>
                                                                {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="badge badge-neutral">{company.users_count}</div>
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td>
                                                            {company.active_subscription?.plan ? (
                                                                <div className="font-medium">{company.active_subscription.plan.name}</div>
                                                            ) : (
                                                                <div className="text-error">No active plan</div>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {company.active_subscription ? (
                                                                <div className="badge badge-success flex items-center gap-1">
                                                                    <FiCheck size={14} /> Active
                                                                </div>
                                                            ) : (
                                                                <div className="badge badge-error flex items-center gap-1">
                                                                    <FiX size={14} /> Inactive
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {company.active_subscription?.billing_cycle || '-'}
                                                        </td>
                                                        <td>
                                                            {company.active_subscription?.renewal_date ? (
                                                                new Date(company.active_subscription.renewal_date).toLocaleDateString()
                                                            ) : '-'}
                                                        </td>
                                                    </>
                                                )}
                                                
                                                <td>
                                                    <div className="flex flex-wrap gap-2">
                                                        <Link href={route('admin.companies.show', company.id)} className="btn btn-ghost btn-xs">
                                                            <FiEye className="text-primary" />
                                                        </Link>
                                                        <Link href={route('admin.companies.edit', company.id)} className="btn btn-ghost btn-xs">
                                                            <FiEdit className="text-warning" />
                                                        </Link>
                                                        {data.view !== 'subscriptions' ? (
                                                            <>
                                                                <Link href={route('admin.companies.users.index', company.id)} className="btn btn-ghost btn-xs">
                                                                    <FiUsers className="text-info" />
                                                                </Link>
                                                                <Link href={route('admin.companies.impersonate', company.id)} method="post" className="btn btn-ghost btn-xs">                                                            
                                                                    <FiUserPlus className="text-accent" />
                                                                </Link>
                                                            </>
                                                        ) : (
                                                            <Link href={`/admin/companies/${company.id}/subscriptions`} className="btn btn-ghost btn-xs">
                                                                <FiCreditCard className="text-info" />
                                                            </Link>
                                                        )}
                                                        <button 
                                                            type="button"
                                                            className="btn btn-ghost btn-xs" 
                                                            onClick={() => confirmDelete(company)}
                                                        >
                                                            <FiTrash2 className="text-error" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center py-4">
                                                <div className="alert alert-info">
                                                    No companies found.
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                            
                            {/* Pagination */}
                            <Pagination class="mt-6" links={companies.links} />
                    </div>
                </div>
                {/* </div> */}
                <div className="h-16"></div>
            </div>
            
            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-base-content">
                        Are you sure you want to delete this company?
                    </h2>
                    
                    <p className="mt-1 text-sm text-base-content">
                        This action cannot be undone. All users associated with this company will also be deleted.
                    </p>
                    
                    <div className="mt-6 flex justify-end space-x-3">
                        <button className="btn btn-outline" onClick={() => setShowDeleteModal(false)}>
                            Cancel
                        </button>
                        
                        <button className="btn btn-error" onClick={deleteCompany}>
                            Delete Company
                        </button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
