'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function PropertyType() {
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPropertyType, setEditingPropertyType] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPropertyType, setNewPropertyType] = useState({
    id: '',
    name: '',
    description: '',
    icon: 'home'
  });

  const iconOptions = [
    { value: 'home', label: '🏠 Home' },
    { value: 'building', label: '🏢 Building' },
    { value: 'building-2', label: '🏗️ Building 2' },
    { value: 'briefcase', label: '💼 Briefcase' },
    { value: 'tree', label: '🌳 Tree' },
    { value: 'help-circle', label: '❓ Other' },
    { value: 'apartment', label: '🏘️ Apartment' },
    { value: 'warehouse', label: '🏭 Warehouse' },
    { value: 'shop', label: '🏪 Shop' },
    { value: 'layers', label: '📚 Layers' }
  ];

  useEffect(() => {
    loadPropertyTypesFromAPI();
    setupEventListeners();
  }, []);

  const setupEventListeners = () => {
    window.addEventListener('storage', () => loadPropertyTypesFromAPI());
    window.addEventListener('focus', () => loadPropertyTypesFromAPI());
    window.addEventListener('propertyTypes:updated', () => loadPropertyTypesFromAPI());

    return () => {
      window.removeEventListener('storage', () => loadPropertyTypesFromAPI());
      window.removeEventListener('focus', () => loadPropertyTypesFromAPI());
      window.removeEventListener('propertyTypes:updated', () => loadPropertyTypesFromAPI());
    };
  };

  const loadPropertyTypesFromAPI = async () => {
    try {
      const response = await fetch('/api/property-types');
      const result = await response.json();

      if (response.ok && result.data) {
        setPropertyTypes(result.data);
        localStorage.setItem('propertyTypes', JSON.stringify(result.data));
      }
    } catch (error) {
      console.error('Error loading property types from API:', error);
      loadPropertyTypesFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadPropertyTypesFromLocalStorage = () => {
    const saved = localStorage.getItem('propertyTypes');
    if (saved) {
      try {
        const savedPropertyTypes = JSON.parse(saved);
        setPropertyTypes(savedPropertyTypes);
      } catch (error) {
        console.error('Error loading property types from storage:', error);
      }
    }
    setLoading(false);
  };

  const savePropertyTypesToStorage = (updatedPropertyTypes) => {
    localStorage.setItem('propertyTypes', JSON.stringify(updatedPropertyTypes));
    window.dispatchEvent(new CustomEvent('propertyTypes:updated'));
  };

  const handleEditPropertyType = (propertyType) => {
    setEditingPropertyType({ ...propertyType });
  };

  const handleSavePropertyType = async () => {
    if (!editingPropertyType.name.trim() || !editingPropertyType.description.trim()) {
      toast.error('Name and description are required');
      return;
    }

    try {
      const response = await fetch(`/api/property-types/${editingPropertyType.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingPropertyType.name,
          description: editingPropertyType.description,
          icon: editingPropertyType.icon
        })
      });

      const result = await response.json();

      if (response.ok) {
        const updatedPropertyTypes = propertyTypes.map(pt =>
          pt.id === editingPropertyType.id ? result.data : pt
        );
        setPropertyTypes(updatedPropertyTypes);
        savePropertyTypesToStorage(updatedPropertyTypes);
        setEditingPropertyType(null);
        toast.success('Property type updated successfully');
      } else {
        toast.error(result.error || 'Failed to update property type');
      }
    } catch (error) {
      console.error('Error updating property type:', error);
      toast.error('An error occurred while updating the property type');
    }
  };

  const handleCancelEdit = () => {
    setEditingPropertyType(null);
  };

  const handleAddPropertyType = async () => {
    if (!newPropertyType.id.trim() || !newPropertyType.name.trim() || !newPropertyType.description.trim()) {
      toast.error('All fields are required');
      return;
    }

    try {
      const response = await fetch('/api/property-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: newPropertyType.id.toLowerCase(),
          name: newPropertyType.name,
          description: newPropertyType.description,
          icon: newPropertyType.icon
        })
      });

      const result = await response.json();

      if (response.ok) {
        const updatedPropertyTypes = [...propertyTypes, result.data];
        setPropertyTypes(updatedPropertyTypes);
        savePropertyTypesToStorage(updatedPropertyTypes);
        setNewPropertyType({ id: '', name: '', description: '', icon: 'home' });
        setShowAddForm(false);
        toast.success('Property type added successfully');
      } else {
        toast.error(result.error || 'Failed to add property type');
      }
    } catch (error) {
      console.error('Error adding property type:', error);
      toast.error('An error occurred while adding the property type');
    }
  };

  const handleDeletePropertyType = async (propertyTypeId, isDefault) => {
    if (isDefault) {
      toast.error('Default property types cannot be deleted');
      return;
    }

    if (window.confirm('Are you sure you want to delete this property type?')) {
      try {
        const response = await fetch(`/api/property-types/${propertyTypeId}`, {
          method: 'DELETE'
        });

        const result = await response.json();

        if (response.ok) {
          const updatedPropertyTypes = propertyTypes.filter(pt => pt.id !== propertyTypeId);
          setPropertyTypes(updatedPropertyTypes);
          savePropertyTypesToStorage(updatedPropertyTypes);
          toast.success('Property type deleted successfully');
        } else {
          toast.error(result.error || 'Failed to delete property type');
        }
      } catch (error) {
        console.error('Error deleting property type:', error);
        toast.error('An error occurred while deleting the property type');
      }
    }
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
            <h1 className="text-3xl font-bold text-gray-900">Property Types</h1>
            <p className="text-gray-600 mt-2">Manage property types available for properties</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Property Type
          </button>
        </div>
      </div>

      {/* Add Property Type Form */}
      {showAddForm && (
        <div className="mb-8 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Property Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Type ID</label>
              <input
                type="text"
                value={newPropertyType.id}
                onChange={(e) => setNewPropertyType({ ...newPropertyType, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., vacation-home"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
              <input
                type="text"
                value={newPropertyType.name}
                onChange={(e) => setNewPropertyType({ ...newPropertyType, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Vacation Home"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newPropertyType.description}
                onChange={(e) => setNewPropertyType({ ...newPropertyType, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Describe this property type..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
              <select
                value={newPropertyType.icon}
                onChange={(e) => setNewPropertyType({ ...newPropertyType, icon: e.target.value })}
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
              onClick={handleAddPropertyType}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Add Property Type
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
              <p className="text-sm font-medium text-gray-600">Total Types</p>
              <p className="text-2xl font-bold text-gray-900">{propertyTypes.length}</p>
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
              <p className="text-sm font-medium text-gray-600">Default Types</p>
              <p className="text-2xl font-bold text-gray-900">{propertyTypes.filter(pt => pt.isDefault).length}</p>
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
              <p className="text-sm font-medium text-gray-600">Custom Types</p>
              <p className="text-2xl font-bold text-gray-900">{propertyTypes.filter(pt => !pt.isDefault).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Property Types List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Property Types</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {propertyTypes.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>No property types found. Add a new property type to get started.</p>
            </div>
          ) : (
            propertyTypes.map((propertyType) => {
              const isEditing = editingPropertyType?.id === propertyType.id;

              return (
                <div key={propertyType.id} className="p-6 hover:bg-gray-50">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                          <input
                            type="text"
                            value={editingPropertyType.name}
                            onChange={(e) => setEditingPropertyType({ ...editingPropertyType, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                          <select
                            value={editingPropertyType.icon}
                            onChange={(e) => setEditingPropertyType({ ...editingPropertyType, icon: e.target.value })}
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
                            value={editingPropertyType.description}
                            onChange={(e) => setEditingPropertyType({ ...editingPropertyType, description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                          />
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSavePropertyType}
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
                        <div className="text-4xl">{getIconLabel(propertyType.icon).split(' ')[0]}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-medium text-gray-900">{propertyType.name}</h3>
                            {propertyType.isDefault && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{propertyType.description}</p>
                          <p className="text-xs text-gray-500 mt-1">ID: {propertyType.id}</p>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditPropertyType(propertyType)}
                          className="text-blue-600 hover:text-blue-800 p-2 transition-colors"
                          title="Edit property type"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeletePropertyType(propertyType.id, propertyType.isDefault)}
                          disabled={propertyType.isDefault}
                          className={`p-2 transition-colors ${
                            propertyType.isDefault
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-red-600 hover:text-red-800'
                          }`}
                          title={propertyType.isDefault ? 'Default property types cannot be deleted' : 'Delete property type'}
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

      {/* Property Type Information */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">All Property Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Default Types</h3>
            <ul className="space-y-2">
              {propertyTypes
                .filter(pt => pt.isDefault)
                .map((propertyType) => (
                  <li key={propertyType.id} className="flex items-center gap-2 text-gray-600">
                    <span>{getIconLabel(propertyType.icon).split(' ')[0]}</span>
                    <span>{propertyType.name}</span>
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Custom Types</h3>
            {propertyTypes.filter(pt => !pt.isDefault).length > 0 ? (
              <ul className="space-y-2">
                {propertyTypes
                  .filter(pt => !pt.isDefault)
                  .map((propertyType) => (
                    <li key={propertyType.id} className="flex items-center gap-2 text-gray-600">
                      <span>{getIconLabel(propertyType.icon).split(' ')[0]}</span>
                      <span>{propertyType.name}</span>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-gray-500">No custom property types yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
