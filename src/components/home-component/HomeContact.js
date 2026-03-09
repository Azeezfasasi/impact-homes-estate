'use client'

import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function HomeContact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    project: ''
  })

  const [expandedFAQ, setExpandedFAQ] = useState(0)
  const [faqs, setFaqs] = useState([])
  const [faqsLoading, setFaqsLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [projects, setProjects] = useState([])
  const [projectsLoading, setProjectsLoading] = useState(true)

  // Fetch FAQs and Projects from backend
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch('/api/faq')
        if (!response.ok) throw new Error('Failed to fetch FAQs')
        const data = await response.json()
        setFaqs(data)
      } catch (error) {
        console.error('Error fetching FAQs:', error)
        // Fallback to empty array if API fails
        setFaqs([])
      } finally {
        setFaqsLoading(false)
      }
    }

    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/project')
        if (!response.ok) throw new Error('Failed to fetch projects')
        const data = await response.json()
        // Handle the API response structure { success: true, projects: [...] }
        const projectsList = data.projects || data || []
        // Filter out disabled projects and those not in progress/completed
        const activeProjects = projectsList.filter(
          (project) => !project.isDisabled && project.projectStatus !== 'disabled'
        )
        setProjects(activeProjects)
      } catch (error) {
        console.error('Error fetching projects:', error)
        // Fallback to empty array if API fails
        setProjects([])
      } finally {
        setProjectsLoading(false)
      }
    }

    fetchFAQs()
    fetchProjects()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email || !formData.project) {
      toast.error('Please fill in all fields')
      return
    }

    setFormLoading(true)
    try {
      const response = await fetch('/api/inspection-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to submit inspection request')
      }

      const result = await response.json()
      toast.success('Inspection request submitted successfully! We will contact you soon.')
      
      // Clear form
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        project: ''
      })
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error(error.message || 'Failed to submit inspection request')
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <div className="w-full bg-gray-100 px-5 py-10 md:px-5 md:py-10 lg:px-5 lg:py-10">
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-10">
        {/* Left Section - Contact Form */}
        <div className="bg-gray-800 text-white p-10 rounded-lg md:p-8 sm:p-6">
          <h1 className="text-4xl md:text-3xl sm:text-2xl font-bold mb-5">Schedule an Inspection</h1>
          <p className="text-base md:text-sm text-gray-300 mb-8 leading-relaxed">Kindly complete the form below to Schedule an Inspection of any of our projects</p>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 sm:grid-cols-1">
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-2 text-gray-400">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="px-3.5 py-3 border border-gray-300 rounded text-sm text-gray-800 font-normal focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-400"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-2 text-gray-400">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="px-3.5 py-3 border border-gray-300 rounded text-sm text-gray-800 font-normal focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-400"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-2 text-gray-400">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-0">
                {/* <span className="bg-white px-3.5 py-3 border border-gray-300 rounded-l text-sm text-gray-800 whitespace-nowrap flex items-center">🇺🇸 +1</span> */}
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="flex-1 px-3.5 py-3 border border-l-0 border-gray-300 rounded-r text-sm text-gray-800 font-normal focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-400"
                  placeholder=""
                  required
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-2 text-gray-400">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="px-3.5 py-3 border border-gray-300 rounded text-sm text-gray-800 font-normal focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-400"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-2 text-gray-400">
                Select Project <span className="text-red-500">*</span>
              </label>
              <select
                name="project"
                value={formData.project}
                onChange={handleInputChange}
                className="px-3.5 py-3 border border-gray-300 rounded text-sm text-gray-800 font-normal focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-400"
                required
                disabled={projectsLoading}
              >
                <option value="">
                  {projectsLoading ? 'Loading projects...' : 'Choose a project'}
                </option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.projectName}
                  </option>
                ))}
              </select>
              {!projectsLoading && projects.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">No projects available</p>
              )}
            </div>

            <button 
              type="submit" 
              disabled={formLoading}
              className="mt-2.5 px-5 py-3.5 bg-impact-gold text-black text-sm font-bold rounded hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formLoading ? 'SUBMITTING...' : 'SUBMIT'}
            </button>
          </form>
        </div>

        {/* Right Section - FAQ */}
        <div className="py-5 sm:py-0">
          <p className="text-sm text-impact-gold mb-2.5 font-medium">Learn More From</p>
          <h2 className="text-4xl md:text-3xl sm:text-2xl font-bold mb-7 text-gray-900">Our Frequently Asked Questions</h2>
          
          {faqsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-impact-gold border-t-transparent rounded-full"></div>
            </div>
          ) : faqs.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-600">No FAQs available at the moment.</p>
            </div>
          ) : (
            <div className="flex flex-col border border-gray-300 rounded-lg overflow-hidden">
              {faqs.map((faq, index) => (
                <div key={faq._id || index} className="border-b border-gray-300 last:border-b-0">
                  <button
                    className="w-full px-5 py-5 md:px-4 md:py-4 bg-gray-900 text-white flex justify-between items-center cursor-pointer text-sm md:text-xs font-semibold hover:bg-gray-800 transition-colors"
                    onClick={() => setExpandedFAQ(expandedFAQ === index ? -1 : index)}
                  >
                    <span>{index + 1}. {faq.question}</span>
                    <span className={`text-yellow-400 text-2xl font-light transition-transform ${expandedFAQ === index ? 'rotate-45' : ''}`}>+</span>
                  </button>
                  {expandedFAQ === index && (
                    <div className="px-5 py-5 md:px-4 md:py-4 bg-gray-50 text-gray-700 text-sm leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
