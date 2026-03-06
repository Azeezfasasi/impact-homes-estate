'use client'

import React, { useState } from 'react'

export default function HomeContact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    project: ''
  })

  const [expandedFAQ, setExpandedFAQ] = useState(0)

  const faqs = [
    {
      question: "I just want to buy a house. Why call it an investment?",
      answer: "Whether you are acquiring a property to live in or to generate passive income, it does not take away the fact that the property value will appreciate and generate returns. Hence, we refer to as an investment."
    },
    {
      question: "Do I need an expert to guide me?",
      answer: "Yes, our expert team is here to guide you through every step of your investment journey."
    },
    {
      question: "Are there investment plans?",
      answer: "Yes, we offer various investment plans tailored to your needs and budget."
    },
    {
      question: "How long does it take to deliver on a project?",
      answer: "Delivery timelines vary depending on the project. We'll provide specific timelines during consultation."
    }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Add your form submission logic here
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
                <span className="bg-white px-3.5 py-3 border border-gray-300 rounded-l text-sm text-gray-800 whitespace-nowrap flex items-center">🇺🇸 +1</span>
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
              >
                <option value="">Choose a project</option>
                <option value="project1">Project 1</option>
                <option value="project2">Project 2</option>
              </select>
            </div>

            <button type="submit" className="mt-2.5 px-5 py-3.5 bg-impact-gold text-black text-sm font-bold rounded hover:bg-yellow-500 transition-colors">
              SUBMIT
            </button>
          </form>
        </div>

        {/* Right Section - FAQ */}
        <div className="py-5 sm:py-0">
          <p className="text-sm text-impact-gold mb-2.5 font-medium">Learn More From</p>
          <h2 className="text-4xl md:text-3xl sm:text-2xl font-bold mb-7 text-gray-900">Our Frequently Asked Questions</h2>
          
          <div className="flex flex-col border border-gray-300 rounded-lg overflow-hidden">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-300 last:border-b-0">
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
        </div>
      </div>
    </div>
  )
}
