'use client'

import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Trash2, Edit2, Plus, X } from 'lucide-react'

export default function ManageFAQ() {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    order: 0,
  })

  // Fetch all FAQs
  useEffect(() => {
    fetchFAQs()
  }, [])

  const fetchFAQs = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/faq')
      if (!response.ok) throw new Error('Failed to fetch FAQs')
      const data = await response.json()
      setFaqs(data)
    } catch (error) {
      console.error('Fetch error:', error)
      toast.error('Failed to load FAQs')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) || 0 : value,
    }))
  }

  const handleOpenModal = (faq = null) => {
    if (faq) {
      setEditingId(faq._id)
      setFormData({
        question: faq.question,
        answer: faq.answer,
        order: faq.order,
      })
    } else {
      setEditingId(null)
      setFormData({
        question: '',
        answer: '',
        order: faqs.length,
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingId(null)
    setFormData({
      question: '',
      answer: '',
      order: 0,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.question.trim() || !formData.answer.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId ? `/api/faq/${editingId}` : '/api/faq'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to save FAQ')

      const savedFAQ = await response.json()
      
      if (editingId) {
        setFaqs((prev) =>
          prev.map((faq) => (faq._id === editingId ? savedFAQ : faq))
        )
        toast.success('FAQ updated successfully')
      } else {
        setFaqs((prev) => [...prev, savedFAQ])
        toast.success('FAQ created successfully')
      }

      handleCloseModal()
      fetchFAQs()
    } catch (error) {
      console.error('Save error:', error)
      toast.error(error.message || 'Failed to save FAQ')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return

    setLoading(true)
    try {
      const response = await fetch(`/api/faq/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete FAQ')

      setFaqs((prev) => prev.filter((faq) => faq._id !== id))
      toast.success('FAQ deleted successfully')
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete FAQ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Manage FAQs
            </h1>
            <p className="text-gray-600 mt-2">Add, edit, or delete frequently asked questions</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            <Plus size={20} />
            Add FAQ
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingId ? 'Edit FAQ' : 'Add New FAQ'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Question <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="question"
                    value={formData.question}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter FAQ question"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Answer <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="answer"
                    value={formData.answer}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Enter FAQ answer"
                    rows={6}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : editingId ? 'Update FAQ' : 'Create FAQ'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* FAQs List */}
        <div className="space-y-4">
          {loading && faqs.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin">
                <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
              <p className="text-gray-600 mt-4">Loading FAQs...</p>
            </div>
          ) : faqs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-600 text-lg">No FAQs yet. Create one to get started!</p>
            </div>
          ) : (
            faqs.map((faq, index) => (
              <div key={faq._id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded">
                        {index + 1}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {faq.question}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed ml-11">
                      {faq.answer}
                    </p>
                    <div className="mt-3 ml-11">
                      <span className="text-xs text-gray-500">
                        Order: {faq.order} | Created: {new Date(faq.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenModal(faq)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(faq._id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
