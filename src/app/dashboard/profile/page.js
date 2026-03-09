'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react'

export default function ProfilePage() {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

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
        <Link href="/" className="flex items-center gap-2 text-impact-gold hover:text-white transition mb-8">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
          <div className="text-center mb-8">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-impact-gold mx-auto mb-4"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-impact-gold flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">
                {user.name ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
              </div>
            )}
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-gray-400 mt-2">Account Details</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
              <Mail size={20} className="text-impact-gold" />
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-white font-semibold">{user.email}</p>
              </div>
            </div>

            {user.phone && (
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                <Phone size={20} className="text-impact-gold" />
                <div>
                  <p className="text-gray-400 text-sm">Phone</p>
                  <p className="text-white font-semibold">{user.phone}</p>
                </div>
              </div>
            )}

            {user.address && (
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                <MapPin size={20} className="text-impact-gold" />
                <div>
                  <p className="text-gray-400 text-sm">Address</p>
                  <p className="text-white font-semibold">{user.address}</p>
                </div>
              </div>
            )}

            <div className="p-4 bg-white/5 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Account Type</p>
              <p className="text-white font-semibold capitalize">{user.role || 'User'}</p>
            </div>

            <div className="p-4 bg-white/5 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Member Since</p>
              <p className="text-white font-semibold">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/dashboard/settings"
              className="inline-block w-full text-center px-6 py-3 bg-impact-gold text-black font-semibold rounded-lg hover:bg-yellow-400 transition"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
