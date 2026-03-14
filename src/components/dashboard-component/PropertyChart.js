"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'
import { useAuth } from '../../context/AuthContext'

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#ef4444']

export default function PropertyChart() {
  const { token } = useAuth()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await axios.get('/api/property', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.data.success && response.data.data) {
          // Group properties by type
          const grouped = {}
          response.data.data.forEach((property) => {
            const type = property.propertyType || 'Unknown'
            grouped[type] = (grouped[type] || 0) + 1
          })

          // Convert to format needed for recharts
          const chartData = Object.entries(grouped).map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value,
          }))

          setData(chartData)
        }
      } catch (err) {
        console.error('Failed to fetch property data:', err)
        setError('Failed to load property chart')
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchPropertyData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Properties by Type</h3>
        <div className="flex items-center justify-center h-80">
          <div className="text-gray-500">Loading chart...</div>
        </div>
      </div>
    )
  }

  if (error || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Properties by Type</h3>
        <div className="flex items-center justify-center h-80">
          <div className="text-gray-500">{error || 'No properties available'}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md shadow-impact-gold/70 border border-impact-gold/70 p-6 w-full lg:w-[48%]">
      <h3 className="text-[20px] md:text-2xl font-bold text-gray-800 mb-6">Properties by Type</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} properties`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
