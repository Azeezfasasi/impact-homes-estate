'use client'

import Link from 'next/link'
import React, { useState, useEffect } from 'react'

export default function WelcomeCta() {
  const [content, setContent] = useState(null)
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)

  // create an image src for the icons
  const home = '/img/home/svg'
  const foot = '/img/foot.svg'
  const briefcase = '/img/briefcase.svg'
  const years = '/img/years.svg'


  // Fetch WelcomeCta data from backend
  useEffect(() => {
    const fetchWelcomeCta = async () => {
      try {
        const response = await fetch('/api/welcome-cta')
        const data = await response.json()

        if (data.success && data.data) {
          setContent(data.data)
          // Sort stats by order
          const sortedStats = [...(data.data.stats || [])].sort(
            (a, b) => (a.order || 0) - (b.order || 0)
          )
          setStats(sortedStats)
        } else {
          // Fallback to default if fetch fails
          setDefaultContent()
        }
      } catch (error) {
        console.error('Failed to fetch WelcomeCta:', error)
        setDefaultContent()
      } finally {
        setLoading(false)
      }
    }

    fetchWelcomeCta()

    // Refresh every 5 minutes
    const refreshInterval = setInterval(fetchWelcomeCta, 5 * 60 * 1000)
    return () => clearInterval(refreshInterval)
  }, [])

  const setDefaultContent = () => {
    const defaultStats = [
      { icon: home, number: '1000+', label: 'Homes delivered', order: 0 },
      { icon: foot, number: '1,000,500+', label: 'Square foot Developed', order: 1 },
      { icon: briefcase, number: '50+', label: 'Experienced Professionals', order: 2 },
      { icon: years, number: '10+', label: 'Years of Progressive Excellence', order: 3 },
    ]
    setContent({
      title: 'Enjoy Free Investment Advisory Services',
      description:
        'Would you like to get started with investments in real estate? Our trained and well experienced Investment Advisors are willing to guide you on your journey to a profitable real estate investment',
      buttonLabel: 'Speak with an Investment Advisor',
      stats: defaultStats,
    })
    setStats(defaultStats)
  }

  if (loading) {
    return (
      <div className="max-w-7xl bg-white mx-auto my-4 lg:rounded-lg shadow-lg overflow-hidden mt-0 md:mt-[0px] lg:mt-[0px] z-10 relative border border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="bg-gradient-to-br from-impact-gold to-impact-gold/90 flex flex-col justify-center items-center p-8 md:p-12 lg:p-16 min-h-[300px]">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <p className="mt-4 text-white">Loading...</p>
          </div>
          <div className="bg-white flex flex-col justify-center items-center p-8 md:p-12 lg:p-16 min-h-[300px]">
            {/* Stats loading placeholder */}
          </div>
        </div>
      </div>
    )
  }

  if (!content) {
    return null
  }

  return (
    <div className="max-w-7xl bg-white mx-auto my-4 lg:rounded-lg shadow-lg overflow-hidden mt-0 md:mt-[0px] lg:mt-[0px] z-10 relative border border-gray-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Left Section - Purple Background */}
        <div className="bg-gradient-to-br from-impact-gold to-impact-gold/90 flex flex-col justify-center items-start p-8 md:p-12 lg:p-16">
          <div className="w-full max-w-lg">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {content.title}
            </h1>
            
            <p className="text-lg text-gray-100 mb-8 leading-relaxed">
              {content.description}
            </p>
            
            <Link href="https://wa.me/353872482181" target="_blank" rel="noopener noreferrer" className="w-full lg:w-[70%] text-center bg-white text-gray-900 font-semibold px-8 py-2 md:py-4 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg hover:shadow-xl">
              {content.buttonLabel}
              <span className="text-xl hidden md:block">📋</span>
            </Link>
          </div>
        </div>

        {/* Right Section - Stats Grid */}
        <div className="bg-white flex flex-col justify-center items-center p-8 md:p-12 lg:p-16">
          <div className="w-full max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {stats.map((stat, index) => (
                <div
                  key={stat._id || index}
                  className="flex flex-col items-center text-center p-6 rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
                >
                  {/* Icon */}
                  <div className="text-6xl md:text-7xl mb-4 relative">
                    {stat.iconUrl ? (
                      <img
                        src={stat.iconUrl}
                        alt={stat.label}
                        className="w-20 h-20 md:w-24 md:h-24 object-contain"
                      />
                    ) : (
                      <div className="relative inline-block">
                        <span>{stat.icon}</span>
                      </div>
                    )}
                  </div>

                  {/* Number */}
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {stat.number}
                  </h3>

                  {/* Label */}
                  <p className="text-base md:text-lg text-gray-700 font-medium">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
