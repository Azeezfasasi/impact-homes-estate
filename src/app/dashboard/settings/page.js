'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { user, loading, isAuthenticated, updateProfile } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const result = await updateProfile({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      })

      if (result.success) {
        toast.success('Profile updated successfully!')
        router.push('/dashboard/profile')
      } else {
        toast.error(result.message || 'Failed to update profile')
      }
    } catch (error) {
      toast.error('An error occurred while updating profile')
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Link href="/dashboard/profile" className="flex items-center gap-2 text-impact-gold hover:text-white transition mb-8">
          <ArrowLeft size={20} />
          Back to Profile
        </Link>

        <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-impact-gold transition"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-impact-gold transition"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-impact-gold transition resize-none"
                placeholder="Enter your address"
              />
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-impact-gold text-black font-semibold rounded-lg hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={20} />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <Link
                href="/dashboard/profile"
                className="flex-1 flex items-center justify-center px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
