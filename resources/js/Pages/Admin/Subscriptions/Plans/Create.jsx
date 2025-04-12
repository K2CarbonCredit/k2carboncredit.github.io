import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import TextareaInput from '@/Components/TextareaInput';
import InputError from '@/Components/InputError';
import { FiArrowLeft, FiDollarSign, FiStar, FiTag, FiTruck } from 'react-icons/fi';

export default function Create({ auth }) {
  const [features, setFeatures] = useState(['']);
  
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    description: '',
    setup_fee: '0.00',
    monthly_price: '0.00',
    yearly_price: '0.00',
    is_popular: false,
    is_active: true,
    max_vehicles: '',
    features: [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Filter out empty features
    const filteredFeatures = features.filter(feature => feature.trim() !== '');
    setData('features', filteredFeatures);
    
    post('/admin/subscriptions/plans');
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
    
    // If the last field has content, add a new empty field
    if (index === features.length - 1 && value.trim() !== '') {
      setFeatures([...newFeatures, '']);
    }
  };

  const removeFeature = (index) => {
    if (features.length > 1) {
      const newFeatures = [...features];
      newFeatures.splice(index, 1);
      setFeatures(newFeatures);
    }
  };

  return (
    <AdminLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-base-content leading-tight">Create Subscription Plan</h2>
          <Link href="/admin/subscriptions/plans">
            <button type="button" className="btn btn-outline btn-sm">
              <FiArrowLeft className="mr-1" /> Back to Plans
            </button>
          </Link>
        </div>
      }
    >
      <Head title="Create Subscription Plan" />

      <div className="py-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {/* Plan Information */}
              <div className="mb-8">
                <h3 className="card-title text-base-content mb-4">Plan Information</h3>
                <div className="divider mt-0"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Plan Name */}
                  <div className="form-control">
                    <InputLabel htmlFor="name" value="Plan Name" />
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FiTag className="text-primary" />
                      </div>
                      <TextInput
                        id="name"
                        type="text"
                        className="mt-1 block w-full pl-10"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                      />
                    </div>
                    <InputError message={errors.name} className="mt-2" />
                  </div>
                  
                  {/* Description */}
                  <div className="form-control">
                    <InputLabel htmlFor="description" value="Description" />
                    <TextareaInput
                      id="description"
                      className="mt-1 block w-full"
                      value={data.description}
                      onChange={(e) => setData('description', e.target.value)}
                      rows={3}
                    />
                    <InputError message={errors.description} className="mt-2" />
                  </div>
                </div>
              </div>
              
              {/* Pricing */}
              <div className="mb-8 mt-8">
                <h3 className="card-title text-base-content mb-4">Pricing Information</h3>
                <div className="divider mt-0"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Setup Fee */}
                  <div className="form-control">
                    <InputLabel htmlFor="setup_fee" value="Setup Fee ($)" />
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FiDollarSign className="text-success" />
                      </div>
                      <TextInput
                        id="setup_fee"
                        type="number"
                        step="0.01"
                        min="0"
                        className="mt-1 block w-full pl-10"
                        value={data.setup_fee}
                        onChange={(e) => setData('setup_fee', e.target.value)}
                        required
                      />
                    </div>
                    <InputError message={errors.setup_fee} className="mt-2" />
                  </div>
                  
                  {/* Monthly Price */}
                  <div className="form-control">
                    <InputLabel htmlFor="monthly_price" value="Monthly Price ($)" />
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FiDollarSign className="text-success" />
                      </div>
                      <TextInput
                        id="monthly_price"
                        type="number"
                        step="0.01"
                        min="0"
                        className="mt-1 block w-full pl-10"
                        value={data.monthly_price}
                        onChange={(e) => setData('monthly_price', e.target.value)}
                        required
                      />
                    </div>
                    <InputError message={errors.monthly_price} className="mt-2" />
                  </div>
                  
                  {/* Yearly Price */}
                  <div className="form-control">
                    <InputLabel htmlFor="yearly_price" value="Yearly Price ($)" />
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FiDollarSign className="text-success" />
                      </div>
                      <TextInput
                        id="yearly_price"
                        type="number"
                        step="0.01"
                        min="0"
                        className="mt-1 block w-full pl-10"
                        value={data.yearly_price}
                        onChange={(e) => setData('yearly_price', e.target.value)}
                        required
                      />
                    </div>
                    <InputError message={errors.yearly_price} className="mt-2" />
                  </div>
                </div>
              </div>
              
              {/* Settings */}
              <div className="mb-8 mt-8">
                <h3 className="card-title text-base-content mb-4">Plan Settings</h3>
                <div className="divider mt-0"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Maximum Vehicles */}
                  <div className="form-control">
                    <InputLabel htmlFor="max_vehicles" value="Maximum Vehicles" />
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FiTruck className="text-info" />
                      </div>
                      <TextInput
                        id="max_vehicles"
                        type="number"
                        min="0"
                        className="mt-1 block w-full pl-10"
                        value={data.max_vehicles}
                        onChange={(e) => setData('max_vehicles', e.target.value)}
                        placeholder="Leave empty for unlimited"
                      />
                    </div>
                    <InputError message={errors.max_vehicles} className="mt-2" />
                  </div>
                  
                  {/* Checkboxes */}
                  <div className="form-control">
                    <label className="label opacity-0">
                      <span className="label-text">Options</span>
                    </label>
                    <div className="flex items-center space-x-6 mt-1">
                      <label className="cursor-pointer label justify-start space-x-2">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary"
                          checked={data.is_popular}
                          onChange={(e) => setData('is_popular', e.target.checked)}
                        />
                        <span className="label-text flex items-center">
                          <FiStar className="h-5 w-5 mr-1 text-warning" />
                          Mark as Popular
                        </span>
                      </label>
                      
                      <label className="cursor-pointer label justify-start space-x-2">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary"
                          checked={data.is_active}
                          onChange={(e) => setData('is_active', e.target.checked)}
                        />
                        <span className="label-text">Active</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Features */}
              <div className="mb-8 mt-8">
                <h3 className="card-title text-base-content mb-4">Plan Features</h3>
                <div className="divider mt-0"></div>
                <p className="text-sm text-base-content/70 mb-4">Add bullet points that describe what's included in this plan.</p>
                
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <TextInput
                        type="text"
                        value={feature}
                        className="flex-1"
                        placeholder={`Feature ${index + 1}`}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                      />
                      {index > 0 && (
                        <button 
                          type="button" 
                          className="btn btn-sm btn-outline btn-error"
                          onClick={() => removeFeature(index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <InputError message={errors.features} className="mt-2" />
              </div>
              
              <div className="flex justify-end space-x-3 mt-8 pt-4 border-t">
                <Link href="/admin/subscriptions/plans">
                  <button type="button" className="btn btn-outline">
                    Cancel
                  </button>
                </Link>
                <button type="submit" className="btn btn-primary" disabled={processing}>
                  Create Plan
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="h-16"></div>
      </div>
    </AdminLayout>
  );
}
