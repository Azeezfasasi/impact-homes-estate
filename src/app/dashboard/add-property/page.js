'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { usePropertyCategories } from '../hooks/usePropertyCategories';
import { usePropertyStatuses } from '../hooks/usePropertyStatuses';
import { usePropertyFeatures } from '../hooks/usePropertyFeatures';
import { usePropertyTypes } from '../hooks/usePropertyTypes';

export default function AddProperty() {
  const router = useRouter();
  const { categories, loading: categoriesLoading } = usePropertyCategories();
  const { statuses, loading: statusesLoading } = usePropertyStatuses();
  const { features, loading: featuresLoading } = usePropertyFeatures();
  const { propertyTypes, loading: propertyTypesLoading } = usePropertyTypes();
  const [loading, setLoading] = useState(false);
  const [uploadingFeaturedImage, setUploadingFeaturedImage] = useState(false);
  const [uploadingPropertyImages, setUploadingPropertyImages] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    propertyType: 'house',
    status: 'available',
    category: 'residential',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Nigeria'
    },
    bedrooms: '',
    bathrooms: '',
    squareFootage: '',
    lotSize: '',
    yearBuilt: '',
    features: [],
    agent: {
      name: '',
      email: '',
      phone: ''
    },
    isFeatured: false,
    featuredImage: null,
    images: []
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleFeatureToggle = (featureId) => {
    setFormData(prev => {
      const isSelected = prev.features.includes(featureId);
      return {
        ...prev,
        features: isSelected
          ? prev.features.filter(f => f !== featureId)
          : [...prev.features, featureId]
      };
    });
  };

  const handleFeaturedImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    setUploadingFeaturedImage(true);
    try {
      const base64String = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileData: base64String,
          folderName: 'estate/featured-images'
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setFormData(prev => ({
        ...prev,
        featuredImage: {
          url: data.data.url,
          publicId: data.data.publicId,
          alt: 'Featured image'
        }
      }));
      
      toast.success('Featured image uploaded successfully');
    } catch (error) {
      console.error('Error uploading featured image:', error);
      toast.error('Failed to upload featured image');
    } finally {
      setUploadingFeaturedImage(false);
    }
  };

  const handlePropertyImagesUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingPropertyImages(true);
    try {
      const uploadedImages = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (!file.type.startsWith('image/')) {
          toast.error(`File ${file.name} is not a valid image`);
          continue;
        }

        const base64String = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const response = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileData: base64String,
            folderName: 'estate/property-images'
          })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        
        uploadedImages.push({
          url: data.data.url,
          publicId: data.data.publicId,
          alt: `Property image ${i + 1}`,
          isMain: uploadedImages.length === 0 && formData.images.length === 0
        });
      }

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedImages]
      }));

      toast.success(`${uploadedImages.length} image(s) uploaded successfully`);
    } catch (error) {
      console.error('Error uploading property images:', error);
      toast.error('Failed to upload one or more images');
    } finally {
      setUploadingPropertyImages(false);
    }
  };

  const removePropertyImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const removeFeaturedImage = () => {
    setFormData(prev => ({
      ...prev,
      featuredImage: null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      const requiredFields = ['title', 'description', 'propertyType', 'status', 'category'];
      const missingFields = requiredFields.filter(field => !formData[field]);

      if (missingFields.length > 0) {
        toast.error(`Please fill in: ${missingFields.join(', ')}`);
        return;
      }

      // Validate address
      // const addressFields = ['street', 'city', 'state', 'zipCode'];
      // const missingAddress = addressFields.filter(field => !formData.address[field]);

      // if (missingAddress.length > 0) {
      //   toast.error(`Please fill in address: ${missingAddress.join(', ')}`);
      //   return;
      // }

      // Validate agent info
      // const agentFields = ['name', 'email', 'phone'];
      // const missingAgent = agentFields.filter(field => !formData.agent[field]);

      // if (missingAgent.length > 0) {
      //   toast.error(`Please fill in agent info: ${missingAgent.join(', ')}`);
      //   return;
      // }

      // Convert string numbers to numbers
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : 0,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : 0,
        squareFootage: formData.squareFootage ? parseInt(formData.squareFootage) : undefined,
        lotSize: formData.lotSize ? parseInt(formData.lotSize) : undefined,
        yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : undefined
      };

      // Combine featured image and property images into single images array
      const combinedImages = [];
      if (submitData.featuredImage) {
        combinedImages.push({
          ...submitData.featuredImage,
          isMain: true
        });
      }
      if (submitData.images && submitData.images.length > 0) {
        combinedImages.push(...submitData.images.map(img => ({
          ...img,
          isMain: false
        })));
      }

      // Update submitData with combined images
      submitData.images = combinedImages;
      delete submitData.featuredImage;

      const response = await fetch('/api/property', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Property added successfully!');
        router.push('/dashboard/all-property');
      } else {
        toast.error(result.error || 'Failed to add property');
        if (result.errors) {
          result.errors.forEach(error => toast.error(error));
        }
      }
    } catch (error) {
      console.error('Error adding property:', error);
      toast.error('An error occurred while adding the property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-0 md:p-6">
      <div className="mb-8">
        <h1 className="text-[20px] md:2xl font-bold text-gray-900">Add New Property</h1>
        <p className="text-gray-600 mt-2">Fill in the details to add a new property to your portfolio</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-impact-gold/70 rounded-md focus:outline-none focus:ring-2 focus:ring-impact-gold"
                placeholder="e.g., Modern 3BR House in Downtown"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price
              </label>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2 font-bold">₦</span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-impact-gold/70 rounded-md focus:outline-none focus:ring-2 focus:ring-impact-gold"
                  placeholder="e.g., 250000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type * <span className="text-xs text-impact-gold">{propertyTypesLoading ? '(Loading...)' : ''}</span>
              </label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-impact-gold/70 rounded-md focus:outline-none focus:ring-2 focus:ring-impact-gold"
                required
              >
                <option value="">-- Select Property Type --</option>
                {propertyTypes.map(type => (
                  <option key={type._id} value={type.name}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status * <span className="text-xs text-impact-gold">{statusesLoading ? '(Loading...)' : ''}</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border-2 border-impact-gold/40 rounded-md focus:outline-none focus:ring-2 focus:ring-impact-gold bg-white font-medium"
                required
              >
                <option value="">-- Select Status --</option>
                {statuses.map(stat => (
                  <option key={stat._id} value={stat.name}>
                    {stat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category * <span className="text-xs text-impact-gold">(Required)</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border-2 border-impact-gold/40 rounded-md focus:outline-none focus:ring-2 focus:ring-impact-gold bg-white font-medium"
                required
              >
                <option value="">-- Select Category --</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex flex-col">
                <label className="block text-sm font-semibold text-gray-900">
                  ⭐ Featured Property
                </label>
                <p className="text-xs text-gray-600 mt-1">Mark this property as featured for increased visibility</p>
              </div>
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleInputChange}
                className="h-5 w-5 text-amber-600 focus:ring-amber-500 border-amber-300 rounded cursor-pointer"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-impact-gold/70 rounded-md focus:outline-none focus:ring-2 focus:ring-impact-gold"
              placeholder="Detailed description of the property..."
            />
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Address Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address
              </label>
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-impact-gold/70 rounded-md focus:outline-none focus:ring-2 focus:ring-impact-gold"
                placeholder="123 Main Street"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-impact-gold/70 rounded-md focus:outline-none focus:ring-2 focus:ring-impact-gold"
                placeholder="Abuja"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                name="address.state"
                value={formData.address.state}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-impact-gold/70 rounded-md focus:outline-none focus:ring-2 focus:ring-impact-gold"
                placeholder="Nigeria"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zip Code
              </label>
              <input
                type="text"
                name="address.zipCode"
                value={formData.address.zipCode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-impact-gold/70 rounded-md focus:outline-none focus:ring-2 focus:ring-impact-gold"
                placeholder="10001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                type="text"
                name="address.country"
                value={formData.address.country}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-impact-gold/70 rounded-md focus:outline-none focus:ring-2 focus:ring-impact-gold"
                placeholder="Nigeria"
              />
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Property Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms
              </label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-impact-gold/70 rounded-md focus:outline-none focus:ring-2 focus:ring-impact-gold"
                placeholder="3"
                // min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bathrooms
              </label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-impact-gold/70 rounded-md focus:outline-none focus:ring-2 focus:ring-impact-gold"
                placeholder="2"
                // min="0"
                // step="0.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Square Footage
              </label>
              <input
                type="number"
                name="squareFootage"
                value={formData.squareFootage}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-impact-gold/70 rounded-md focus:outline-none focus:ring-2 focus:ring-impact-gold"
                // placeholder="2000"
                // min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lot Size (sq ft)
              </label>
              <input
                type="number"
                name="lotSize"
                value={formData.lotSize}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-impact-gold/70 rounded-md focus:outline-none focus:ring-2 focus:ring-impact-gold"
                // placeholder="5000"
                // min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year Built
              </label>
              <input
                type="number"
                name="yearBuilt"
                value={formData.yearBuilt}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-impact-gold/70 rounded-md focus:outline-none focus:ring-2 focus:ring-impact-gold"
                placeholder="2020"
                min="1800"
                max={new Date().getFullYear() + 1}
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Property Features</h2>
          {featuresLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-impact-gold"></div>
            </div>
          ) : features.length > 0 ? (
            <div className="space-y-4">
              {['amenities', 'security', 'outdoor', 'indoor', 'utilities'].map(category => {
                const categoryFeatures = features.filter(f => f.category === category);
                if (categoryFeatures.length === 0) return null;

                const categoryLabel = {
                  amenities: 'Amenities',
                  security: 'Security',
                  outdoor: 'Outdoor',
                  indoor: 'Indoor',
                  utilities: 'Utilities'
                }[category];

                return (
                  <div key={category}>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b">{categoryLabel}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {categoryFeatures.map(feature => (
                        <label key={feature.id} className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            checked={formData.features.includes(feature.id)}
                            onChange={() => handleFeatureToggle(feature.id)}
                            className="h-4 w-4 text-impact-gold border-gray-300 rounded focus:ring-impact-gold cursor-pointer"
                          />
                          <div className="ml-3 flex-1">
                            <div className="text-sm font-medium text-gray-900">{feature.name}</div>
                            <div className="text-xs text-gray-600">{feature.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No features available</p>
          )}
        </div>

        {/* Agent Information */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Agent Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agent Name
              </label>
              <input
                type="text"
                name="agent.name"
                value={formData.agent.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-impact-gold/70 rounded-md focus:outline-none focus:ring-2 focus:ring-impact-gold"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agent Email
              </label>
              <input
                type="email"
                name="agent.email"
                value={formData.agent.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-impact-gold/70 rounded-md focus:outline-none focus:ring-2 focus:ring-impact-gold"
                placeholder="john@example.com"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agent Phone
              </label>
              <input
                type="tel"
                name="agent.phone"
                value={formData.agent.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-impact-gold/70 rounded-md focus:outline-none focus:ring-2 focus:ring-impact-gold"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Featured Image</h2>
          <div className="space-y-4">
            {formData.featuredImage ? (
              <div className="relative w-full max-w-md">
                <img
                  src={formData.featuredImage.url}
                  alt="Featured"
                  className="w-full h-64 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={removeFeaturedImage}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-impact-gold/80 rounded-lg p-12 hover:border-impact-gold hover:bg-impact-gold/20 transition-colors cursor-pointer">
                <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-gray-600">
                  {uploadingFeaturedImage ? 'Uploading featured image...' : 'Click to upload featured image'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFeaturedImageUpload}
                  disabled={uploadingFeaturedImage}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Property Images */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Property Images</h2>
          <div className="space-y-4">
            {formData.images.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removePropertyImage(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-impact-gold/80 rounded-lg p-12 hover:border-impact-gold hover:bg-impact-gold/20 transition-colors cursor-pointer">
              <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm text-gray-600">
                {uploadingPropertyImages ? 'Uploading images...' : 'Click to add more property images (multiple files)'}
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePropertyImagesUpload}
                disabled={uploadingPropertyImages}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-500">
              {formData.images.length === 0 
                ? 'No images added yet' 
                : `${formData.images.length} image(s) added`}
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-impact-gold text-white rounded-md hover:bg-impact-gold/80 focus:outline-none focus:ring-2 focus:ring-impact-gold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding Property...' : 'Add Property'}
          </button>
        </div>
      </form>
    </div>
  );
}
