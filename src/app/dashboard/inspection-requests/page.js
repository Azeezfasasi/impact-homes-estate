'use client'

import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Trash2, X, Send, Phone, Mail } from 'lucide-react'

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-blue-100 text-blue-800',
  scheduled: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function ManageInspectionRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [replyMessage, setReplyMessage] = useState('')
  const [replyLoading, setReplyLoading] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [projectsMap, setProjectsMap] = useState({})

  // Fetch all inspection requests and projects
  useEffect(() => {
    fetchRequests()
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/project')
      if (!response.ok) throw new Error('Failed to fetch projects')
      const data = await response.json()
      const projectsList = data.projects || data || []
      // Create a map of project ID to project name
      const map = {}
      projectsList.forEach((project) => {
        map[project._id] = project.projectName
      })
      setProjectsMap(map)
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

  const getProjectName = (projectId) => {
    return projectsMap[projectId] || projectId
  }

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/inspection-requests')
      if (!response.ok) throw new Error('Failed to fetch requests')
      const data = await response.json()
      setRequests(data)
    } catch (error) {
      console.error('Fetch error:', error)
      toast.error('Failed to load inspection requests')
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (request) => {
    setSelectedRequest(request)
    setNewStatus(request.status)
    setReplyMessage('')
    setIsDetailModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsDetailModalOpen(false)
    setSelectedRequest(null)
    setReplyMessage('')
  }

  const handleStatusChange = async (newStatusValue) => {
    if (!selectedRequest) return

    setLoading(true)
    try {
      const response = await fetch(`/api/inspection-requests/${selectedRequest._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatusValue }),
      })

      if (!response.ok) throw new Error('Failed to update status')

      const updatedRequest = await response.json()
      setSelectedRequest(updatedRequest)
      setNewStatus(newStatusValue)

      // Update the list
      setRequests((prev) =>
        prev.map((req) => (req._id === selectedRequest._id ? updatedRequest : req))
      )

      toast.success('Status updated successfully')
    } catch (error) {
      console.error('Status update error:', error)
      toast.error('Failed to update status')
    } finally {
      setLoading(false)
    }
  }

  const handleSendReply = async (e) => {
    e.preventDefault()

    if (!replyMessage.trim()) {
      toast.error('Please enter a message')
      return
    }

    if (!selectedRequest) return

    setReplyLoading(true)
    try {
      const response = await fetch(`/api/inspection-requests/${selectedRequest._id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: replyMessage,
          adminName: 'Admin',
        }),
      })

      if (!response.ok) throw new Error('Failed to send reply')

      const updatedRequest = await response.json()
      setSelectedRequest(updatedRequest)

      // Update the list
      setRequests((prev) =>
        prev.map((req) => (req._id === selectedRequest._id ? updatedRequest : req))
      )

      setReplyMessage('')
      toast.success('Reply sent successfully')
    } catch (error) {
      console.error('Send reply error:', error)
      toast.error('Failed to send reply')
    } finally {
      setReplyLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this inspection request?')) return

    setLoading(true)
    try {
      const response = await fetch(`/api/inspection-requests/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete request')

      setRequests((prev) => prev.filter((req) => req._id !== id))
      if (selectedRequest?._id === id) {
        handleCloseModal()
      }
      toast.success('Inspection request deleted successfully')
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Inspection Requests
          </h1>
          <p className="text-gray-600 mt-2">Manage and respond to inspection booking requests</p>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {loading && requests.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin">
                <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
              <p className="text-gray-600 mt-4">Loading inspection requests...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-600 text-lg">No inspection requests yet.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
              {requests.map((request) => (
                <div
                  key={request._id}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleViewDetails(request)}
                >
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {request.firstName} {request.lastName}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1"><span className="font-semibold">Project:</span> {getProjectName(request.project)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[request.status]}`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-blue-600" />
                      <span>{request.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-blue-600" />
                      <span>{request.email}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Requested: {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                    {request.replies.length > 0 && (
                      <p className="text-xs text-blue-600 mt-1 font-semibold">
                        {request.replies.length} reply{request.replies.length !== 1 ? 'ies' : ''}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedRequest.firstName} {selectedRequest.lastName}
                </h2>
                <p className="text-sm text-gray-600 mt-1">Project: {getProjectName(selectedRequest.project)}</p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-gray-900">Contact Information</h3>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{selectedRequest.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{selectedRequest.email}</p>
                  </div>
                </div>
              </div>

              {/* Status Management */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Date Info */}
              <div className="text-sm text-gray-600">
                <p>Requested on: {new Date(selectedRequest.createdAt).toLocaleString()}</p>
                <p>Last updated: {new Date(selectedRequest.updatedAt).toLocaleString()}</p>
              </div>

              {/* Replies Section */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Messages ({selectedRequest.replies.length})
                </h3>

                {selectedRequest.replies.length > 0 ? (
                  <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                    {selectedRequest.replies.map((reply, index) => (
                      <div key={index} className="bg-blue-50 rounded-lg p-4 ">
                        <div className="flex justify-between items-start gap-3 mb-2">
                          <p className="font-semibold text-blue-900">{reply.adminName}</p>
                          <p className="text-xs text-blue-700">
                            {new Date(reply.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-gray-700 text-sm">{reply.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm mb-6">No messages yet.</p>
                )}

                {/* Reply Form */}
                <form onSubmit={handleSendReply} className="flex gap-2">
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply here..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                  />
                  <button
                    type="submit"
                    disabled={replyLoading || !replyMessage.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
                  >
                    <Send size={18} />
                    Send
                  </button>
                </form>
              </div>

              {/* Delete Button */}
              <div className="border-t border-gray-200 pt-6">
                <button
                  onClick={() => {
                    handleCloseModal()
                    handleDelete(selectedRequest._id)
                  }}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-semibold"
                >
                  <Trash2 size={18} />
                  Delete Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
