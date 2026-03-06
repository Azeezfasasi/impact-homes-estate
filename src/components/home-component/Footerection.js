'use client'

import React, { useState, useEffect } from 'react'

export default function FooterSection() {
  const [showScrollButton, setShowScrollButton] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {/* Scroll to Top Button */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      {/* Footer */}
      <footer className="relative bg-gray-900 text-white pt-10">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1200&h=600&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} />

        {/* Main Footer Content */}
        <div className="relative z-10 px-5 md:px-8 lg:px-10 py-16 md:py-0">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-2 mb-12">
              
              {/* Logo & Business Hours Section */}
              <div className="flex flex-col">
                <div className="mb-8">
                  <h2 className="text-4xl md:text-3xl font-bold mb-1">
                    <span className="text-purple-500">HALL</span>
                    <span className="text-purple-500"> 7</span>
                  </h2>
                  <p className="text-gray-300 text-sm tracking-widest">R E A L E S T A T E</p>
                </div>

                <div>
                  <h3 className="text-xl md:text-lg font-bold mb-4">Business Hours</h3>
                  <p className="text-gray-400 text-base md:text-sm">Mon-Fri 9.00am - 6.00pm</p>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-xl md:text-lg font-bold mb-6">Quick Links</h3>
                <ul className="space-y-4">
                  <li>
                    <a href="/projects" className="text-gray-400 hover:text-purple-400 transition-colors flex items-center group">
                      <span className="mr-2 group-hover:translate-x-1 transition-transform">›</span>
                      <span>Projects</span>
                    </a>
                  </li>
                  <li>
                    <a href="/blog" className="text-gray-400 hover:text-purple-400 transition-colors flex items-center group">
                      <span className="mr-2 group-hover:translate-x-1 transition-transform">›</span>
                      <span>Blog</span>
                    </a>
                  </li>
                  <li>
                    <a href="/contact" className="text-gray-400 hover:text-purple-400 transition-colors flex items-center group">
                      <span className="mr-2 group-hover:translate-x-1 transition-transform">›</span>
                      <span>Contact us</span>
                    </a>
                  </li>
                </ul>
              </div>

              {/* More Links */}
              <div>
                <h3 className="text-xl md:text-lg font-bold mb-6 opacity-0 md:opacity-100">‌</h3>
                <ul className="space-y-4">
                  <li>
                    <a href="/about" className="text-gray-400 hover:text-purple-400 transition-colors flex items-center group">
                      <span className="mr-2 group-hover:translate-x-1 transition-transform">›</span>
                      <span>About us</span>
                    </a>
                  </li>
                  <li>
                    <a href="/gallery" className="text-gray-400 hover:text-purple-400 transition-colors flex items-center group">
                      <span className="mr-2 group-hover:translate-x-1 transition-transform">›</span>
                      <span>Our Gallery</span>
                    </a>
                  </li>
                  <li>
                    <a href="/sitemap" className="text-gray-400 hover:text-purple-400 transition-colors flex items-center group">
                      <span className="mr-2 group-hover:translate-x-1 transition-transform">›</span>
                      <span>Sitemap</span>
                    </a>
                  </li>
                </ul>
              </div>

              {/* Head Office */}
              <div>
                <h3 className="text-xl md:text-lg font-bold mb-6">Head Office</h3>
                <div className="space-y-4 text-sm md:text-base">
                  <div>
                    <p className="text-gray-400">8c Buzi Close, Amazon Street, Maitama, Abuja.</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Sales & Inspection:</p>
                    <a href="tel:+234704800107" className="text-gray-400 hover:text-purple-400 transition-colors">
                      +234 704-800-1075
                    </a>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Enquiries:</p>
                    <a href="tel:+234704800106" className="text-gray-400 hover:text-purple-400 transition-colors">
                      +234 704-800-1076
                    </a>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Email:</p>
                    <a href="mailto:info@hall7projects.com" className="text-gray-400 hover:text-purple-400 transition-colors break-all">
                      info@hall7projects.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative z-10 bg-purple-600 border-t-4 border-purple-700 px-5 md:px-8 lg:px-10 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-center md:text-left text-sm md:text-base text-gray-100">
                © {new Date().getFullYear()} Copyright Impact Homes Real Estate. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
