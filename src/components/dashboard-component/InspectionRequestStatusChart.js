"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import { useAuth } from '@/context/AuthContext'

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#ef4444']

const STATUS_LABELS = {
  pending: 'Pending',
  approved: 'Approved',
  scheduled: 'Scheduled',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export default function InspectionRequestStatusChart() {
  const { token } = useAuth()
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('pie')

  useEffect(() => {
    const fetchInspectionData = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await axios.get('/api/inspection-requests', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        // Handle both array response and object response
        const requests = Array.isArray(response.data) ? response.data : response.data.inspectionRequests
        
        if (requests && Array.isArray(requests)) {
          // Group by status
          const statusGrouped = {}

          requests.forEach((request) => {
            const status = request.status || 'pending'
            statusGrouped[status] = (statusGrouped[status] || 0) + 1
          })

          // Convert to chart format
          const chartDataFormatted = Object.entries(statusGrouped).map(([status, value]) => ({
            name: STATUS_LABELS[status] || status.charAt(0).toUpperCase() + status.slice(1),
            value,
            status,
          }))

          setChartData(chartDataFormatted)
        }
      } catch (err) {
        console.error('Failed to fetch inspection request data:', err)
        setError('Failed to load inspection requests')
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchInspectionData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Inspection Requests Status</h3>
        <div className="flex items-center justify-center h-80">
          <div className="text-gray-500">Loading chart...</div>
        </div>
      </div>
    )
  }

  if (error || chartData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Inspection Requests Status</h3>
        <div className="flex items-center justify-center h-80">
          <div className="text-gray-500">{error || 'No inspection requests available'}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md shadow-impact-gold/70 border border-impact-gold/70 p-6 w-full lg:w-[48%]">
      <div className="flex flex-col md:flex-row gap-3 md:gap-0 items-center justify-between mb-6">
        <h3 className="text-[20px] md:text-2xl font-bold text-gray-800">Inspection Requests Status</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('pie')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'pie'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pie Chart
          </button>
          <button
            onClick={() => setActiveTab('bar')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'bar'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Bar Chart
          </button>
        </div>
      </div>

      {activeTab === 'pie' && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-600">Distribution by Status</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} requests`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeTab === 'bar' && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-600">Request Count by Status</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `${value} requests`} />
              <Legend />
              <Bar dataKey="value" fill="#6366f1" name="Requests" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
