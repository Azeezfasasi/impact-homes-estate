"use client";

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Commet } from "react-loading-indicators";

export default function ProjectDetails({ projectId }) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popupIndex, setPopupIndex] = useState(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    async function fetchProject() {
      setLoading(true);
      try {
        const res = await fetch(`/api/project/${projectId}`);
        const data = await res.json();
        setProject(data.project || null);
      } catch (err) {
        setProject(null);
      }
      setLoading(false);
    }
    if (projectId) fetchProject();
  }, [projectId]);

  // Drag logic for gallery slider using refs
  const dragStartXRef = useRef(null);
  const scrollStartRef = useRef(null);
  const isDraggingRef = useRef(false);
  
  function onSliderDown(e) {
    dragStartXRef.current = e.touches ? e.touches[0].clientX : e.clientX;
    scrollStartRef.current = sliderRef.current.scrollLeft;
    isDraggingRef.current = true;
  }
  
  function onSliderMove(e) {
    if (!isDraggingRef.current) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    sliderRef.current.scrollLeft = scrollStartRef.current - (x - dragStartXRef.current);
  }
  
  function onSliderUp() {
    isDraggingRef.current = false;
  }

  // Helper functions
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getStatusColor = (status) => {
    const colors = {
      'planning': 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'on hold': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'residential': 'text-purple-600',
      'commercial': 'text-blue-600',
      'industrial': 'text-orange-600',
      'infrastructure': 'text-green-600',
      'renovation': 'text-pink-600',
    };
    return colors[category] || 'text-gray-600';
  };

  if (loading) return <div className="py-20 text-center text-gray-500"><Commet color="#155dfc" size="medium" text="Loading" textColor="#155dfc" /></div>;
  if (!project) return <div className="py-20 text-center text-gray-500 text-lg">Project not found.</div>;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-start justify-between gap-6 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className={`inline-block text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full ${getCategoryColor(project.category)} bg-opacity-10`}>
                  {project.category}
                </span>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${getStatusColor(project.projectStatus)}`}>
                  <span className="relative flex h-2 w-2">
                    <span className={`animate-pulse absolute inline-flex h-full w-full rounded-full ${project.projectStatus === 'completed' ? 'bg-green-500' : project.projectStatus === 'in-progress' ? 'bg-yellow-500' : 'bg-blue-500'}`}></span>
                  </span>
                  {project.projectStatus}
                </div>
              </div>
              <h1 className="text-[22px] md:text-[32px] font-bold text-gray-900 mb-4 leading-tight">{project.projectName}</h1>
              <p className="text-gray-600 text-[16px] md:text-[17px] flex items-center gap-3 font-medium">
                <svg className="w-6 h-6 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {project.location}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 backdrop-blur-sm bg-opacity-80">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Project Progress</span>
              <span className="text-[17px] md:text-[22px] font-bold text-impact-gold">{project.completion}%</span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden shadow-inner">
              <div 
                className="bg-impact-gold h-full rounded-full transition-all duration-700 ease-out shadow-lg"
                style={{ width: `${project.completion}%` }}
              />
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative w-full h-96 md:h-[550px] mb-12 rounded-2xl overflow-hidden shadow-2xl group">
          <Image
            src={project.featuredImage}
            alt={`Featured image for ${project.projectName}`}
            fill
            loading="eager"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1000px"
            className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-200 mb-2 uppercase tracking-widest">Featured Image</p>
                <h3 className="text-[20px] md:text-[26px] font-black">{project.projectName}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        {project.galleryImages && project.galleryImages.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-impact-gold rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                  </svg>
                </div>
                <h2 className="text-[17px] md:text-[24px] font-bold text-gray-900">Project Gallery</h2>
              </div>
              <span className="text-sm bg-impact-gold text-white px-4 py-2 rounded-full font-bold">
                {project.galleryImages.length} Images
              </span>
            </div>
            
            {/* Draggable Slider */}
            <div className="relative w-full bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div
                ref={sliderRef}
                className="flex overflow-x-auto gap-5 pb-3 scrollbar-thin scrollbar-thumb-gray-400 cursor-grab active:cursor-grabbing select-none"
                onMouseDown={onSliderDown}
                onMouseMove={onSliderMove}
                onMouseUp={onSliderUp}
                onMouseLeave={onSliderUp}
                onTouchStart={onSliderDown}
                onTouchMove={onSliderMove}
                onTouchEnd={onSliderUp}
                onDragStart={e => e.preventDefault()}
              >
                {project.galleryImages.map((img, i) => (
                  <div 
                    key={img + i} 
                    className="relative min-w-[280px] h-64 cursor-pointer select-none rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-2 border border-gray-200"
                    onClick={() => setPopupIndex(i)}
                  >
                    <Image
                      src={img}
                      alt={`Gallery image ${i + 1} for ${project.projectName}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover group-hover:scale-125 transition-transform duration-300 select-none"
                      draggable={false}
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <div className="transform -translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                        <svg className="w-16 h-16 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Popup for image slider */}
        {popupIndex !== null && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 px-2 py-8 animate-in fade-in duration-300" onClick={() => setPopupIndex(null)}>
            <div className="bg-white rounded-2xl p-6 max-w-5xl w-full relative flex flex-col items-center shadow-2xl transform transition-all" onClick={e => e.stopPropagation()}>
              <button 
                className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-3xl transition-all duration-200 hover:scale-110 shadow-lg"
                onClick={() => setPopupIndex(null)}
              >
                ✕
              </button>
              
              {/* Slider navigation */}
              <div className="relative w-full h-96 sm:h-[500px] lg:h-[600px] flex items-center justify-center mb-6">
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 p-4 rounded-full shadow-lg text-3xl text-gray-800 transition-all duration-200 hover:scale-110 z-10 font-bold"
                  onClick={() => {
                    if (typeof popupIndex === 'number') {
                      setPopupIndex(popupIndex === 0 ? project.galleryImages.length - 1 : popupIndex - 1);
                    }
                  }}
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <Image
                  src={project.galleryImages[popupIndex]}
                  alt={`Gallery image ${popupIndex + 1} for ${project.projectName}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 900px"
                  className="object-contain rounded-lg"
                  unoptimized
                />
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 p-4 rounded-full shadow-lg text-3xl text-gray-800 transition-all duration-200 hover:scale-110 z-10 font-bold"
                  onClick={() => setPopupIndex(i => (i === project.galleryImages.length - 1 ? 0 : i + 1))}
                  aria-label="Next image"
                >
                  ›
                </button>
              </div>

              {/* Image info */}
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">
                  Image {popupIndex + 1} of {project.galleryImages.length}
                </p>
              </div>

              {/* Dots navigation */}
              <div className="flex justify-center gap-2 flex-wrap">
                {project.galleryImages.map((img, i) => (
                  <button
                    key={img + 'popup-dot' + i}
                    className={`transition-all duration-300 rounded-full ${i === popupIndex ? 'bg-blue-500 w-8 h-3' : 'bg-gray-300 hover:bg-gray-400 w-3 h-3'}`}
                    onClick={() => setPopupIndex(i)}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Project Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Left Column - Key Information */}
          <div className="space-y-4">
            {/* Project Status */}
            <div className="group bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-lg hover:border-green-300 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">Project Status</p>
              </div>
              <div className="ml-9">
                <div className={`inline-block px-4 py-2 rounded-full font-semibold capitalize text-sm ${getStatusColor(project.projectStatus)}`}>
                  {project.projectStatus}
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="group bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-lg hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 000-2H7zM4 7a1 1 0 011-1h10a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1V7zM2 11a2 2 0 114 0 2 2 0 01-4 0zm12-4a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">Category</p>
              </div>
              <p className={`text-lg font-semibold capitalize ml-9 ${getCategoryColor(project.category)}`}>{project.category}</p>
            </div>

            {/* Location */}
            <div className="group bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-lg hover:border-red-300 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">Location</p>
              </div>
              <p className="text-lg font-semibold text-gray-900 ml-9">{project.location || 'N/A'}</p>
            </div>
          </div>

          {/* Right Column - Timeline & Budget */}
          {/* Start Date */}
          <div className="space-y-4">
            <div className="group bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-lg hover:border-yellow-300 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors">
                  <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.853-1 4.5 4.5 0 11-4.114 6.98zM9 12H5v4h4v-4z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">Start Date</p>
              </div>
              <p className="text-lg font-semibold text-gray-900 ml-9">{formatDate(project.startDate)}</p>
            </div>

            {/* Expected End Date */}
            <div className="group bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-lg hover:border-indigo-300 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                  <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">Expected End Date</p>
              </div>
              <p className="text-lg font-semibold text-gray-900 ml-9">{formatDate(project.expectedEndDate)}</p>
            </div>

            {/* Completion */}
            <div className="group bg-impact-gold/10 rounded-xl p-5 shadow-sm border border-impact-gold/40 hover:shadow-lg hover:border-impact-gold/60 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-impact-gold rounded-lg group-hover:bg-impact-gold transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-xs text-gray-700 font-bold uppercase tracking-widest">Completion</p>
              </div>
              <p className="text-xl font-semibold text-impact-gold ml-9">{project.completion}%</p>
            </div>
          </div>
        </div>

        {/* Description & Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Description */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-impact-gold/40 transition-all duration-300 group">
            <h3 className="text-[18px] md:text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <div className="p-2 bg-impact-gold rounded-lg group-hover:bg-impact-gold transition-colors">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </div>
              Description
            </h3>
            <p className="text-gray-700 leading-relaxed text-base">{project.projectDescription || 'No description provided.'}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 text-center hover:shadow-lg hover:border-blue-300 transition-all duration-300 group transform hover:-translate-y-1">
            <div className="inline-block p-3 bg-impact-gold rounded-lg mb-3 group-hover:bg-blue-200 transition-colors">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-[24px] md:text-[28px] font-black text-impact-gold mb-1">{project.completion}%</p>
            <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">Complete</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 text-center hover:shadow-lg hover:border-purple-300 transition-all duration-300 group transform hover:-translate-y-1">
            <div className="inline-block p-3 bg-purple-100 rounded-lg mb-3 group-hover:bg-purple-200 transition-colors">
              <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
              </svg>
            </div>
            <p className="text-[24px] md:text-[28px] font-bold text-purple-600 mb-1">
              {project.galleryImages ? project.galleryImages.length : 0}
            </p>
            <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">Gallery Images</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 text-center hover:shadow-lg hover:border-orange-300 transition-all duration-300 group transform hover:-translate-y-1">
            <div className="inline-block p-3 bg-orange-100 rounded-lg mb-3 group-hover:bg-orange-200 transition-colors">
              <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.853-1 4.5 4.5 0 11-4.114 6.98zM9 12H5v4h4v-4z" />
              </svg>
            </div>
            <p className="text-[24px] md:text-[28px] font-bold text-orange-600 mb-1">
              {project.startDate ? new Date(project.startDate).getFullYear() : 'N/A'}
            </p>
            <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">Started</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 text-center hover:shadow-lg hover:border-green-300 transition-all duration-300 group transform hover:-translate-y-1">
            <div className="inline-block p-3 bg-green-100 rounded-lg mb-3 group-hover:bg-green-200 transition-colors">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.853-1 4.5 4.5 0 11-4.114 6.98zM9 12H5v4h4v-4z" />
              </svg>
            </div>
            <p className="text-[24px] md:text-[28px] font-bold text-green-600 mb-1">
              {project.expectedEndDate ? new Date(project.expectedEndDate).getFullYear() : 'N/A'}
            </p>
            <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">Completed</p>
          </div>
        </div>
      </div>
    </section>
  );
}
