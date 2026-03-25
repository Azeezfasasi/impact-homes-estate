'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AllProperty() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    propertyType: '',
    category: '',
    search: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Dynamic filter options
  const [statuses, setStatuses] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingFilters, setLoadingFilters] = useState(true);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchFilterOptions = async () => {
    try {
      const [statusesRes, typesRes, categoriesRes] = await Promise.all([
        fetch('/api/statuses'),
        fetch('/api/property-types'),
        fetch('/api/categories')
      ]);

      const statusesData = await statusesRes.json();
      const typesData = await typesRes.json();
      const categoriesData = await categoriesRes.json();

      setStatuses(statusesData.data || []);
      setPropertyTypes(typesData.data || []);
      setCategories(categoriesData.data || []);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    } finally {
      setLoadingFilters(false);
    }
  };

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '') {
          queryParams.append(key, value);
        }
      });

      const response = await fetch(`/api/property?${queryParams}`);
      const result = await response.json();

      if (response.ok) {
        setProperties(result.data || []);
        setPagination(result.pagination);
      } else {
        toast.error(result.error || 'Failed to fetch properties');
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('An error occurred while fetching properties');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      const response = await fetch(`/api/property/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Property deleted successfully');
        fetchProperties(); // Refresh the list
      } else {
        const result = await response.json();
        toast.error(result.error || 'Failed to delete property');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('An error occurred while deleting the property');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'sold': return 'bg-red-100 text-red-800';
      case 'rented': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'off-market': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="md:max-w-7xl mx-auto p-0 md:p-6">
      <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Properties</h1>
          <p className="text-gray-600 mt-2">Manage your property portfolio</p>
        </div>
        <button
          onClick={() => router.push('/dashboard/add-property')}
          className="px-4 py-2 bg-impact-gold text-white rounded-md hover:bg-impact-gold/80 focus:outline-none focus:ring-2 focus:ring-impact-gold"
        >
          Add New Property
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-lg shadow-sm border border-impact-gold/40 bg-impact-gold/10 mb-6">
        <div className="p-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-gray-700 hover:text-gray-900"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
            <svg className={`w-4 h-4 ml-2 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {showFilters && (
          <div className="px-4 pb-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search properties..."
                  className="w-full px-3 py-2 border border-impact-gold/70 rounded-md focus:outline-none focus:ring-2 focus:ring-impact-gold"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-impact-gold/70 rounded-md focus:outline-none focus:ring-2 focus:ring-impact-gold"
                  disabled={loadingFilters}
                >
                  <option value="">All Statuses</option>
                  {statuses.map((status) => (
                    <option key={status._id} value={status.name}>
                      {status.name.charAt(0).toUpperCase() + status.name.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type
                </label>
                <select
                  name="propertyType"
                  value={filters.propertyType}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-impact-gold/70 rounded-md focus:outline-none focus:ring-2 focus:ring-impact-gold"
                  disabled={loadingFilters}
                >
                  <option value="">All Types</option>
                  {propertyTypes.map((type) => (
                    <option key={type._id} value={type.name}>
                      {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-impact-gold/70 rounded-md focus:outline-none focus:ring-2 focus:ring-impact-gold"
                  disabled={loadingFilters}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Properties Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-impact-gold"></div>
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No properties found</p>
          <button
            onClick={() => router.push('/dashboard/add-property')}
            className="mt-4 px-4 py-2 bg-impact-gold text-white rounded-md hover:bg-impact-gold/80 focus:outline-none focus:ring-2 focus:ring-impact-gold"
          >
            Add Your First Property
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {properties.map((property) => {
              const featuredImage = property.images?.find(img => img.isMain) || property.images?.[0];
              return (
              <div key={property._id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                {/* Featured Image */}
                {featuredImage && (
                  <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={featuredImage.url}
                      alt={property.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    {property.isFeatured && (
                      <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-xs font-bold">
                        ⭐ Featured
                      </div>
                    )}
                  </div>
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {property.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                      {property.status}
                    </span>
                  </div>

                  <p className="text-2xl font-bold text-impact-gold mb-2">
                    {property.price ? property.price.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' }) : 'Price on request'}
                  </p>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {property.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Type:</span> {property.propertyType}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Location:</span> {property.address.city}, {property.address.state}
                    </p>
                    {property.bedrooms > 0 && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Bedrooms:</span> {property.bedrooms}
                      </p>
                    )}
                    {property.bathrooms > 0 && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Bathrooms:</span> {property.bathrooms}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => router.push(`/dashboard/property/${property._id}/edit`)}
                        className="px-3 py-1 text-sm bg-impact-gold text-white rounded-md hover:bg-impact-gold/80 transition-colors"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(property._id)}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <span className="text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
