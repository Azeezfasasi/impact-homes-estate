'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Loader,
  Upload,
} from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { uploadImageToCloudinary, deleteImageFromCloudinary } from '@/app/utils/galleryApi';

const OfferForm = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState(
    initialData || {
      title: '',
      description: '',
      imageUrl: '',
      imagePublicId: '',
      projectLocation: '',
      startDate: '',
      endDate: '',
      discountPercentage: 0,
      offerDetails: '',
      isActive: true,
      featured: false,
    }
  );
  const [imagePreview, setImagePreview] = useState(initialData?.imageUrl || '');
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const result = await uploadImageToCloudinary(file);
      setFormData((prev) => ({
        ...prev,
        imageUrl: result.url,
        imagePublicId: result.publicId,
      }));
      setImagePreview(result.url);
      toast.success('Image uploaded');
    } catch (error) {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.imageUrl) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast.error('End date must be after start date');
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {initialData ? 'Edit Special Offer' : 'Add Special Offer'}
          </h2>
          <button onClick={onCancel} className="text-gray-600 hover:text-gray-900">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Offer Image *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              {imagePreview ? (
                <div className="relative h-48 mb-4">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover rounded"
                  />
                </div>
              ) : null}
              <label className="flex items-center justify-center gap-2 cursor-pointer">
                <Upload size={20} className="text-gray-600" />
                <span className="text-gray-600">
                  {uploading ? 'Uploading...' : 'Click to upload image'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Offer Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Grey Residence"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-impact-gold focus:border-transparent"
            />
          </div>

          {/* Project Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Location
            </label>
            <input
              type="text"
              name="projectLocation"
              value={formData.projectLocation}
              onChange={handleInputChange}
              placeholder="e.g., Abuja, Nigeria"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-impact-gold focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the special offer..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-impact-gold focus:border-transparent"
            />
          </div>

          {/* Offer Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Details
            </label>
            <textarea
              name="offerDetails"
              value={formData.offerDetails}
              onChange={handleInputChange}
              placeholder="Additional offer details..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-impact-gold focus:border-transparent"
            />
          </div>

          {/* Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Percentage
              </label>
              <input
                type="number"
                name="discountPercentage"
                value={formData.discountPercentage}
                onChange={handleInputChange}
                min="0"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-impact-gold focus:border-transparent"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-impact-gold focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-impact-gold focus:border-transparent"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="w-5 h-5 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Active</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="w-5 h-5 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Featured</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-impact-gold hover:bg-impact-gold/90 disabled:bg-gray-400 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <Loader size={18} className="animate-spin" />
              ) : null}
              {initialData ? 'Update Offer' : 'Create Offer'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

function ManageSpecialOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/special-offers', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (data.success) {
        setOffers(data.offers || []);
      } else {
        toast.error('Failed to fetch offers');
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
      toast.error('Error fetching offers');
    } finally {
      setLoading(false);
    }
  };

  const handleAddOffer = async (formData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/special-offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Offer created successfully');
        setShowForm(false);
        fetchOffers();
      } else {
        toast.error('Failed to create offer');
      }
    } catch (error) {
      console.error('Error creating offer:', error);
      toast.error('Error creating offer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditOffer = async (formData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/special-offers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingOffer._id,
          ...formData,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Offer updated successfully');
        setEditingOffer(null);
        fetchOffers();
      } else {
        toast.error('Failed to update offer');
      }
    } catch (error) {
      console.error('Error updating offer:', error);
      toast.error('Error updating offer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteOffer = async (id, imagePublicId) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) {
      return;
    }

    try {
      // Delete from Cloudinary
      if (imagePublicId) {
        await deleteImageFromCloudinary(imagePublicId);
      }

      // Delete from database
      const response = await fetch(`/api/special-offers?id=${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Offer deleted');
        setOffers(offers.filter((offer) => offer._id !== id));
      } else {
        toast.error('Failed to delete offer');
      }
    } catch (error) {
      console.error('Error deleting offer:', error);
      toast.error('Error deleting offer');
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row gap-2 md:gap-0 md:justify-between md:items-center mb-8">
        <h1 className="text-[20px] md:text-3xl font-bold text-center md:text-left">Manage Special Offers</h1>
        <button
          onClick={() => {
            setEditingOffer(null);
            setShowForm(true);
          }}
          className="bg-impact-gold hover:bg-impact-gold/90 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2r"
        >
          <Plus size={20} />
          Add New Offer
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-12 flex items-center justify-center">
          <Loader size={32} className="text-impact-gold animate-spin" />
        </div>
      ) : offers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-600 text-lg">No special offers yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div
              key={offer._id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 bg-gray-200">
                {offer.imageUrl && (
                  <Image
                    src={offer.imageUrl}
                    alt={offer.title}
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      offer.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {offer.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {offer.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {offer.projectLocation}
                </p>

                {offer.discountPercentage > 0 && (
                  <p className="text-impact-gold font-semibold mb-2">
                    {offer.discountPercentage}% Off
                  </p>
                )}

                <p className="text-sm text-gray-700 line-clamp-2 mb-4">
                  {offer.description}
                </p>

                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  {offer.endDate && (
                    <span>
                      Ends:{' '}
                      {new Date(offer.endDate).toLocaleDateString('en-NG')}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingOffer(offer);
                      setShowForm(true);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteOffer(offer._id, offer.imagePublicId)
                    }
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(showForm || editingOffer) && (
        <OfferForm
          initialData={editingOffer}
          onSubmit={editingOffer ? handleEditOffer : handleAddOffer}
          onCancel={() => {
            setShowForm(false);
            setEditingOffer(null);
          }}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}

export default function Page() {
  return (
    <ProtectedRoute requiredRoles={['admin', 'staff-member']}>
      <ManageSpecialOffers />
    </ProtectedRoute>
  );
}
