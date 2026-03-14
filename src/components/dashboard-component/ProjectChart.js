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

export default function ProjectChart() {
  const { token } = useAuth()
  const [statusData, setStatusData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('status')

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await axios.get('/api/project', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.data.success && response.data.projects) {
          // Group projects by status
          const statusGrouped = {}
          const categoryGrouped = {}

          response.data.projects.forEach((project) => {
            const status = project.projectStatus || 'unknown'
            const category = project.category || 'uncategorized'

            statusGrouped[status] = (statusGrouped[status] || 0) + 1
            categoryGrouped[category] = (categoryGrouped[category] || 0) + 1
          })

          // Convert to chart format
          const statusChart = Object.entries(statusGrouped).map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value,
          }))

          const categoryChart = Object.entries(categoryGrouped).map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value,
          }))

          setStatusData(statusChart)
          setCategoryData(categoryChart)
        }
      } catch (err) {
        console.error('Failed to fetch project data:', err)
        setError('Failed to load project chart')
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchProjectData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Projects Overview</h3>
        <div className="flex items-center justify-center h-80">
          <div className="text-gray-500">Loading chart...</div>
        </div>
      </div>
    )
  }

  if (error || (statusData.length === 0 && categoryData.length === 0)) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Projects Overview</h3>
        <div className="flex items-center justify-center h-80">
          <div className="text-gray-500">{error || 'No projects available'}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md shadow-impact-gold/70 border border-impact-gold/70 p-6 w-full lg:w-[48%]">
      <div className="flex flex-col md:flex-row gap-3 md:gap-0 items-center justify-between mb-6">
        <h3 className="text-[20px] md:text-2xl font-bold text-gray-800">Projects Overview</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('status')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'status'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            By Status
          </button>
          <button
            onClick={() => setActiveTab('category')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'category'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            By Category
          </button>
        </div>
      </div>

      {activeTab === 'status' && statusData.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-600">Projects by Status</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} projects`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeTab === 'category' && categoryData.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-600">Projects by Category</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `${value} projects`} />
              <Legend />
              <Bar dataKey="value" fill="#6366f1" name="Projects" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
