'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import MainNav from '@/components/home-component/MainNav'
import { Menu, X } from 'lucide-react';

export default function AllPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    propertyType: '',
    status: '',
    minPrice: '',
    maxPrice: '',
    city: '',
    sortBy: 'dateListed',
    sortOrder: 'desc'
  });

  const propertyTypes = ['House', 'Apartment', 'Condo', 'Townhouse', 'Land', 'Commercial', 'Office-Space'];
  const statuses = ['Available', 'Sold', 'Rented', 'Pending', 'Off-Market'];

  useEffect(() => {
    fetchProperties();
  }, [currentPage, filters]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      });

      const response = await fetch(`/api/property?${params}`);
      const result = await response.json();

      if (result.data) {
        setProperties(result.data);
        setTotalPages(result.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilters({
      search: '',
      propertyType: '',
      status: '',
      minPrice: '',
      maxPrice: '',
      city: '',
      sortBy: 'dateListed',
      sortOrder: 'desc'
    });
    setCurrentPage(1);
  };
  
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'All Properties' }
  ]

  return (
    <>
    <MainNav
        title="All Properties"
        breadcrumbs={breadcrumbs}
    />
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900">All Properties</h1>
          <p className="text-gray-600 mt-2">Browse {properties.length > 0 ? 'our available' : 'all'} properties</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowFilters(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-impact-gold text-white rounded-lg font-medium hover:bg-impact-gold/90 transition-colors"
            >
              <Menu className="w-5 h-5" />
              Show Filters
            </button>
          </div>

          {/* Mobile Overlay */}
          {showFilters && (
            <div
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={() => setShowFilters(false)}
            />
          )}

          {/* Sidebar Filters */}
          <div
            className={`fixed lg:static top-0 left-0 h-full lg:h-auto w-72 lg:w-auto bg-white z-50 transition-transform duration-300 ease-in-out transform ${
              showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            } lg:col-span-1 overflow-y-auto lg:overflow-visible`}
          >
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-0 lg:sticky lg:rounded-lg">
              {/* Close Button for Mobile */}
              <button
                onClick={() => setShowFilters(false)}
                className="lg:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-50"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-lg font-semibold text-gray-900 mb-6 mt-8 lg:mt-0 pr-8 lg:pr-0">Filters</h2>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Property name or location..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-impact-gold text-sm"
                />
              </div>

              {/* Property Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                <select
                  value={filters.propertyType}
                  onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-impact-gold text-sm"
                >
                  <option value="">All Types</option>
                  {propertyTypes.map(type => (
                    <option key={type} value={type.toLowerCase()}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-impact-gold text-sm"
                >
                  <option value="">All Statuses</option>
                  {statuses.map(status => (
                    <option key={status} value={status.toLowerCase()}>{status}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Min price"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-impact-gold text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max price"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-impact-gold text-sm"
                  />
                </div>
              </div>

              {/* City */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  placeholder="City name..."
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-impact-gold text-sm"
                />
              </div>

              {/* Sort */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <div className="space-y-2">
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-impact-gold text-sm"
                  >
                    <option value="dateListed">Newest</option>
                    <option value="price">Price</option>
                    <option value="title">Name</option>
                  </select>
                  <select
                    value={filters.sortOrder}
                    onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-impact-gold text-sm"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={handleReset}
                className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors font-medium text-sm"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-impact-gold"></div>
              </div>
            ) : properties.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {properties.map((property) => {
                    const featuredImage = property.images?.find(img => img.isMain);

                    return (
                      <Link
                        key={property._id}
                        href={`/all-properties/${property._id}`}
                        className="group bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-xl transition-shadow duration-300"
                      >
                        {/* Image Container */}
                        <div className="relative h-48 bg-gray-200 overflow-hidden">
                          {featuredImage ? (
                            <img
                              src={featuredImage.url}
                              alt={property.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}

                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex gap-2">
                            {property.isFeatured && (
                              <span className="inline-block px-2 py-1 bg-impact-gold text-white text-xs font-semibold rounded">
                                ⭐ Featured
                              </span>
                            )}
                            <span className="inline-block px-2 py-1 bg-gray-900/80 text-white text-xs font-semibold rounded capitalize">
                              {property.status}
                            </span>
                          </div>

                          {/* Price Badge */}
                          <div className="absolute top-3 right-3 bg-impact-gold text-white px-3 py-1 rounded-full text-sm font-bold">
                            ₦{(property.price / 1000).toFixed(0)}K
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          {/* Title */}
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-impact-gold transition-colors line-clamp-2">
                            {property.title}
                          </h3>

                          {/* Location */}
                          <p className="text-sm text-gray-600 mt-1">
                            📍 {property.address?.city}, {property.address?.state}
                          </p>

                          {/* Features */}
                          <div className="flex gap-3 mt-3 pt-3 border-t">
                            {property.bedrooms > 0 && (
                              <div className="flex items-center gap-1 text-xs text-gray-600">
                                <span>🛏️</span>
                                <span>{property.bedrooms} Beds</span>
                              </div>
                            )}
                            {property.bathrooms > 0 && (
                              <div className="flex items-center gap-1 text-xs text-gray-600">
                                <span>🚿</span>
                                <span>{property.bathrooms} Baths</span>
                              </div>
                            )}
                            {property.squareFootage && (
                              <div className="flex items-center gap-1 text-xs text-gray-600">
                                <span>📐</span>
                                <span>{property.squareFootage.toLocaleString()} sqft</span>
                              </div>
                            )}
                          </div>

                          {/* Full Price */}
                          <div className="flex items-center justify-between mt-4 pt-3 border-t">
                            <span className="text-lg font-bold text-gray-900">
                              ₦{property.price.toLocaleString()}
                            </span>
                            <span className="text-impact-gold text-sm font-semibold group-hover:translate-x-1 transition-transform">
                              View →
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-md transition-colors ${
                          currentPage === page
                            ? 'bg-impact-gold text-white'
                            : 'border hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No properties found matching your criteria</p>
                <button
                  onClick={handleReset}
                  className="mt-4 px-6 py-2 bg-impact-gold text-white rounded-md hover:bg-impact-gold hover:bg-opacity-90 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
