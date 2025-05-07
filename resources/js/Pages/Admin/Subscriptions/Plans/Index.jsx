import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FiPlus, FiEdit, FiTrash2, FiStar, FiSearch, FiFilter, FiDollarSign, FiTruck } from 'react-icons/fi';
import Pagination from '@/Components/Pagination';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import Modal from '@/Components/Modal';

export default function Index({ auth, plans, filters = {}, statuses = { all: 'All Plans', active: 'Active', inactive: 'Inactive' } }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  
  const { data, setData, get, processing } = useForm({
    search: filters.search || '',
    status: filters.status || 'all',
    sort_field: filters.sort_field || 'created_at',
    sort_direction: filters.sort_direction || 'desc',
  });
  
  const handleSearch = (e) => {
    e.preventDefault();
    get('/admin/subscriptions/plans', {
      preserveState: true,
      preserveScroll: true,
      only: ['plans', 'filters']
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
    
    get('/admin/subscriptions/plans', {
      preserveState: true,
      preserveScroll: true,
    });
  };
  
  const confirmDelete = (plan) => {
    setPlanToDelete(plan);
    setShowDeleteModal(true);
  };
  
  const deletePlan = () => {
    if (planToDelete) {
      window.location.href = `/admin/subscriptions/plans/${planToDelete.id}`;
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
  
  return (
    <AdminLayout
      user={auth.user}
    >
      <Head title="Subscription Plans" />

      <div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="card-header flex items-center justify-between">
              <h3 className="card-title text-base-content text-xl font-semibold inline-block">Subscription Plans</h3>
              <div className="flex gap-2">
                <Link href="/admin/subscriptions/plans/create">
                  <button type="button" className="btn btn-primary btn-sm">
                    <FiPlus className="mr-1" /> Add Plan
                  </button>
                </Link>
              </div>
            </div>
            
            {/* Filters */}
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 my-6">
              <div className="form-control flex-grow">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiSearch className="text-primary" />
                  </div>
                  <TextInput
                    type="text"
                    placeholder="Search plans..."
                    value={data.search}
                    onChange={(e) => setData('search', e.target.value)}
                    className="w-full pl-10"
                  />
                </div>
              </div>
              <div className="form-control w-full md:w-48">
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
              <div>
                <button type="submit" className="btn btn-primary w-full md:w-auto" disabled={processing}>
                  Apply Filters
                </button>
              </div>
            </form>
            
            {/* Plans Table */}
            <div className="overflow-x-auto w-full">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th 
                      className="cursor-pointer hover:bg-base-200"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center">
                        Plan Name {getSortIcon('name')}
                      </div>
                    </th>
                    <th 
                      className="cursor-pointer hover:bg-base-200"
                      onClick={() => handleSort('setup_fee')}
                    >
                      <div className="flex items-center">
                        Setup Fee {getSortIcon('setup_fee')}
                      </div>
                    </th>
                    <th 
                      className="cursor-pointer hover:bg-base-200"
                      onClick={() => handleSort('monthly_price')}
                    >
                      <div className="flex items-center">
                        Monthly {getSortIcon('monthly_price')}
                      </div>
                    </th>
                    <th 
                      className="cursor-pointer hover:bg-base-200"
                      onClick={() => handleSort('yearly_price')}
                    >
                      <div className="flex items-center">
                        Yearly {getSortIcon('yearly_price')}
                      </div>
                    </th>
                    <th 
                      className="cursor-pointer hover:bg-base-200"
                      onClick={() => handleSort('max_vehicles')}
                    >
                      <div className="flex items-center">
                        Vehicles {getSortIcon('max_vehicles')}
                      </div>
                    </th>
                    <th>Popular</th>
                    <th 
                      className="cursor-pointer hover:bg-base-200"
                      onClick={() => handleSort('is_active')}
                    >
                      <div className="flex items-center">
                        Status {getSortIcon('is_active')}
                      </div>
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.length > 0 ? (
                    plans.map((plan) => (
                      <tr key={plan.id} className="hover">
                        <td className="font-medium">{plan.name}</td>
                        <td>
                          <div className="flex items-center">
                            <FiDollarSign className="text-success mr-1 h-4 w-4" />
                            {plan.setup_fee}
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center">
                            <FiDollarSign className="text-success mr-1 h-4 w-4" />
                            {plan.monthly_price}/mo
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center">
                            <FiDollarSign className="text-success mr-1 h-4 w-4" />
                            {plan.yearly_price}/yr
                            {plan.yearly_savings_percent > 0 && (
                              <span className="ml-2 badge badge-success badge-sm">
                                Save {plan.yearly_savings_percent}%
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center">
                            <FiTruck className="text-info mr-1 h-4 w-4" />
                            {plan.max_vehicles || 'Unlimited'}
                          </div>
                        </td>
                        <td>
                          {plan.is_popular ? (
                            <div className="flex items-center">
                              <FiStar className="text-warning h-5 w-5" />
                              <span className="ml-1 text-xs text-warning">Popular</span>
                            </div>
                          ) : (
                            <span className="text-base-content/30">-</span>
                          )}
                        </td>
                        <td>
                          <span className={`badge ${plan.is_active ? 'badge-success' : 'badge-error'}`}>
                            {plan.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center space-x-2">
                            <Link href={`/admin/subscriptions/plans/${plan.id}/edit`} className="btn btn-ghost btn-xs">
                              <FiEdit className="text-info" />
                            </Link>
                            <button 
                              type="button"
                              className="btn btn-ghost btn-xs" 
                              onClick={() => confirmDelete(plan)}
                            >
                              <FiTrash2 className="text-error" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        <div className="alert alert-info">
                          No subscription plans found. Create your first plan to get started.
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {plans.links && <Pagination class="mt-6" links={plans.links} />}
          </div>
        </div>
        <div className="h-16"></div>
      </div>
      
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="p-6">
          <h2 className="text-lg font-medium text-base-content">
            Are you sure you want to delete this subscription plan?
          </h2>
          
          <p className="mt-1 text-sm text-base-content">
            This action cannot be undone. Companies using this plan may be affected.
          </p>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button className="btn btn-outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </button>
            
            <button className="btn btn-error" onClick={deletePlan}>
              Delete Plan
            </button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}
