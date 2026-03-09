'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import MainNav from './MainNav'

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch slides from backend
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch('/api/hero')
        const data = await response.json()
        
        if (data.success && data.slides && data.slides.length > 0) {
          // Map backend data to component format
          const formattedSlides = data.slides
            .filter(slide => slide.active !== false) // Filter out inactive slides
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map(slide => ({
              id: slide._id,
              image: slide.image,
              title: slide.title,
              subtitle: slide.subtitle,
              buttonText: slide.ctaLabel,
              buttonLink: slide.ctaHref,
              alt: slide.alt || 'Slide image'
            }))
          
          setSlides(formattedSlides)
        } else {
          // Fallback to default slide if no slides from API
          setSlides([
            {
              id: 'default',
              image: '/img/real4.jpg',
              title: 'INVESTMENT THAT COUNTS',
              subtitle: 'Let our investment advisors guide you on your journey to a profitable real estate investment.',
              buttonText: 'SCHEDULE AN INSPECTION',
              buttonLink: '/all-properties',
              alt: 'Investment opportunities'
            }
          ])
        }
      } catch (error) {
        console.error('Failed to fetch hero slides:', error)
        // Fallback to default slide on error
        setSlides([
          {
            id: 'default',
            image: '/img/real4.jpg',
            title: 'INVESTMENT THAT COUNTS',
            subtitle: 'Let our investment advisors guide you on your journey to a profitable real estate investment.',
            buttonText: 'SCHEDULE AN INSPECTION',
            buttonLink: '/all-properties',
            alt: 'Investment opportunities'
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchSlides()

    // Optional: Refresh slides periodically (every 5 minutes)
    const refreshInterval = setInterval(fetchSlides, 5 * 60 * 1000)
    return () => clearInterval(refreshInterval)
  }, [])

  useEffect(() => {
    if (slides.length === 0) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  if (loading) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-impact-gold"></div>
          <p className="mt-4 text-white">Loading slides...</p>
        </div>
      </div>
    )
  }

  if (slides.length === 0) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <p>No slides available</p>
        </div>
      </div>
    )
  }

  const currentSlideData = slides[currentSlide]

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out pb-[20px] ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            />
            <MainNav hideBackgroundImage={true} />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Content */}
            <div className="relative h-full flex flex-col justify-center items-start px-6 md:px-12 max-w-7xl mx-auto mt-[-120px]">
              {/* Main Heading */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 max-w-2xl">
                {slide.title}
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-white mb-8 max-w-2xl leading-relaxed font-medium">
                {slide.subtitle}
              </p>

              {/* Button */}
              <Link
                href={slide.buttonLink}
                className="bg-impact-gold hover:bg-impact-gold/90 text-white font-bold px-8 py-4 rounded transition duration-300 flex items-center gap-2 group"
              >
                {slide.buttonText}
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Slider Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-impact-gold w-8'
                  : 'bg-white/50 hover:bg-white/75 w-3'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Navigation Arrows (Optional) */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-impact-gold transition"
            aria-label="Previous slide"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-impact-gold transition"
            aria-label="Next slide"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </div>
  )
}
