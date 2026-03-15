'use client'

import React, { useState, useEffect } from 'react'
import { Download, Eye, Book } from 'lucide-react'
import toast from 'react-hot-toast'

export default function BrochureDisplay() {
  const [brochures, setBrochures] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [categories, setCategories] = useState([])

  const categoryList = ['general', 'properties', 'projects', 'services', 'investment', 'other']

  useEffect(() => {
    fetchBrochures()
  }, [])

  const fetchBrochures = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/brochures?limit=100&status=active')
      const data = await response.json()

      if (data.success) {
        setBrochures(data.data)
        // Extract unique categories from brochures
        const uniqueCategories = [...new Set(data.data.map((b) => b.category))]
        setCategories(uniqueCategories)
      }
    } catch (error) {
      console.error('Error fetching brochures:', error)
      toast.error('Failed to load brochures')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (brochure) => {
    try {
      // Increment download count
      await fetch(`/api/brochures/${brochure._id}/download`, {
        method: 'POST',
      })

      // Download PDF through our backend endpoint
      const response = await fetch(`/api/brochures/${brochure._id}/download`, {
        method: 'GET',
      })

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Download error response:', errorData);
        throw new Error(errorData.error || `Failed to download PDF (${response.status})`)
      }

      const blob = await response.blob()

      // Check if blob is valid
      if (blob.size === 0) {
        throw new Error('Downloaded file is empty')
      }

      // Verify it's a PDF
      const arrayBuffer = await blob.slice(0, 4).arrayBuffer();
      const view = new Uint8Array(arrayBuffer);
      const isPDF = view[0] === 0x25 && view[1] === 0x50 && view[2] === 0x44 && view[3] === 0x46; // %PDF
      
      console.log('Downloaded file magic bytes:', Array.from(view).map(b => '0x' + b.toString(16).toUpperCase()).join(' '));
      console.log('Is PDF:', isPDF);
      
      if (!isPDF) {
        // For debugging, show what we got
        const preview = await blob.text();
        console.error('Downloaded content preview:', preview.substring(0, 500));
        throw new Error('Downloaded file is not a valid PDF - see console for details')
      }

      // Create object URL from blob
      const blobUrl = window.URL.createObjectURL(blob)

      // Trigger download
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = brochure.fileName || `${brochure.title}.pdf`
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up the blob URL after a short delay
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl)
      }, 100)

      toast.success('Brochure downloaded successfully')
    } catch (error) {
      console.error('Error downloading brochure:', error)
      toast.error(`Failed to download brochure: ${error.message}`)
    }
  }

  const filteredBrochures =
    selectedCategory === 'all'
      ? brochures
      : brochures.filter((b) => b.category === selectedCategory)

  const featuredBrochures = filteredBrochures.filter((b) => b.featured)
  const regularBrochures = filteredBrochures.filter((b) => !b.featured)

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Book className="w-10 h-10 text-impact-gold" />
            <h1 className="text-4xl font-bold text-gray-900">Our Brochures</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Download our comprehensive brochures to learn more about our properties, projects, and services.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2 rounded-full font-medium transition ${
                selectedCategory === 'all'
                  ? 'bg-impact-gold text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:border-impact-gold'
              }`}
            >
              All Brochures
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition ${
                  selectedCategory === category
                    ? 'bg-impact-gold text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-impact-gold'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-impact-gold"></div>
            <p className="mt-4 text-gray-600">Loading brochures...</p>
          </div>
        ) : filteredBrochures.length === 0 ? (
          <div className="text-center py-12">
            <Book className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No brochures available in this category</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured Brochures */}
            {featuredBrochures.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="text-yellow-500">★</span> Featured
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredBrochures.map((brochure) => (
                    <BrochureCard
                      key={brochure._id}
                      brochure={brochure}
                      onDownload={handleDownload}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Brochures */}
            {regularBrochures.length > 0 && (
              <div>
                {featuredBrochures.length > 0 && (
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Other Brochures</h2>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularBrochures.map((brochure) => (
                    <BrochureCard
                      key={brochure._id}
                      brochure={brochure}
                      onDownload={handleDownload}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function BrochureCard({ brochure, onDownload }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-impact-gold to-yellow-500 p-4 text-white">
        <h3 className="font-bold text-lg line-clamp-2">{brochure.title}</h3>
        <p className="text-sm opacity-90 mt-1">{brochure.description}</p>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="space-y-3 flex-1">
          {/* Category Badge */}
          <div>
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {brochure.category.charAt(0).toUpperCase() + brochure.category.slice(1)}
            </span>
          </div>

          {/* Tags */}
          {brochure.tags && brochure.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {brochure.tags.slice(0, 3).map((tag, idx) => (
                <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Version */}
          <p className="text-sm text-gray-600">
            <span className="font-medium">Version:</span> {brochure.version}
          </p>

          {/* Download Count */}
          <p className="text-sm text-gray-500">
            <span className="font-medium">{brochure.downloadCount}</span> downloads
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-4 pt-4 border-t">
          <a
            href={brochure.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition font-medium text-sm"
          >
            <Eye size={16} />
            View
          </a>
          <button
            onClick={() => onDownload(brochure)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-impact-gold text-white rounded hover:bg-impact-gold/90 transition font-medium text-sm"
          >
            <Download size={16} />
            Download
          </button>
        </div>
      </div>
    </div>
  )
}
