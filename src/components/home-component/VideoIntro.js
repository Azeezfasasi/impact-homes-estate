"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Play, ChevronLeft, ChevronRight } from 'lucide-react'

export default function VideoIntro() {
  // Video playlist - add your videos here
  const videos = [
    {
      id: 1,
      src: '/videos/vid3.mp4',
      title: '',
    },
    {
      id: 2,
      src: '/videos/vid1.mp4',
      title: 'Guzape',
    },
    {
      id: 3,
      src: '/videos/vid2.mp4',
      title: 'Oyster Bay',
    },
  ]

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showVideo, setShowVideo] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const videoRef = useRef(null)

  const currentVideo = videos[currentVideoIndex]

  const handlePlayClick = () => {
    setIsPlaying(true)
    if (videoRef.current) {
      videoRef.current.play()
    }
  }



  const handlePrevious = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setIsPlaying(false)
    
    setCurrentVideoIndex((prevIndex) =>
      prevIndex === 0 ? videos.length - 1 : prevIndex - 1
    )
    
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const handleNext = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setIsPlaying(false)
    
    setCurrentVideoIndex((prevIndex) =>
      prevIndex === videos.length - 1 ? 0 : prevIndex + 1
    )
    
    setTimeout(() => setIsTransitioning(false), 300)
  }

  // Pause video when transitioning between videos
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }, [currentVideoIndex])

  if (!showVideo) {
    return null
  }

  return (
    <div className="relative w-[95%] md:w-[85%] h-screen bg-black overflow-hidden group mb-8 md:mb-16 px-6 mx-auto rounded-lg">
      {/* Background Video with Transition Effect */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${isTransitioning ? 'opacity-100' : 'opacity-100'}`}>
        <video
          key={currentVideoIndex}
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-contain"
          loop
          muted
        >
          <source src={currentVideo.src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Dark Overlay */}
      {/* <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50"></div> */}

      {/* Play Button - Center Screen */}
      {!isPlaying && !isTransitioning && (
        <div className="absolute inset-0 flex items-center justify-center z-10 animate-fadeIn">
          <button
            onClick={handlePlayClick}
            className="group relative flex items-center justify-center"
            aria-label="Play video"
          >
            {/* Animated Circle Rings */}
            <div className="absolute w-24 h-24 bg-white/10 rounded-full group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110 animate-pulse"></div>
            <div className="absolute w-24 h-24 border-2 border-white/30 rounded-full group-hover:border-white/50 transition-all duration-300"></div>

            {/* Play Icon */}
            <Play
              size={56}
              className="relative text-white fill-white group-hover:scale-110 transition-transform duration-300 drop-shadow-lg"
            />
          </button>

          {/* Info Text */}
          <div className="absolute bottom-16 text-center">
            <p className="text-white text-lg font-light tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">
              CLICK TO PLAY
            </p>
            <p className="text-white/60 text-sm mt-2">{currentVideo.title}</p>
          </div>
        </div>
      )}

      {/* Loading transition indicator */}
      {isTransitioning && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      )}

      {/* Left Arrow Navigation */}
      <button
        onClick={handlePrevious}
        disabled={isTransitioning}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous video"
      >
        <div className="bg-white/10 hover:bg-white/20 transition-all duration-300 rounded-full p-3 backdrop-blur-md border border-white/10 hover:border-white/30">
          <ChevronLeft size={28} className="text-white" />
        </div>
      </button>

      {/* Right Arrow Navigation */}
      <button
        onClick={handleNext}
        disabled={isTransitioning}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next video"
      >
        <div className="bg-white/10 hover:bg-white/20 transition-all duration-300 rounded-full p-3 backdrop-blur-md border border-white/10 hover:border-white/30">
          <ChevronRight size={28} className="text-white" />
        </div>
      </button>

      {/* Video Counter - Bottom Center */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/10">
          <p className="text-white font-light tracking-wide text-sm">
            <span className="font-semibold">{currentVideoIndex + 1}</span>
            <span className="text-white/60 mx-2">/</span>
            <span className="text-white/60">{videos.length}</span>
          </p>
        </div>
      </div>

      {/* Video Indicators - Bottom */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {videos.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isTransitioning) {
                setCurrentVideoIndex(index)
                setIsPlaying(false)
              }
            }}
            className={`transition-all duration-300 rounded-full ${
              index === currentVideoIndex
                ? 'w-2 h-2 bg-white'
                : 'w-2 h-2 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to video ${index + 1}`}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
