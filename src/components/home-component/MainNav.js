'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Search, Menu, X } from 'lucide-react'

export default function MainNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="w-full text-white relative shadow-lg pb-6">
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Top Info Bar */}
      <div className="text-white py-3 px-4 z-10 relative">
        {/* add black overlay only to the top info bar */}
        <div className="relative">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm py-10">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
                    <span className="text-white">Impact</span>
                    <span className="text-impact-gold">Home Estate</span>
                </Link>
                
            <div className='gap-10 hidden lg:flex'>
                {/* Phone */}
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 impact-gold flex items-center justify-center">
                    <span className="text-xs">☎</span>
                    </div>
                    <div>
                    <p className="text-impact-gold text-xs">Call Us</p>
                    <p className="font-semibold text-white">+234 704-800-1075</p>
                    </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 impact-gold flex items-center justify-center">
                    <span className="text-xs">✉</span>
                    </div>
                    <div>
                    <p className="text-impact-gold text-xs">Send us an email</p>
                    <p className="font-semibold text-white">Info@Hall7projects.Com</p>
                    </div>
                </div>

                {/* Address */}
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 impact-gold flex items-center justify-center">
                    <span className="text-xs">📍</span>
                    </div>
                    <div>
                    <p className="text-impact-gold text-xs">Address</p>
                    <p className="font-semibold text-white">8c Buzi Close, Amazon Street, Maitama</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 relative">
            <div className="absolute inset-0 bg-black/50" />
          <div className="flex items-center justify-between h-20">

            {/* Desktop Navigation Menu */}
            <div className="hidden md:flex items-center gap-8 z-10 relative">
              <Link
                href="/"
                className="text-white font-semibold hover:text-impact-gold transition"
              >
                HOME
              </Link>
              <div className="group relative">
                <button className="flex items-center gap-1 hover:text-impact-gold transition">
                  ABOUT
                  <span>▼</span>
                </button>
              </div>
              <div className="group relative">
                <button className="flex items-center gap-1 hover:text-impact-gold transition">
                  PROJECTS
                  <span>▼</span>
                </button>
              </div>
              <Link
                href="/blog"
                className="hover:text-impact-gold transition"
              >
                BLOG
              </Link>
              <div className="group relative">
                <button className="flex items-center gap-1 hover:text-impact-gold transition">
                  BECOME A SALES PARTNER
                  <span>▼</span>
                </button>
              </div>
              <Link
                href="#"
                className="hover:text-impact-gold transition"
              >
                SPECIAL OFFERS
              </Link>
            </div>

            {/* Right Side Icons and Button */}
            <div className="hidden md:flex items-center gap-6 z-10 relative">
              <button className="hover:text-impact-gold transition">
                <Search size={20} />
              </button>
              <Link
                href="#"
                className="bg-impact-gold hover:bg-impact-gold/90 text-white px-6 py-3 rounded font-semibold transition whitespace-nowrap"
              >
                DOWNLOAD BROCHURES
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden flex items-center gap-4 z-10 relative"
              onClick={toggleMobileMenu}
            >
              <Search size={20} />
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden pb-4 border-t border-gray-700 z-10 relative">
              <div className="flex flex-col gap-3 py-4">
                <Link href="/" className="text-impact-gold font-semibold">
                  HOME
                </Link>
                <Link href="/about" className="hover:text-impact-gold">
                  ABOUT
                </Link>
                <Link href="/projects" className="hover:text-impact-gold">
                  PROJECTS
                </Link>
                <Link href="/blog" className="hover:text-impact-gold">
                  BLOG
                </Link>
                <Link href="#" className="hover:text-impact-gold">
                  BECOME A SALES PARTNER
                </Link>
                <Link href="#" className="hover:text-impact-gold">
                  SPECIAL OFFERS
                </Link>
                <Link
                  href="#"
                  className="bg-impact-gold hover:bg-impact-gold/90 text-white px-4 py-2 rounded font-semibold mt-2 inline-block"
                >
                  DOWNLOAD BROCHURES
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
    </div>
  )
}
