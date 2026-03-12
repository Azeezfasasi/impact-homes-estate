'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function PropertyStatuses() {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStatus, setEditingStatus] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStatus, setNewStatus] = useState({
    id: '',
    name: '',
    description: '',
    color: '#6366f1'
  });

  useEffect(() => {
    loadStatusesFromAPI();
    setupEventListeners();
  }, []);

  const setupEventListeners = () => {
    // Listen for storage changes (cross-tab sync)
    window.addEventListener('storage', () => loadStatusesFromAPI());
    // Listen for window focus
    window.addEventListener('focus', () => loadStatusesFromAPI());
    // Listen for custom status update event
    window.addEventListener('propertyStatuses:updated', () => loadStatusesFromAPI());

    return () => {
      window.removeEventListener('storage', () => loadStatusesFromAPI());
      window.removeEventListener('focus', () => loadStatusesFromAPI());
      window.removeEventListener('propertyStatuses:updated', () => loadStatusesFromAPI());
    };
  };

  const loadStatusesFromAPI = async () => {
    try {
      const response = await fetch('/api/statuses');
      const result = await response.json();

      if (response.ok && result.data) {
        setStatuses(result.data);
        localStorage.setItem('propertyStatuses', JSON.stringify(result.data));
      }
    } catch (error) {
      console.error('Error loading statuses from API:', error);
      loadStatusesFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadStatusesFromLocalStorage = () => {
    const saved = localStorage.getItem('propertyStatuses');
    if (saved) {
      try {
        const savedStatuses = JSON.parse(saved);
        setStatuses(savedStatuses);
      } catch (error) {
        console.error('Error loading statuses from storage:', error);
      }
    }
    setLoading(false);
  };

  const saveStatusesToStorage = (updatedStatuses) => {
    localStorage.setItem('propertyStatuses', JSON.stringify(updatedStatuses));
    window.dispatchEvent(new CustomEvent('propertyStatuses:updated'));
  };

  const handleEditStatus = (status) => {
    setEditingStatus({ ...status });
  };

  const handleSaveStatus = async () => {
    if (!editingStatus.name.trim() || !editingStatus.description.trim()) {
      toast.error('Name and description are required');
      return;
    }

    try {
      const response = await fetch(`/api/statuses/${editingStatus.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingStatus.name,
          description: editingStatus.description,
          color: editingStatus.color
        })
      });

      const result = await response.json();

      if (response.ok) {
        const updatedStatuses = statuses.map(stat =>
          stat.id === editingStatus.id ? result.data : stat
        );
        setStatuses(updatedStatuses);
        saveStatusesToStorage(updatedStatuses);
        setEditingStatus(null);
        toast.success('Status updated successfully');
      } else {
        toast.error(result.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('An error occurred while updating the status');
    }
  };

  const handleCancelEdit = () => {
    setEditingStatus(null);
  };

  const handleAddStatus = async () => {
    if (!newStatus.id.trim() || !newStatus.name.trim() || !newStatus.description.trim()) {
      toast.error('All fields are required');
      return;
    }

    try {
      const response = await fetch('/api/statuses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: newStatus.id.toLowerCase(),
          name: newStatus.name,
          description: newStatus.description,
          color: newStatus.color
        })
      });

      const result = await response.json();

      if (response.ok) {
        const updatedStatuses = [...statuses, result.data];
        setStatuses(updatedStatuses);
        saveStatusesToStorage(updatedStatuses);
        setNewStatus({ id: '', name: '', description: '', color: '#6366f1' });
        setShowAddForm(false);
        toast.success('Status added successfully');
      } else {
        toast.error(result.error || 'Failed to add status');
      }
    } catch (error) {
      console.error('Error adding status:', error);
      toast.error('An error occurred while adding the status');
    }
  };

  const handleDeleteStatus = async (statusId, isDefault) => {
    if (isDefault) {
      toast.error('Default statuses cannot be deleted');
      return;
    }

    if (window.confirm('Are you sure you want to delete this status?')) {
      try {
        const response = await fetch(`/api/statuses/${statusId}`, {
          method: 'DELETE'
        });

        const result = await response.json();

        if (response.ok) {
          const updatedStatuses = statuses.filter(stat => stat.id !== statusId);
          setStatuses(updatedStatuses);
          saveStatusesToStorage(updatedStatuses);
          toast.success('Status deleted successfully');
        } else {
          toast.error(result.error || 'Failed to delete status');
        }
      } catch (error) {
        console.error('Error deleting status:', error);
        toast.error('An error occurred while deleting the status');
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-impact-gold"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Property Statuses</h1>
            <p className="text-gray-600 mt-2 text-xs sm:text-sm md:text-base">Manage property status types and values</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full sm:w-[20%] bg-impact-gold text-white px-4 py-2 rounded-lg hover:bg-impact-gold/80 transition-colors text-sm font-medium"
          >
            Add Status
          </button>
        </div>
      </div>

      {/* Add Status Form */}
      {showAddForm && (
        <div className="mb-8 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status ID</label>
              <input
                type="text"
                value={newStatus.id}
                onChange={(e) => setNewStatus({ ...newStatus, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                className="w-full px-3 py-2 border border-impact-gold/70 rounded-md focus:outline-none focus:ring-2 focus:ring-impact-gold"
                placeholder="e.g., under-offer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
              <input
                type="text"
                value={newStatus.name}
                onChange={(e) => setNewStatus({ ...newStatus, name: e.target.value })}
                className="w-full px-3 py-2 border border-impact-gold/70 rounded-md focus:outline-none focus:ring-2 focus:ring-impact-gold"
                placeholder="e.g., Under Offer"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newStatus.description}
                onChange={(e) => setNewStatus({ ...newStatus, description: e.target.value })}
                className="w-full px-3 py-2 border border-impact-gold/70 rounded-md focus:outline-none focus:ring-2 focus:ring-impact-gold"
                rows={3}
                placeholder="Describe this status..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color (Hex)</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={newStatus.color}
                  onChange={(e) => setNewStatus({ ...newStatus, color: e.target.value })}
                  className="w-16 h-10 border border-gray-300 rounded-md cursor-pointer"
                />
                <input
                  type="text"
                  value={newStatus.color}
                  onChange={(e) => setNewStatus({ ...newStatus, color: e.target.value })}
                  className="flex-1 px-3 py-2 border border-impact-gold/70 rounded-md focus:outline-none focus:ring-2 focus:ring-impact-gold"
                  placeholder="#6366f1"
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <button
              onClick={handleAddStatus}
              className="bg-impact-gold text-white px-4 py-2 rounded-lg hover:bg-impact-gold/80 transition-colors"
            >
              Add Status
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

      {/* Summary Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-3 sm:p-4 md:p-6">
          <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
            <div className="p-2 sm:p-2 md:p-3 bg-impact-gold/10 rounded-full flex-shrink-0 mt-1">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-impact-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m7-4a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Total Statuses</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{statuses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-3 sm:p-4 md:p-6">
          <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
            <div className="p-2 sm:p-2 md:p-3 bg-green-100 rounded-full flex-shrink-0 mt-1">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Default Statuses</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{statuses.filter(s => s.isDefault).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-3 sm:p-4 md:p-6">
          <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
            <div className="p-2 sm:p-2 md:p-3 bg-purple-100 rounded-full flex-shrink-0 mt-1">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m0 0h6m-6-6v6m0 0h6m0 0h6" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Custom Statuses</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{statuses.filter(s => !s.isDefault).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-gray-200">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">Status Details</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {statuses.length === 0 ? (
            <div className="p-4 sm:p-6 text-center text-gray-500">
              <p className="text-sm sm:text-base">No statuses found. Add a new status to get started.</p>
            </div>
          ) : (
            statuses.map((status) => {
              const isEditing = editingStatus?.id === status.id;

              return (
                <div key={status.id} className="p-3 sm:p-4 md:p-6 hover:bg-gray-50">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                          <input
                            type="text"
                            value={editingStatus.name}
                            onChange={(e) => setEditingStatus({ ...editingStatus, name: e.target.value })}
                            className="w-full px-3 py-2 border border-impact-gold/70 rounded-md focus:outline-none focus:ring-2 focus:ring-impact-gold"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Color (Hex)</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={editingStatus.color}
                              onChange={(e) => setEditingStatus({ ...editingStatus, color: e.target.value })}
                              className="w-16 h-10 border border-impact-gold/70 rounded-md cursor-pointer"
                            />
                            <input
                              type="text"
                              value={editingStatus.color}
                              onChange={(e) => setEditingStatus({ ...editingStatus, color: e.target.value })}
                              className="flex-1 px-3 py-2 border border-impact-gold/70 rounded-md focus:outline-none focus:ring-2 focus:ring-impact-gold"
                            />
                          </div>
                        </div>
                        <div className="col-span-full md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea
                            value={editingStatus.description}
                            onChange={(e) => setEditingStatus({ ...editingStatus, description: e.target.value })}
                            className="w-full px-3 py-2 border border-impact-gold/70 rounded-md focus:outline-none focus:ring-2 focus:ring-impact-gold"
                            rows={3}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveStatus}
                          className="bg-impact-gold text-white px-4 py-2 rounded-lg hover:bg-impact-gold/80 transition-colors"
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
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <div
                          className="w-12 h-12 rounded-lg border-2 flex-shrink-0"
                          style={{
                            backgroundColor: status.color,
                            borderColor: status.color
                          }}
                        ></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm sm:text-base md:text-lg font-medium text-gray-900">{status.name}</h3>
                            {status.isDefault && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">{status.description}</p>
                          <p className="text-xs text-gray-500 mt-1">ID: {status.id}</p>
                        </div>
                      </div>

                      <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleEditStatus(status)}
                          className="text-impact-gold hover:text-impact-gold/80 p-2 transition-colors flex-shrink-0"
                          title="Edit status"
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteStatus(status.id, status.isDefault)}
                          disabled={status.isDefault}
                          className={`p-2 transition-colors flex-shrink-0 ${
                            status.isDefault
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-red-600 hover:text-red-800'
                          }`}
                          title={status.isDefault ? 'Default statuses cannot be deleted' : 'Delete status'}
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Status Insights */}
      <div className="mt-6 sm:mt-8 bg-white rounded-lg shadow-sm border p-3 sm:p-4 md:p-6">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-4">Status Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <h3 className="text-sm sm:text-base md:text-lg font-medium text-gray-900 mb-3">Default Statuses</h3>
            <ul className="space-y-2">
              {statuses
                .filter(s => s.isDefault)
                .map((status) => (
                  <li key={status.id} className="flex items-center justify-between text-gray-600">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: status.color }}
                      ></div>
                      <span>{status.name}</span>
                    </div>
                  </li>
                )) || (
                <li className="text-gray-500">No default statuses</li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Custom Statuses</h3>
            <ul className="space-y-2">
              {statuses
                .filter(s => !s.isDefault)
                .map((status) => (
                  <li key={status.id} className="flex items-center justify-between text-gray-600">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: status.color }}
                      ></div>
                      <span>{status.name}</span>
                    </div>
                  </li>
                )) || (
                <li className="text-gray-500">No custom statuses yet</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
