'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

export default function FeaturedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      const response = await fetch('/api/property?featured=true&limit=20&sortBy=dateListed&sortOrder=desc');
      const result = await response.json();
      if (result.data && result.data.length > 0) {
        // Filter properties that have a featured image
        const propertiesWithImages = result.data.filter(p => 
          p.images && p.images.some(img => img.isMain)
        );
        setProperties(propertiesWithImages);
      }
    } catch (error) {
      console.error('Error fetching featured properties:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-play carousel
  useEffect(() => {
    if (!autoPlay || properties.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % properties.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [autoPlay, properties.length]);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
    setAutoPlay(false);
    // Resume autoplay after 10 seconds of inactivity
    const timer = setTimeout(() => setAutoPlay(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % properties.length);
    setAutoPlay(false);
    const timer = setTimeout(() => setAutoPlay(true), 10000);
    return () => clearTimeout(timer);
  }, [properties.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) =>
      prev === 0 ? properties.length - 1 : prev - 1
    );
    setAutoPlay(false);
    const timer = setTimeout(() => setAutoPlay(true), 10000);
    return () => clearTimeout(timer);
  }, [properties.length]);

  if (loading) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-impact-gold"></div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="w-full py-16 text-center">
        <p className="text-gray-500 text-lg">No featured properties at this time</p>
      </div>
    );
  }

  const currentProperty = properties[currentSlide];
  const featuredImage = currentProperty.images?.find(img => img.isMain);

  return (
    <div className="w-[95%] md:w-[70%] relative mx-auto">
      {/* Main Carousel Container */}
      <div className="relative w-full h-96 md:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl shadow-2xl bg-gray-900">
        {/* Slides */}
        {properties.map((property, index) => {
          const image = property.images?.find(img => img.isMain);
          const isActive = index === currentSlide;

          return (
            <div
              key={property._id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
                isActive
                  ? 'opacity-100 translate-x-0 scale-100'
                  : index > currentSlide
                  ? 'opacity-0 translate-x-full scale-95'
                  : 'opacity-0 -translate-x-full scale-95'
              }`}
            >
              {/* Background Image */}
              {image && (
                <img
                  src={image.url}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 lg:p-12">
                <div className="transform transition-all duration-700 ease-out space-y-2 md:space-y-4">
                  {/* Property Type Badge */}
                  <div className="flex items-center gap-2">
                    <span className="inline-block px-3 py-1 bg-impact-gold text-white text-xs md:text-sm font-semibold rounded-full">
                      ⭐ Featured
                    </span>
                    <span className="inline-block px-3 py-1 bg-gray-800/80 backdrop-blur text-white text-xs md:text-sm font-medium rounded-full">
                      {property.propertyType}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg leading-tight">
                    {property.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-200 text-sm md:text-base line-clamp-2 drop-shadow">
                    {property.description}
                  </p>

                  {/* Property Details */}
                  <div className="flex flex-wrap gap-4 md:gap-6 pt-2 md:pt-4">
                    {property.bedrooms > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🛏️</span>
                        <span className="text-white text-sm md:text-base font-medium">
                          {property.bedrooms} Beds
                        </span>
                      </div>
                    )}
                    {property.bathrooms > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🚿</span>
                        <span className="text-white text-sm md:text-base font-medium">
                          {property.bathrooms} Baths
                        </span>
                      </div>
                    )}
                    {property.squareFootage && (
                      <div className="flex items-center gap-2">
                        <span className="text-xl">📐</span>
                        <span className="text-white text-sm md:text-base font-medium">
                          {property.squareFootage.toLocaleString()} sqft
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Price and Button */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 md:pt-6">
                    {/* show price if available */}
                    {property.price ? (
                      <div className="flex flex-col">
                        <span className="text-gray-300 text-xs md:text-sm">Price</span>
                        <span className="text-3xl md:text-4xl font-bold text-white">
                          ₦{property.price.toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span className="text-gray-300 text-xs md:text-sm">Price</span>
                        <span className="text-3xl md:text-4xl font-bold text-white">
                          Price on request
                        </span>
                      </div>
                    )}
                    <Link
                      href={`/all-properties/${property._id}`}
                      className="px-6 md:px-8 py-3 md:py-4 bg-impact-gold hover:bg-impact-gold/80 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Navigation Arrows */}
        {properties.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 md:left-6 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 backdrop-blur text-white p-2 md:p-3 rounded-full transition-all duration-300 group"
              aria-label="Previous slide"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 md:right-6 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 backdrop-blur text-white p-2 md:p-3 rounded-full transition-all duration-300 group"
              aria-label="Next slide"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Dot Indicators */}
        {properties.length > 1 && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
            {properties.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentSlide
                    ? 'bg-impact-gold w-8 h-2'
                    : 'bg-white/40 hover:bg-white/60 w-2 h-2'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Status Badge - Top Right */}
        <div className="absolute top-6 right-6 z-20 bg-white/20 backdrop-blur text-white px-4 py-2 rounded-full text-sm font-semibold">
          {currentSlide + 1} / {properties.length}
        </div>
      </div>

      {/* Thumbnail Strip (Mobile-friendly) */}
      {properties.length > 1 && (
        <div className="mt-6 hidden md:flex md:justify-center gap-3 overflow-x-auto pb-2">
          {properties.map((property, index) => {
            const image = property.images?.find(img => img.isMain);
            return (
              <button
                key={property._id}
                onClick={() => goToSlide(index)}
                className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden transition-all duration-300 border-2 transform hover:scale-105 ${
                  index === currentSlide
                    ? 'border-impact-gold ring-2 ring-impact-gold'
                    : 'border-gray-300 hover:border-impact-gold'
                }`}
              >
                {image && (
                  <img
                    src={image.url}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
