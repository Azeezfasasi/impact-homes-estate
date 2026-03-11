'use client'

import React, { useState, useEffect } from 'react'
import { Upload, Edit2, Trash2, Eye, Download, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'

export default function ManageBrochure() {
  const auth = useAuth()
  const user = auth?.user
  const [brochures, setBrochures] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [file, setFile] = useState(null)
  const [previewFile, setPreviewFile] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    tags: '',
    featured: false,
    status: 'active',
    version: '1.0',
  })

  const categories = ['general', 'properties', 'projects', 'services', 'investment', 'other']

  useEffect(() => {
    fetchBrochures()
  }, [])

  const fetchBrochures = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/brochures?limit=100')
      const data = await response.json()

      if (data.success) {
        setBrochures(data.data)
      } else {
        toast.error('Failed to fetch brochures')
      }
    } catch (error) {
      console.error('Error fetching brochures:', error)
      toast.error('Error fetching brochures')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Only PDF files are allowed')
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        setFile(event.target.result)
        setPreviewFile(selectedFile.name)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title || !formData.category) {
      toast.error('Please fill in required fields')
      return
    }

    if (!editingId && !file) {
      toast.error('Please select a PDF file')
      return
    }

    try {
      setLoading(true)

      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: formData.tags.split(',').filter((tag) => tag.trim()),
        featured: formData.featured,
        status: formData.status,
        version: formData.version,
      }

      if (file) {
        payload.file = file
        payload.fileName = previewFile
      }

      if (editingId) {
        // Update
        const response = await fetch(`/api/brochures/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        const data = await response.json()
        if (data.success) {
          toast.success('Brochure updated successfully')
          setEditingId(null)
          resetForm()
          fetchBrochures()
        } else {
          toast.error(data.error || 'Failed to update brochure')
        }
      } else {
        // Create
        if (!user || !user._id) {
          toast.error('You must be logged in to upload brochures')
          return
        }

        const response = await fetch('/api/brochures', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...payload,
            file,
            fileName: previewFile,
            uploadedBy: user._id,
          }),
        })

        const data = await response.json()
        if (data.success) {
          toast.success('Brochure uploaded successfully')
          resetForm()
          fetchBrochures()
        } else {
          toast.error(data.error || 'Failed to upload brochure')
        }
      }
    } catch (error) {
      console.error('Error submitting brochure:', error)
      toast.error('Error submitting brochure')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (brochure) => {
    setEditingId(brochure._id)
    setFormData({
      title: brochure.title,
      description: brochure.description || '',
      category: brochure.category,
      tags: brochure.tags.join(', '),
      featured: brochure.featured,
      status: brochure.status,
      version: brochure.version,
    })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id, publicId) => {
    if (!window.confirm('Are you sure you want to delete this brochure?')) return

    try {
      const response = await fetch(`/api/brochures/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      if (data.success) {
        toast.success('Brochure deleted successfully')
        fetchBrochures()
      } else {
        toast.error(data.error || 'Failed to delete brochure')
      }
    } catch (error) {
      console.error('Error deleting brochure:', error)
      toast.error('Error deleting brochure')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'general',
      tags: '',
      featured: false,
      status: 'active',
      version: '1.0',
    })
    setFile(null)
    setPreviewFile(null)
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Manage Brochures</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-impact-gold hover:bg-impact-gold/90 text-white px-4 py-2 rounded flex items-center gap-2 transition"
          >
            <Upload size={20} />
            Upload Brochure
          </button>
        )}
      </div>

      {/* Upload Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {editingId ? 'Edit Brochure' : 'Upload New Brochure'}
            </h2>
            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Brochure title"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-impact-gold"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-impact-gold"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of the brochure"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-impact-gold"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="e.g., residential, investment, new"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-impact-gold"
                />
              </div>

              {/* Version */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Version
                </label>
                <input
                  type="text"
                  name="version"
                  value={formData.version}
                  onChange={handleInputChange}
                  placeholder="e.g., 1.0, 2.0"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-impact-gold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-impact-gold"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Checkboxes */}
              <div className="flex items-end gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-impact-gold"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured</span>
                </label>
              </div>
            </div>

            {/* File Upload */}
            {!editingId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PDF File *
                </label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-impact-gold transition">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <Upload size={32} className="text-gray-400" />
                    <p className="text-sm text-gray-600">
                      {previewFile ? (
                        <span className="text-green-600 font-medium">{previewFile}</span>
                      ) : (
                        <>
                          <span className="font-medium">Click to upload</span> or drag and drop
                          <br />
                          <span className="text-xs text-gray-500">PDF only</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {editingId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Replace PDF File (Optional)
                </label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-impact-gold transition">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <Upload size={32} className="text-gray-400" />
                    <p className="text-sm text-gray-600">
                      {previewFile ? (
                        <span className="text-green-600 font-medium">{previewFile}</span>
                      ) : (
                        <>
                          <span className="font-medium">Click to upload new file</span> to replace
                          <br />
                          <span className="text-xs text-gray-500">PDF only</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-impact-gold text-white rounded hover:bg-impact-gold/90 disabled:opacity-50 transition"
              >
                {loading ? 'Processing...' : editingId ? 'Update Brochure' : 'Upload Brochure'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Brochures List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Downloads</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Featured</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading && (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              )}
              {!loading && brochures.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No brochures found
                  </td>
                </tr>
              )}
              {brochures.map((brochure) => (
                <tr key={brochure._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{brochure.title}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {brochure.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        brochure.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : brochure.status === 'inactive'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {brochure.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{brochure.downloadCount}</td>
                  <td className="px-6 py-4 text-sm">
                    {brochure.featured ? (
                      <span className="text-yellow-600 font-medium">★</span>
                    ) : (
                      <span className="text-gray-300">☆</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    <a
                      href={brochure.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition"
                      title="View"
                    >
                      <Eye size={18} />
                    </a>
                    <button
                      onClick={() => handleEdit(brochure)}
                      className="text-green-600 hover:text-green-800 transition"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(brochure._id, brochure.publicId)}
                      className="text-red-600 hover:text-red-800 transition"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
