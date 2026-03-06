'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function PropertyStatuses() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/property?stats=true');
      const result = await response.json();

      if (response.ok) {
        setStats(result.data);
      } else {
        toast.error(result.error || 'Failed to fetch statistics');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('An error occurred while fetching statistics');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const StatCard = ({ title, value, color = 'blue', icon }) => (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${color === 'blue' ? 'border-blue-200' : color === 'green' ? 'border-green-200' : color === 'red' ? 'border-red-200' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold ${color === 'blue' ? 'text-blue-600' : color === 'green' ? 'text-green-600' : color === 'red' ? 'text-red-600' : 'text-gray-600'}`}>
            {value}
          </p>
        </div>
        {icon && (
          <div className={`p-3 rounded-full ${color === 'blue' ? 'bg-blue-100' : color === 'green' ? 'bg-green-100' : color === 'red' ? 'bg-red-100' : 'bg-gray-100'}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Unable to load statistics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Property Status Overview</h1>
        <p className="text-gray-600 mt-2">Monitor your property portfolio performance</p>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Properties"
          value={stats.overview.totalProperties}
          color="blue"
          icon={
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />

        <StatCard
          title="Available Properties"
          value={stats.overview.availableProperties}
          color="green"
          icon={
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <StatCard
          title="Sold Properties"
          value={stats.overview.soldProperties}
          color="red"
          icon={
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          }
        />

        <StatCard
          title="Rented Properties"
          value={stats.overview.rentedProperties}
          color="blue"
          icon={
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          }
        />
      </div>

      {/* Price Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Price</h3>
          <p className="text-3xl font-bold text-blue-600">
            {formatPrice(stats.overview.averagePrice)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Minimum Price</h3>
          <p className="text-3xl font-bold text-green-600">
            {formatPrice(stats.overview.minPrice)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Maximum Price</h3>
          <p className="text-3xl font-bold text-red-600">
            {formatPrice(stats.overview.maxPrice)}
          </p>
        </div>
      </div>

      {/* Property Types Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Properties by Type</h3>
        {stats.propertyTypes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.propertyTypes.map((type) => (
              <div key={type._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 capitalize">{type._id}</p>
                  <p className="text-sm text-gray-600">{type.count} properties</p>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {type.count}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No properties found</p>
        )}
      </div>

      {/* Status Distribution Chart Placeholder */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Status Distribution</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
              <span className="text-sm font-medium">Available</span>
            </div>
            <span className="text-sm text-gray-600">{stats.overview.availableProperties} properties</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
              <span className="text-sm font-medium">Sold</span>
            </div>
            <span className="text-sm text-gray-600">{stats.overview.soldProperties} properties</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
              <span className="text-sm font-medium">Rented</span>
            </div>
            <span className="text-sm text-gray-600">{stats.overview.rentedProperties} properties</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded mr-3"></div>
              <span className="text-sm font-medium">Pending</span>
            </div>
            <span className="text-sm text-gray-600">
              {stats.overview.totalProperties - stats.overview.availableProperties - stats.overview.soldProperties - stats.overview.rentedProperties} properties
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
