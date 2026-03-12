'use client';

import React, { useState } from 'react';
import { Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import MainNav from '@/components/home-component/MainNav';

const SOURCES = [
  'Social Media',
  'Friend Referral',
  'Advertisement',
  'Search Engine',
  'Other'
];

export default function BecomeCorporatePartner() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    rcNumber: '',
    companyAddress: '',
    representativeName: '',
    representativePosition: '',
    emailAddress: '',
    phoneNumber: '',
    howHeardAboutUs: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/partner-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'corporate',
          ...formData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Application submitted successfully!');
        setFormData({
          companyName: '',
          rcNumber: '',
          companyAddress: '',
          representativeName: '',
          representativePosition: '',
          emailAddress: '',
          phoneNumber: '',
          howHeardAboutUs: '',
        });
      } else {
        toast.error(data.error || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Become a Corporate Partner' }
  ];

  return (
    <>
      <MainNav title="Become a Corporate Sales Partner" breadcrumbs={breadcrumbs} />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-purple-900 mb-6">BECOME AN INDEPENDENT SALES PARTNER (CORPORATE)</h1>

          <div className="mb-8 space-y-2">
            <p className="text-lg text-gray-600">
              Would you like to become a corporate independent sales partner with Impact Homes Real Estate?
            </p>
            <p className="text-gray-600">
              Kindly proceed to fill the form below. If your application is approved, you will receive a confirmation email, alongside an invitation to proceed with documentation.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Name and RC Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-impact-gold focus:border-transparent"
                  placeholder="Company Name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  RC Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="rcNumber"
                  value={formData.rcNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-impact-gold focus:border-transparent"
                  placeholder="RC Number"
                />
              </div>
            </div>

            {/* Company Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Company Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-impact-gold focus:border-transparent"
                placeholder="Company Address"
              />
            </div>

            {/* Representative Name and Position */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name of Company Representative <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="representativeName"
                  value={formData.representativeName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-impact-gold focus:border-transparent"
                  placeholder="Representative Name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Representative's Position <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="representativePosition"
                  value={formData.representativePosition}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-impact-gold focus:border-transparent"
                  placeholder="Position"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-impact-gold focus:border-transparent"
                placeholder="Email Address"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-impact-gold focus:border-transparent"
                placeholder="Phone Number"
              />
            </div>

            {/* How heard about us */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                How did you hear about us? <span className="text-red-500">*</span>
              </label>
              <select
                name="howHeardAboutUs"
                value={formData.howHeardAboutUs}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-impact-gold focus:border-transparent"
              >
                <option value="">Select an option</option>
                {SOURCES.map(source => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  SUBMITTING...
                </>
              ) : (
                'SUBMIT'
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
