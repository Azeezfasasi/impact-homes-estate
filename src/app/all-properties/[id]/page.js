'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import MainNav from '@/components/home-component/MainNav'

export default function PropertyDetail() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id;

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    fetchProperty();
  }, [propertyId]);

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/property/${propertyId}`);
      const result = await response.json();
      if (result.data) {
        setProperty(result.data);
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error('Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    // Add your contact API call here
    toast.success('Message sent successfully! Agent will contact you soon.');
    setContactForm({ name: '', email: '', phone: '', message: '' });
    setShowContactForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Property not found</p>
          <Link href="/all-properties" className="text-blue-600 hover:underline">
            Back to all properties
          </Link>
        </div>
      </div>
    );
  }

  const images = property.images || [];
  const currentImage = images[selectedImageIndex];
  const featuredImage = images.find(img => img.isMain);
  
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'All Properties', href: '/all-properties' },
    { label: property.title },
  ];

  return (
    <>
    <MainNav
        title={property.title}
        breadcrumbs={breadcrumbs}
    />
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <div className="flex gap-3">
            {property.isFeatured && (
              <span className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded">
                ⭐ Featured
              </span>
            )}
            <span className={`px-3 py-1 rounded text-sm font-semibold capitalize text-white ${
              property.status === 'available'
                ? 'bg-green-600'
                : property.status === 'sold'
                ? 'bg-red-600'
                : 'bg-gray-600'
            }`}>
              {property.status}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Gallery Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Image */}
          <div className="lg:col-span-2">
            <div className="relative bg-gray-900 rounded-xl overflow-hidden h-96 md:h-[500px]">
              {currentImage ? (
                <img
                  src={currentImage.url}
                  alt="Property"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex(prev => (prev - 1 + images.length) % images.length)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur text-white p-2 rounded-full transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex(prev => (prev + 1) % images.length)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur text-white p-2 rounded-full transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImageIndex + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === selectedImageIndex ? 'border-blue-600' : 'border-gray-300'
                    }`}
                  >
                    <img src={image.url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Info & Contact */}
          <div>
            {/* Price Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-4">
              <p className="text-gray-600 text-sm mb-1">Price</p>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                ₦{property.price?.toLocaleString()}
              </h2>

              {/* Key Features */}
              <div className="space-y-3 mb-6 py-4 border-t border-b">
                {property.bedrooms > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center gap-2">
                      <span className="text-2xl">🛏️</span> Bedrooms
                    </span>
                    <span className="font-semibold">{property.bedrooms}</span>
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center gap-2">
                      <span className="text-2xl">🚿</span> Bathrooms
                    </span>
                    <span className="font-semibold">{property.bathrooms}</span>
                  </div>
                )}
                {property.squareFootage && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center gap-2">
                      <span className="text-2xl">📐</span> Sq. Footage
                    </span>
                    <span className="font-semibold">{property.squareFootage.toLocaleString()}</span>
                  </div>
                )}
                {property.yearBuilt && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center gap-2">
                      <span className="text-2xl">🏗️</span> Year Built
                    </span>
                    <span className="font-semibold">{property.yearBuilt}</span>
                  </div>
                )}
              </div>

              {/* CTA Buttons */}
              <button
                onClick={() => setShowContactForm(!showContactForm)}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold mb-2"
              >
                Contact Agent
              </button>
              <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                Schedule Tour
              </button>
            </div>

            {/* Agent Info */}
            {property.agent && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Agent Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Agent Name</p>
                    <p className="font-semibold text-gray-900">{property.agent.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <a href={`mailto:${property.agent.email}`} className="text-blue-600 hover:underline">
                      {property.agent.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <a href={`tel:${property.agent.phone}`} className="text-blue-600 hover:underline">
                      {property.agent.phone}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact Form Modal */}
        {showContactForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Agent</h2>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="tel"
                  placeholder="Your Phone"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <textarea
                  placeholder="Your Message..."
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Property Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{property.title}</h2>
              <p className="text-gray-600 text-lg leading-relaxed">{property.description}</p>
            </div>

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                      <span>✓</span>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Address Details */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Location</h3>
              <div className="space-y-2 text-gray-600">
                <p><span className="font-semibold">Street:</span> {property.address?.street}</p>
                <p><span className="font-semibold">City:</span> {property.address?.city}</p>
                <p><span className="font-semibold">State:</span> {property.address?.state}</p>
                <p><span className="font-semibold">Zip Code:</span> {property.address?.zipCode}</p>
                <p><span className="font-semibold">Country:</span> {property.address?.country}</p>
              </div>
            </div>
          </div>

          {/* Sidebar - Additional Info */}
          <div>
            {/* Property Type & Category */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Property Info</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-semibold text-gray-900 capitalize">{property.propertyType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-semibold text-gray-900 capitalize">{property.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-semibold text-gray-900 capitalize">{property.status}</p>
                </div>
                {property.yearBuilt && (
                  <div>
                    <p className="text-sm text-gray-600">Year Built</p>
                    <p className="font-semibold text-gray-900">{property.yearBuilt}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Share Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Share</h3>
              <div className="flex gap-3">
                <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold">
                  Facebook
                </button>
                <button className="flex-1 px-3 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 text-sm font-semibold">
                  Twitter
                </button>
                <button className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-semibold">
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
