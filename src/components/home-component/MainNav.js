'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Search, Menu, X, LogIn } from 'lucide-react'
import Image from 'next/image'

export default function MainNav({ hideBackgroundImage = false, title, subtitle, breadcrumbs }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="w-full text-white relative shadow-lg pb-6">
      {/* Background Image for non-homepage pages */}
      {!hideBackgroundImage && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('/img/real4.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Top Info Bar */}
      <div className="text-white py-3 px-4 z-10 relative">
        {/* add black overlay only to the top info bar */}
        <div className="relative">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-4 text-sm pb-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
                    <Image src="/img/logowhite.png" alt="Impact Homes Logo" width={170} height={50} className="ml-2 w-full lg:h-[100px]" />
                </Link>
                
            <div className='gap-10 hidden lg:flex'>
                {/* Phone */}
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 impact-gold flex items-center justify-center">
                    <span className="text-xs">☎</span>
                    </div>
                    <div>
                    <p className="text-impact-gold text-xs">Call Us</p>
                    <p className="font-semibold text-white">(+234) 0704 099 9508</p>
                    </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 impact-gold flex items-center justify-center">
                    <span className="text-xs">✉</span>
                    </div>
                    <div>
                    <p className="text-impact-gold text-xs">Send us an email</p>
                    <p className="font-semibold text-white">Info@impacthomes.ng</p>
                    </div>
                </div>

                {/* Address */}
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 impact-gold flex items-center justify-center">
                    <span className="text-xs">📍</span>
                    </div>
                    <div>
                    <p className="text-impact-gold text-xs">Address</p>
                    <p className="font-semibold text-white">Flat I, House 8, Wing 2 Federal housing Authority Guzape, Abuja</p>
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
            <div className="hidden lg:flex items-center gap-8 z-10 relative">
              <Link
                href="/"
                className="text-white font-semibold hover:text-impact-gold transition"
              >
                HOME
              </Link>
              <Link
                href="/about-us"
                className="text-white font-semibold hover:text-impact-gold transition"
              >
                ABOUT
              </Link>
              <Link
                href="/all-properties"
                className="text-white font-semibold hover:text-impact-gold transition"
              >
                Properties
              </Link>
              <Link
                href="/projects"
                className="text-white font-semibold hover:text-impact-gold transition"
              >
                PROJECTS
              </Link>
              <Link
                href="/blog"
                className="hover:text-impact-gold transition"
              >
                BLOG
              </Link>
              <Link
                href="#"
                className="text-white font-semibold hover:text-impact-gold transition"
              >
                BECOME A SALES PARTNER
              </Link>
              <Link
                href="#"
                className="hover:text-impact-gold transition"
              >
                SPECIAL OFFERS
              </Link>
            </div>

            {/* Right Side Icons and Button */}
            <div className="hidden lg:flex items-center gap-6 z-10 relative">
              <Link href="/login" className="hover:text-impact-gold transition">
                <LogIn size={20} />
              </Link>
              <Link
                href="#"
                className="bg-impact-gold hover:bg-impact-gold/90 text-white px-6 py-3 rounded font-semibold transition whitespace-nowrap"
              >
                DOWNLOAD BROCHURES
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden flex items-center gap-4 z-10 relative"
              onClick={toggleMobileMenu}
            >
              {/* <Search size={20} /> */}
              <LogIn size={20} />
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden pb-4 border-t border-gray-700 z-10 relative">
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

      {/* Page Title and Breadcrumbs Section */}
      {(title || breadcrumbs) && (
        <section className="mt-10 lg:mt-10 relative z-10">
          <div className="container mx-auto px-6 lg:px-20 text-center">
            {/* Page Title */}
            {title && (
              <h1 className="text-[24px] sm:text-[28px] lg:text-[36px] font-bold text-white mb-4">
                {title}
              </h1>
            )}
            
            {/* Breadcrumbs */}
            {breadcrumbs && (
              <nav className="text-white/80 text-sm mb-4" aria-label="Breadcrumb">
                {breadcrumbs.map((crumb, index) => (
                  <span key={index}>
                    {index !== 0 && <span className="mx-2">/</span>}
                    {crumb.href ? (
                      <a href={crumb.href} className="hover:text-white transition">
                        {crumb.label}
                      </a>
                    ) : (
                      <span className="text-white font-medium">{crumb.label}</span>
                    )}
                  </span>
                ))}
              </nav>
            )}

            {/* Optional Subtitle */}
            {subtitle && (
              <p className="text-white/90 max-w-2xl mx-auto text-lg">
                {subtitle}
              </p>
            )}
          </div>
        </section>
      )}

    </div>
    </div>
  )
}
