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

export default function BecomeIndividualPartner() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailAddress: '',
    phoneNumber: '',
    homeAddress: '',
    yearsAtAddress: '',
    reference1Name: '',
    reference1Phone: '',
    reference2Name: '',
    reference2Phone: '',
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
          type: 'individual',
          ...formData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Application submitted successfully!');
        setFormData({
          firstName: '',
          lastName: '',
          emailAddress: '',
          phoneNumber: '',
          homeAddress: '',
          yearsAtAddress: '',
          reference1Name: '',
          reference1Phone: '',
          reference2Name: '',
          reference2Phone: '',
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
    { label: 'Become an Individual Partner' }
  ];

  return (
    <>
      <MainNav title="Become an Individual Sales Partner" breadcrumbs={breadcrumbs} />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">BECOME AN INDEPENDENT SALES PARTNER</h1>

          <div className="mb-8 space-y-2">
            <p className="text-lg text-impact-gold font-medium">
              Would you like to become an independent sales partner with Impact Homes Real Estate?
            </p>
            <p className="text-gray-600">
              Kindly proceed to fill the form below. If your application is approved, you will receive a confirmation email, alongside an invitation to proceed with documentation.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-impact-gold focus:border-transparent"
                  placeholder="First Name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-impact-gold focus:border-transparent"
                  placeholder="Last Name"
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

            {/* Home Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Home Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="homeAddress"
                value={formData.homeAddress}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-impact-gold focus:border-transparent"
                placeholder="Home Address"
              />
            </div>

            {/* Years at Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                How long have you lived in the address provided above? <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="yearsAtAddress"
                value={formData.yearsAtAddress}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-impact-gold focus:border-transparent"
                placeholder="e.g., 5 years"
              />
            </div>

            {/* Reference 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reference 1 (Name) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="reference1Name"
                  value={formData.reference1Name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-impact-gold focus:border-transparent"
                  placeholder="Reference 1 Name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reference 1 Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="reference1Phone"
                  value={formData.reference1Phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-impact-gold focus:border-transparent"
                  placeholder="Reference 1 Phone Number"
                />
              </div>
            </div>

            {/* Reference 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reference 2 (Name) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="reference2Name"
                  value={formData.reference2Name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-impact-gold focus:border-transparent"
                  placeholder="Reference 2 Name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reference 2 Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="reference2Phone"
                  value={formData.reference2Phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-impact-gold focus:border-transparent"
                  placeholder="Reference 2 Phone Number"
                />
              </div>
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
