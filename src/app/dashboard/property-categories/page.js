'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function PropertyCategories() {
  const [categories, setCategories] = useState([
    { id: 'residential', name: 'Residential', description: 'Houses, apartments, and condos for living', count: 0, color: 'bg-blue-100 text-blue-800' },
    { id: 'commercial', name: 'Commercial', description: 'Office spaces, retail locations, and business properties', count: 0, color: 'bg-green-100 text-green-800' },
    { id: 'industrial', name: 'Industrial', description: 'Warehouses, factories, and industrial facilities', count: 0, color: 'bg-orange-100 text-orange-800' },
    { id: 'land', name: 'Land', description: 'Vacant land and lots for development', count: 0, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'investment', name: 'Investment', description: 'Properties for investment and rental income', count: 0, color: 'bg-purple-100 text-purple-800' }
  ]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchCategoryStats();
  }, []);

  const fetchCategoryStats = async () => {
    try {
      const response = await fetch('/api/property?stats=true');
      const result = await response.json();

      if (response.ok && result.data.propertyTypes) {
        // Update category counts based on actual data
        const updatedCategories = categories.map(category => {
          const typeData = result.data.propertyTypes.find(type => type._id === category.id);
          return {
            ...category,
            count: typeData ? typeData.count : 0
          };
        });
        setCategories(updatedCategories);
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error fetching category stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryStats = (categoryId) => {
    if (!stats || !stats.propertyTypes) return { count: 0, percentage: 0 };

    const categoryData = stats.propertyTypes.find(type => type._id === categoryId);
    const total = stats.overview.totalProperties;
    const count = categoryData ? categoryData.count : 0;
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

    return { count, percentage };
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Property Categories</h1>
        <p className="text-gray-600 mt-2">Overview of your property portfolio by category</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Categories</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Properties</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.overview?.totalProperties || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Most Popular</p>
              <p className="text-lg font-bold text-gray-900">
                {stats?.propertyTypes?.length > 0
                  ? stats.propertyTypes.reduce((prev, current) =>
                      (prev.count > current.count) ? prev : current
                    )._id
                  : 'N/A'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Price</p>
              <p className="text-lg font-bold text-gray-900">
                ${stats?.overview?.averagePrice ? Math.round(stats.overview.averagePrice).toLocaleString() : '0'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Details */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Category Breakdown</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {categories.map((category) => {
            const stats = getCategoryStats(category.id);
            return (
              <div key={category.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${category.color}`}>
                      {category.name}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{stats.count}</div>
                    <div className="text-sm text-gray-600">properties</div>
                    <div className="text-sm text-gray-500">{stats.percentage}% of total</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${stats.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Insights */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Category Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Top Performing Categories</h3>
            <ul className="space-y-2">
              {stats?.propertyTypes
                ?.sort((a, b) => b.count - a.count)
                ?.slice(0, 3)
                ?.map((type, index) => (
                  <li key={type._id} className="flex items-center justify-between">
                    <span className="text-gray-600 capitalize">{type._id}</span>
                    <span className="font-medium">{type.count} properties</span>
                  </li>
                )) || (
                <li className="text-gray-500">No data available</li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Growth Opportunities</h3>
            <ul className="space-y-2">
              {categories
                .filter(cat => getCategoryStats(cat.id).count === 0)
                .map((cat) => (
                  <li key={cat.id} className="flex items-center justify-between">
                    <span className="text-gray-600">{cat.name}</span>
                    <span className="text-sm text-blue-600">No properties yet</span>
                  </li>
                ))}
              {categories.filter(cat => getCategoryStats(cat.id).count === 0).length === 0 && (
                <li className="text-gray-500">All categories have properties</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
