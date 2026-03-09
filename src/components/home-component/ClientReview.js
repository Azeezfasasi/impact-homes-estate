'use client'

import React, { useState, useEffect } from 'react'

export default function ClientReview() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [autoSlide, setAutoSlide] = useState(true)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch testimonials from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('/api/testimonials')
        const data = await response.json()
        
        if (data.success && data.testimonials && data.testimonials.length > 0) {
          // Map API testimonials to review format
          const mappedReviews = data.testimonials.map((testimonial, index) => ({
            id: testimonial._id,
            name: testimonial.name,
            title: testimonial.position,
            // Generate default avatar using UI Avatars service
            image: `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=random&color=fff&size=400`,
            rating: testimonial.rating || 5,
            text: testimonial.message
          }))
          setReviews(mappedReviews)
        } else {
          // Fallback to demo reviews if API returns empty
          setReviews(getDemoReviews())
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error)
        // Fall back to demo reviews on error
        setReviews(getDemoReviews())
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  // Demo reviews as fallback
  const getDemoReviews = () => [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Property Investor",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      rating: 5,
      text: "Exceptional service and professional team. They made my investment journey smooth and stress-free. Highly recommended!"
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "Business Owner",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      rating: 5,
      text: "Outstanding expertise in real estate. The team provided valuable insights that helped me make the right investment decisions."
    },
    {
      id: 3,
      name: "Emma Williams",
      title: "First-time Buyer",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      rating: 5,
      text: "Great experience from start to finish. The team was patient and explained everything clearly. Very satisfied with my purchase!"
    },
    {
      id: 4,
      name: "David Martinez",
      title: "Real Estate Portfolio Manager",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      rating: 5,
      text: "Professionalism and competence at its finest. They delivered beyond expectations. Looking forward to future collaborations."
    }
  ]

  useEffect(() => {
    if (!autoSlide || reviews.length === 0) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % reviews.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoSlide, reviews.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % reviews.length)
    setAutoSlide(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + reviews.length) % reviews.length)
    setAutoSlide(false)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
    setAutoSlide(false)
  }

  return (
    <div className="relative w-full bg-gradient-to-b from-impact-gold via-impact-gold/70 to-impact-gold py-16 md:py-20 lg:py-24 overflow-hidden">
      {/* Background overlay pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat'
        }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-8 lg:px-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 lg:mb-20">
          <p className="text-white text-sm md:text-base font-semibold mb-3 md:mb-4 tracking-wide">We love feedback</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">Client Reviews</h2>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center h-96 md:h-80 lg:h-72">
            <div className="animate-spin">
              <div className="h-12 w-12 border-4 border-white border-t-transparent rounded-full"></div>
            </div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex items-center justify-center h-96 md:h-80 lg:h-72">
            <p className="text-white text-lg">No reviews available yet</p>
          </div>
        ) : (
          <>
        {/* Carousel */}
        <div className="relative">
          {/* Reviews Container */}
          <div className="relative h-96 md:h-80 lg:h-[320px] flex items-center justify-center overflow-hidden">
            {reviews.map((review, index) => (
              <div
                key={review.id}
                className={`absolute w-full transform transition-all duration-1000 ease-in-out ${
                  index === currentSlide
                    ? 'opacity-100 scale-100 z-10'
                    : index < currentSlide
                    ? 'opacity-0 scale-95 -translate-x-full z-0'
                    : 'opacity-0 scale-95 translate-x-full z-0'
                }`}
              >
                <div className="bg-white bg-opacity-95 rounded-lg shadow-lg p-8 md:p-10 lg:p-12 mx-4 md:mx-8 lg:mx-12">
                  {/* Rating */}
                  <div className="flex justify-center gap-1 mb-6">
                    {[...Array(review.rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 md:w-6 md:h-6 text-yellow-400 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-700 text-center text-base md:text-lg mb-8 leading-relaxed italic">
                    "{review.text}"
                  </p>

                  {/* Client Info */}
                  <div className="flex flex-col items-center">
                    <img
                      src={review.image}
                      alt={review.name}
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover mb-4 border-4 border-impact-gold"
                    />
                    <h3 className="text-lg md:text-xl font-bold text-gray-900">{review.name}</h3>
                    <p className="text-sm md:text-base text-gray-600">{review.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 md:-translate-x-16 z-20 bg-white text-impact-gold p-3 rounded-full transition-colors"
            aria-label="Previous review"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 md:translate-x-16 z-20 bg-white text-impact-gold p-3 rounded-full transition-colors"
            aria-label="Next review"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-3 mt-10 md:mt-12">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide
                  ? 'bg-white w-8 md:w-10'
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75 w-3 md:w-3.5'
              } h-3 md:h-3.5`}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>
          </>
        )}

      </div>
    </div>
  )
}
