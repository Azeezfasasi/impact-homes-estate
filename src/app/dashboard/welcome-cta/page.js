'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Loader, ArrowUp, ArrowDown } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import toast from 'react-hot-toast';

export default function WelcomeCtaManager() {
  const [content, setContent] = useState({
    title: '',
    description: '',
    buttonLabel: '',
    stats: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStatId, setEditingStatId] = useState(null);
  const [statForm, setStatForm] = useState({
    icon: '🚀',
    number: '',
    label: '',
  });

  // Fetch content
  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/welcome-cta');
      const data = await response.json();

      if (data.success && data.data) {
        setContent(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (e) => {
    setContent(prev => ({ ...prev, title: e.target.value }));
  };

  const handleDescriptionChange = (e) => {
    setContent(prev => ({ ...prev, description: e.target.value }));
  };

  const handleButtonLabelChange = (e) => {
    setContent(prev => ({ ...prev, buttonLabel: e.target.value }));
  };

  const handleStatInputChange = (e) => {
    const { name, value } = e.target;
    setStatForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddStat = async (e) => {
    e.preventDefault();

    if (!statForm.number || !statForm.label) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/welcome-cta', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addStat',
          statData: statForm,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Stat added successfully');
        setStatForm({ icon: '🚀', number: '', label: '' });
        setIsFormOpen(false);
        await fetchContent();
      } else {
        toast.error(data.error || 'Failed to add stat');
      }
    } catch (error) {
      toast.error('Failed to add stat');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleEditStat = (stat) => {
    setStatForm({
      icon: stat.icon,
      number: stat.number,
      label: stat.label,
    });
    setEditingStatId(stat._id);
    setIsFormOpen(true);
  };

  const handleUpdateStat = async (e) => {
    e.preventDefault();

    if (!statForm.number || !statForm.label) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/welcome-cta', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateStat',
          statId: editingStatId,
          statData: statForm,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Stat updated successfully');
        setStatForm({ icon: '🚀', number: '', label: '' });
        setEditingStatId(null);
        setIsFormOpen(false);
        await fetchContent();
      } else {
        toast.error(data.error || 'Failed to update stat');
      }
    } catch (error) {
      toast.error('Failed to update stat');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStat = async (statId) => {
    if (!confirm('Are you sure you want to delete this stat?')) return;

    try {
      const response = await fetch('/api/welcome-cta', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deleteStat',
          statId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Stat deleted successfully');
        await fetchContent();
      } else {
        toast.error(data.error || 'Failed to delete stat');
      }
    } catch (error) {
      toast.error('Failed to delete stat');
      console.error(error);
    }
  };

  const handleMoveStat = async (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= content.stats.length) return;

    const newOrder = content.stats.map((s, i) => s._id);
    [newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]];

    try {
      const response = await fetch('/api/welcome-cta', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reorderStats', statIds: newOrder }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchContent();
        toast.success('Stat moved successfully');
      }
    } catch (error) {
      toast.error('Failed to move stat');
    }
  };

  const handleSaveMainContent = async () => {
    if (!content.title || !content.description || !content.buttonLabel) {
      toast.error('Please fill in all fields');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/welcome-cta', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: content.title,
          description: content.description,
          buttonLabel: content.buttonLabel,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Content saved successfully');
        await fetchContent();
      } else {
        toast.error(data.error || 'Failed to save content');
      }
    } catch (error) {
      toast.error('Failed to save content');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingStatId(null);
    setStatForm({ icon: '🚀', number: '', label: '' });
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['admin', 'staff-member']}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader className="w-8 h-8 animate-spin text-impact-gold" />
        </div>
      </ProtectedRoute>
    );
  }

  const sortedStats = [...content.stats].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <ProtectedRoute allowedRoles={['admin', 'staff-member']}>
      <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Welcome CTA Manager</h1>
            <p className="text-gray-600 mt-2">Manage the welcome section and statistics</p>
          </div>

          {/* Main Content Section */}
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Main Content</h2>

            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={content.title}
                  onChange={handleTitleChange}
                  placeholder="e.g., Enjoy Free Investment Advisory Services"
                  className="w-full px-4 py-2.5 border border-impact-gold/70 rounded-lg focus:ring-2 focus:ring-impact-gold focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={content.description}
                  onChange={handleDescriptionChange}
                  placeholder="Enter the description text..."
                  rows="4"
                  className="w-full px-4 py-2.5 border border-impact-gold/70 rounded-lg focus:ring-2 focus:ring-impact-gold focus:border-transparent"
                />
              </div>

              {/* Button Label */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Button Label *
                </label>
                <input
                  type="text"
                  value={content.buttonLabel}
                  onChange={handleButtonLabelChange}
                  placeholder="e.g., Speak with an Investment Advisor"
                  className="w-full px-4 py-2.5 border border-impact-gold/70 rounded-lg focus:ring-2 focus:ring-impact-gold focus:border-transparent"
                />
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveMainContent}
                disabled={saving}
                className="px-6 py-2.5 bg-impact-gold text-white rounded-lg hover:bg-impact-gold/80 font-medium disabled:opacity-50 flex items-center gap-2"
              >
                {saving && <Loader className="w-4 h-4 animate-spin" />}
                Save Changes
              </button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Statistics</h2>
              <button
                onClick={() => setIsFormOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-impact-gold text-white rounded-lg font-medium hover:bg-impact-gold/80 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Stat
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {sortedStats.length === 0 ? (
                <div className="col-span-full bg-gray-50 rounded-lg p-8 text-center">
                  <p className="text-gray-500 mb-4">No statistics created yet</p>
                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-impact-gold text-white rounded-lg hover:bg-impact-gold/80"
                  >
                    <Plus className="w-4 h-4" />
                    Create First Stat
                  </button>
                </div>
              ) : (
                sortedStats.map((stat, index) => (
                  <div
                    key={stat._id}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="text-center mb-3">
                      <div className="text-4xl mb-2">{stat.icon}</div>
                      <h3 className="text-xl font-bold text-gray-900">{stat.number}</h3>
                      <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditStat(stat)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-impact-gold/10 text-impact-gold rounded hover:bg-impact-gold/20 transition-colors text-sm font-medium"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteStat(stat._id)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors text-sm font-medium"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>

                      {/* Move buttons */}
                      {sortedStats.length > 1 && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleMoveStat(index, 'up')}
                            disabled={index === 0}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleMoveStat(index, 'down')}
                            disabled={index === sortedStats.length - 1}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      <div className="text-xs text-gray-500 text-center py-1">
                        #{index + 1}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Form Modal */}
          {isFormOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="border-b border-gray-200 p-4 sm:p-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingStatId ? 'Edit Statistic' : 'Add New Statistic'}
                  </h2>
                  <button
                    onClick={handleCloseForm}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form
                  onSubmit={editingStatId ? handleUpdateStat : handleAddStat}
                  className="p-4 sm:p-6 space-y-4"
                >
                  {/* Icon */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Icon
                    </label>
                    <input
                      type="text"
                      name="icon"
                      value={statForm.icon}
                      onChange={handleStatInputChange}
                      placeholder="e.g., 🚀"
                      maxLength="2"
                      className="w-full px-4 py-2.5 border border-impact-gold/70 rounded-lg focus:ring-2 focus:ring-impact-gold focus:border-transparent text-lg"
                    />
                  </div>

                  {/* Number */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Number *
                    </label>
                    <input
                      type="text"
                      name="number"
                      value={statForm.number}
                      onChange={handleStatInputChange}
                      placeholder="e.g., 1000+"
                      className="w-full px-4 py-2.5 border border-impact-gold/70 rounded-lg focus:ring-2 focus:ring-impact-gold focus:border-transparent"
                    />
                  </div>

                  {/* Label */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Label *
                    </label>
                    <input
                      type="text"
                      name="label"
                      value={statForm.label}
                      onChange={handleStatInputChange}
                      placeholder="e.g., Homes delivered"
                      className="w-full px-4 py-2.5 border border-impact-gold/70 rounded-lg focus:ring-2 focus:ring-impact-gold focus:border-transparent"
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleCloseForm}
                      disabled={saving}
                      className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 px-4 py-2.5 bg-impact-gold text-white rounded-lg hover:bg-impact-gold/80 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {saving && <Loader className="w-4 h-4 animate-spin" />}
                      {editingStatId ? 'Update' : 'Add'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
