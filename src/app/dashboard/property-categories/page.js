'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function PropertyCategories() {
  const getInitialCategories = () => {
    // Return default categories, will be replaced when API loads
    return [
      { id: 'residential', name: 'Residential', description: 'Houses, apartments, and condos for living', count: 0, color: 'bg-blue-100 text-blue-800' },
      { id: 'commercial', name: 'Commercial', description: 'Office spaces, retail locations, and business properties', count: 0, color: 'bg-green-100 text-green-800' },
      { id: 'industrial', name: 'Industrial', description: 'Warehouses, factories, and industrial facilities', count: 0, color: 'bg-orange-100 text-orange-800' },
      { id: 'land', name: 'Land', description: 'Vacant land and lots for development', count: 0, color: 'bg-yellow-100 text-yellow-800' },
      { id: 'investment', name: 'Investment', description: 'Properties for investment and rental income', count: 0, color: 'bg-purple-100 text-purple-800' }
    ];
  };

  const [categories, setCategories] = useState(getInitialCategories());
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({
    id: '',
    name: '',
    description: '',
    color: 'bg-gray-100 text-gray-800'
  });

  useEffect(() => {
    fetchCategoryStats();
    loadCategoriesFromAPI();
  }, []);

  const loadCategoriesFromAPI = async () => {
    try {
      const response = await fetch('/api/categories');
      const result = await response.json();

      if (response.ok && result.data) {
        const apiCategories = result.data;
        
        // Map API categories to include count (will be fetched from stats)
        const formattedCategories = apiCategories.map(cat => ({
          ...cat,
          count: 0,
          color: cat.color || 'bg-gray-100 text-gray-800'
        }));
        
        setCategories(formattedCategories);
        
        // Cache to localStorage
        localStorage.setItem('propertyCategories', JSON.stringify(formattedCategories));
      }
    } catch (error) {
      console.error('Error loading categories from API:', error);
      // Fallback to localStorage
      loadCategoriesFromLocalStorage();
    }
  };

  const loadCategoriesFromLocalStorage = () => {
    const saved = localStorage.getItem('propertyCategories');
    if (saved) {
      try {
        const savedCategories = JSON.parse(saved);
        setCategories(savedCategories);
      } catch (error) {
        console.error('Error loading categories from storage:', error);
      }
    }
  };

  const saveCategoriesToStorage = (updatedCategories) => {
    localStorage.setItem('propertyCategories', JSON.stringify(
      updatedCategories.map(cat => ({
        id: cat.id,
        name: cat.name,
        description: cat.description,
        color: cat.color
      }))
    ));
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('propertyCategories:updated'));
  };

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

  const handleEditCategory = (category) => {
    setEditingCategory({ ...category });
  };

  const handleSaveCategory = async () => {
    if (!editingCategory.name.trim() || !editingCategory.description.trim()) {
      toast.error('Name and description are required');
      return;
    }

    try {
      const response = await fetch(`/api/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingCategory.name,
          description: editingCategory.description,
          color: editingCategory.color
        })
      });

      const result = await response.json();

      if (response.ok) {
        const updatedCategories = categories.map(cat =>
          cat.id === editingCategory.id ? result.data : cat
        );
        setCategories(updatedCategories);
        saveCategoriesToStorage(updatedCategories);
        setEditingCategory(null);
        toast.success('Category updated successfully');
      } else {
        toast.error(result.error || 'Failed to update category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('An error occurred while updating the category');
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  const handleAddCategory = async () => {
    if (!newCategory.id.trim() || !newCategory.name.trim() || !newCategory.description.trim()) {
      toast.error('All fields are required');
      return;
    }

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: newCategory.id.toLowerCase(),
          name: newCategory.name,
          description: newCategory.description,
          color: newCategory.color
        })
      });

      const result = await response.json();

      if (response.ok) {
        const updatedCategories = [...categories, { ...result.data, count: 0 }];
        setCategories(updatedCategories);
        saveCategoriesToStorage(updatedCategories);
        setNewCategory({ id: '', name: '', description: '', color: 'bg-gray-100 text-gray-800' });
        setShowAddForm(false);
        toast.success('Category added successfully');
      } else {
        toast.error(result.error || 'Failed to add category');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('An error occurred while adding the category');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? This will only remove it from the display, not from existing properties.')) {
      try {
        const response = await fetch(`/api/categories/${categoryId}`, {
          method: 'DELETE'
        });

        const result = await response.json();

        if (response.ok) {
          const updatedCategories = categories.filter(cat => cat.id !== categoryId);
          setCategories(updatedCategories);
          saveCategoriesToStorage(updatedCategories);
          toast.success('Category deleted successfully');
        } else {
          toast.error(result.error || 'Failed to delete category');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('An error occurred while deleting the category');
      }
    }
  };

  const colorOptions = [
    { value: 'bg-blue-100 text-blue-800', label: 'Blue' },
    { value: 'bg-green-100 text-green-800', label: 'Green' },
    { value: 'bg-orange-100 text-orange-800', label: 'Orange' },
    { value: 'bg-yellow-100 text-yellow-800', label: 'Yellow' },
    { value: 'bg-purple-100 text-purple-800', label: 'Purple' },
    { value: 'bg-red-100 text-red-800', label: 'Red' },
    { value: 'bg-indigo-100 text-indigo-800', label: 'Indigo' },
    { value: 'bg-pink-100 text-pink-800', label: 'Pink' },
    { value: 'bg-gray-100 text-gray-800', label: 'Gray' }
  ];

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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Property Categories</h1>
            <p className="text-gray-600 mt-2">Overview of your property portfolio by category</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Category
          </button>
        </div>
      </div>

      {/* Add Category Form */}
      {showAddForm && (
        <div className="mb-8 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category ID</label>
              <input
                type="text"
                value={newCategory.id}
                onChange={(e) => setNewCategory({ ...newCategory, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., luxury-homes"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Luxury Homes"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Describe this category..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <select
                value={newCategory.color}
                onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {colorOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <button
              onClick={handleAddCategory}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Add Category
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
            const isEditing = editingCategory?.id === category.id;

            return (
              <div key={category.id} className="p-6 hover:bg-gray-50">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                        <input
                          type="text"
                          value={editingCategory.name}
                          onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                        <select
                          value={editingCategory.color}
                          onChange={(e) => setEditingCategory({ ...editingCategory, color: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {colorOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={editingCategory.description}
                          onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={3}
                        />
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveCategory}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
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

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{stats.count}</div>
                        <div className="text-sm text-gray-600">properties</div>
                        <div className="text-sm text-gray-500">{stats.percentage}% of total</div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="text-blue-600 hover:text-blue-800 p-2"
                          title="Edit category"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-600 hover:text-red-800 p-2"
                          title="Delete category"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Progress Bar */}
                {!isEditing && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${stats.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}
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
