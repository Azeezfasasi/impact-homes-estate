'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function PropertyFeatures() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingFeature, setEditingFeature] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFeature, setNewFeature] = useState({
    id: '',
    name: '',
    description: '',
    category: 'amenities',
    icon: 'star'
  });

  const categoryOptions = [
    { value: 'amenities', label: 'Amenities' },
    { value: 'security', label: 'Security' },
    { value: 'outdoor', label: 'Outdoor' },
    { value: 'indoor', label: 'Indoor' },
    { value: 'utilities', label: 'Utilities' }
  ];

  const iconOptions = [
    { value: 'star', label: '⭐ Star' },
    { value: 'home', label: '🏠 Home' },
    { value: 'droplet', label: '💧 Droplet' },
    { value: 'car', label: '🚗 Car' },
    { value: 'leaf', label: '🍃 Leaf' },
    { value: 'wind', label: '💨 Wind' },
    { value: 'flame', label: '🔥 Flame' },
    { value: 'shield', label: '🛡️ Shield' },
    { value: 'layers', label: '📚 Layers' },
    { value: 'tree', label: '🌳 Tree' },
    { value: 'wifi', label: '📡 WiFi' },
    { value: 'lock', label: '🔒 Lock' }
  ];

  useEffect(() => {
    loadFeaturesFromAPI();
    setupEventListeners();
  }, []);

  const setupEventListeners = () => {
    window.addEventListener('storage', () => loadFeaturesFromAPI());
    window.addEventListener('focus', () => loadFeaturesFromAPI());
    window.addEventListener('propertyFeatures:updated', () => loadFeaturesFromAPI());

    return () => {
      window.removeEventListener('storage', () => loadFeaturesFromAPI());
      window.removeEventListener('focus', () => loadFeaturesFromAPI());
      window.removeEventListener('propertyFeatures:updated', () => loadFeaturesFromAPI());
    };
  };

  const loadFeaturesFromAPI = async () => {
    try {
      const response = await fetch('/api/features');
      const result = await response.json();

      if (response.ok && result.data) {
        setFeatures(result.data);
        localStorage.setItem('propertyFeatures', JSON.stringify(result.data));
      }
    } catch (error) {
      console.error('Error loading features from API:', error);
      loadFeaturesFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadFeaturesFromLocalStorage = () => {
    const saved = localStorage.getItem('propertyFeatures');
    if (saved) {
      try {
        const savedFeatures = JSON.parse(saved);
        setFeatures(savedFeatures);
      } catch (error) {
        console.error('Error loading features from storage:', error);
      }
    }
    setLoading(false);
  };

  const saveFeaturesToStorage = (updatedFeatures) => {
    localStorage.setItem('propertyFeatures', JSON.stringify(updatedFeatures));
    window.dispatchEvent(new CustomEvent('propertyFeatures:updated'));
  };

  const handleEditFeature = (feature) => {
    setEditingFeature({ ...feature });
  };

  const handleSaveFeature = async () => {
    if (!editingFeature.name.trim() || !editingFeature.description.trim()) {
      toast.error('Name and description are required');
      return;
    }

    try {
      const response = await fetch(`/api/features/${editingFeature.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingFeature.name,
          description: editingFeature.description,
          category: editingFeature.category,
          icon: editingFeature.icon
        })
      });

      const result = await response.json();

      if (response.ok) {
        const updatedFeatures = features.map(feat =>
          feat.id === editingFeature.id ? result.data : feat
        );
        setFeatures(updatedFeatures);
        saveFeaturesToStorage(updatedFeatures);
        setEditingFeature(null);
        toast.success('Feature updated successfully');
      } else {
        toast.error(result.error || 'Failed to update feature');
      }
    } catch (error) {
      console.error('Error updating feature:', error);
      toast.error('An error occurred while updating the feature');
    }
  };

  const handleCancelEdit = () => {
    setEditingFeature(null);
  };

  const handleAddFeature = async () => {
    if (!newFeature.id.trim() || !newFeature.name.trim() || !newFeature.description.trim()) {
      toast.error('All fields are required');
      return;
    }

    try {
      const response = await fetch('/api/features', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: newFeature.id.toLowerCase(),
          name: newFeature.name,
          description: newFeature.description,
          category: newFeature.category,
          icon: newFeature.icon
        })
      });

      const result = await response.json();

      if (response.ok) {
        const updatedFeatures = [...features, result.data];
        setFeatures(updatedFeatures);
        saveFeaturesToStorage(updatedFeatures);
        setNewFeature({ id: '', name: '', description: '', category: 'amenities', icon: 'star' });
        setShowAddForm(false);
        toast.success('Feature added successfully');
      } else {
        toast.error(result.error || 'Failed to add feature');
      }
    } catch (error) {
      console.error('Error adding feature:', error);
      toast.error('An error occurred while adding the feature');
    }
  };

  const handleDeleteFeature = async (featureId, isDefault) => {
    if (isDefault) {
      toast.error('Default features cannot be deleted');
      return;
    }

    if (window.confirm('Are you sure you want to delete this feature?')) {
      try {
        const response = await fetch(`/api/features/${featureId}`, {
          method: 'DELETE'
        });

        const result = await response.json();

        if (response.ok) {
          const updatedFeatures = features.filter(feat => feat.id !== featureId);
          setFeatures(updatedFeatures);
          saveFeaturesToStorage(updatedFeatures);
          toast.success('Feature deleted successfully');
        } else {
          toast.error(result.error || 'Failed to delete feature');
        }
      } catch (error) {
        console.error('Error deleting feature:', error);
        toast.error('An error occurred while deleting the feature');
      }
    }
  };

  const getCategoryLabel = (category) => {
    return categoryOptions.find(opt => opt.value === category)?.label || category;
  };

  const getIconLabel = (icon) => {
    return iconOptions.find(opt => opt.value === icon)?.label || icon;
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Property Features</h1>
            <p className="text-gray-600 mt-2">Manage available property features and amenities</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Feature
          </button>
        </div>
      </div>

      {/* Add Feature Form */}
      {showAddForm && (
        <div className="mb-8 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Feature</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Feature ID</label>
              <input
                type="text"
                value={newFeature.id}
                onChange={(e) => setNewFeature({ ...newFeature, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., smart-home"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
              <input
                type="text"
                value={newFeature.name}
                onChange={(e) => setNewFeature({ ...newFeature, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Smart Home"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newFeature.description}
                onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Describe this feature..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={newFeature.category}
                onChange={(e) => setNewFeature({ ...newFeature, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
              <select
                value={newFeature.icon}
                onChange={(e) => setNewFeature({ ...newFeature, icon: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {iconOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <button
              onClick={handleAddFeature}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Add Feature
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Features</p>
              <p className="text-2xl font-bold text-gray-900">{features.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m7-4a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Default Features</p>
              <p className="text-2xl font-bold text-gray-900">{features.filter(f => f.isDefault).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m0 0h6m-6-6v6m0 0h6m0 0h6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Custom Features</p>
              <p className="text-2xl font-bold text-gray-900">{features.filter(f => !f.isDefault).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Feature Catalog</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {features.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>No features found. Add a new feature to get started.</p>
            </div>
          ) : (
            features.map((feature) => {
              const isEditing = editingFeature?.id === feature.id;

              return (
                <div key={feature.id} className="p-6 hover:bg-gray-50">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                          <input
                            type="text"
                            value={editingFeature.name}
                            onChange={(e) => setEditingFeature({ ...editingFeature, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                          <select
                            value={editingFeature.category}
                            onChange={(e) => setEditingFeature({ ...editingFeature, category: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {categoryOptions.map(option => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                          <select
                            value={editingFeature.icon}
                            onChange={(e) => setEditingFeature({ ...editingFeature, icon: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {iconOptions.map(option => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea
                            value={editingFeature.description}
                            onChange={(e) => setEditingFeature({ ...editingFeature, description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                          />
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveFeature}
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
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="text-4xl">{getIconLabel(feature.icon).split(' ')[0]}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-medium text-gray-900">{feature.name}</h3>
                            {feature.isDefault && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Default
                              </span>
                            )}
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {getCategoryLabel(feature.category)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                          <p className="text-xs text-gray-500 mt-1">ID: {feature.id}</p>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditFeature(feature)}
                          className="text-blue-600 hover:text-blue-800 p-2 transition-colors"
                          title="Edit feature"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteFeature(feature.id, feature.isDefault)}
                          disabled={feature.isDefault}
                          className={`p-2 transition-colors ${
                            feature.isDefault
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-red-600 hover:text-red-800'
                          }`}
                          title={feature.isDefault ? 'Default features cannot be deleted' : 'Delete feature'}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Features by Category */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Features by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {categoryOptions.map((category) => {
            const categoryFeatures = features.filter(f => f.category === category.value);
            return (
              <div key={category.value} className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">{category.label}</h3>
                <ul className="space-y-2">
                  {categoryFeatures.length === 0 ? (
                    <li className="text-sm text-gray-500">No features</li>
                  ) : (
                    categoryFeatures.map((feat) => (
                      <li key={feat.id} className="text-sm text-gray-600 flex items-center gap-2">
                        <span>{getIconLabel(feat.icon).split(' ')[0]}</span>
                        <span>{feat.name}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
