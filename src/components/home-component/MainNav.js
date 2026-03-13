'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Menu, X, LogIn, ChevronDown, CircleUserRound, LogOut, User, Settings } from 'lucide-react'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'

export default function MainNav({ hideBackgroundImage = false, title, subtitle, breadcrumbs }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const userDropdownRef = useRef(null)
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const isButtonClickRef = useRef(false)
  
  // Get auth context using the custom hook
  const auth = useAuth()
  const user = auth?.user || null
  const logout = auth?.logout || null
  const loading = auth?.loading || false
  const userName = user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : null
  
  // Ensure component is mounted before rendering user-specific UI
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle scroll to hide top info bar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown)
  }

  const handleLogout = async () => {
    try {
      if (logout) {
        await logout()
      }
      setUserDropdownOpen(false)
      toast.success('Logged out successfully')
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
      toast.error('Logout failed')
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Skip if this was a button click
      if (isButtonClickRef.current) {
        isButtonClickRef.current = false
        return
      }
      
      if (userDropdownRef.current) {
        const isInside = userDropdownRef.current.contains(event.target)
        if (!isInside) {
          setUserDropdownOpen(false)
        }
      }
    }

    // Use 'click' instead of 'mousedown' to ensure button handlers execute first
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <div className={`w-full text-white relative shadow-lg ${isScrolled ? 'pb-0' : 'pb-4'}`}>
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
      
      {/* Top Info Bar - Hidden when scrolled */}
      {!isScrolled && (
      <div className="text-white py-3 px-4 z-10 relative">
        {/* add black overlay only to the top info bar */}
        <div className="relative">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-4 text-sm pb-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
                    <Image src="/img/logowhite.png" alt="Impact Homes Logo" width={170} height={50} className="md:ml-0 w-full h-[60px] lg:h-[100px]" />
                </Link>
                
            <div className='gap-10 hidden lg:flex'>
                {/* Phone */}
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 impact-gold flex items-center justify-center">
                    <span className="text-xs">☎</span>
                    </div>
                    <div>
                    <p className="text-white text-xs">Call Us</p>
                    <p className="font-semibold text-white">(+234) 0704 099 9508</p>
                    </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 impact-gold flex items-center justify-center">
                    <span className="text-xs">✉</span>
                    </div>
                    <div>
                    <p className="text-white text-xs">Send us an email</p>
                    <p className="font-semibold text-white">Info@impacthomes.ng</p>
                    </div>
                </div>

                {/* Address */}
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 impact-gold flex items-center justify-center">
                    <span className="text-xs">📍</span>
                    </div>
                    <div>
                    <p className="text-white text-xs">Address</p>
                    <p className="font-semibold text-white">Flat I, House 8, Wing 2 Federal housing Authority Guzape, Abuja</p>
                    </div>
                </div>
            </div>
        </div>
        </div>
      </div>
      )}

      {/* Main Navigation Bar */}
      <nav className={`text-white sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/90' : ''}`}>
        <div className={`mx-auto px-4 relative ${isScrolled ? 'w-full' : 'max-w-7xl'}`}>
            {!isScrolled && <div className="absolute inset-0 bg-black/50" />}
          <div className="flex items-center justify-between gap-6 h-20">

            {/* Logo - Show when scrolled */}
            {isScrolled && (
              <Link href="/" className="flex items-center gap-2 z-10 relative">
                <Image src="/img/logowhite.png" alt="Impact Homes Logo" width={140} height={40} className="h-10 w-auto" />
              </Link>
            )}

            {/* Desktop Navigation Menu */}
            <div className="hidden lg:flex items-center gap-8 z-10 relative">
              <Link
                href="/"
                className="text-white font-semibold hover:text-impact-gold transition"
              >
                HOME
              </Link>

              {/* About Dropdown */}
              <div className="relative group">
                <button
                  onClick={() => toggleDropdown('about')}
                  className="text-white font-semibold hover:text-impact-gold transition flex items-center gap-1"
                >
                  ABOUT
                  <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-200" />
                </button>
                <div className="absolute left-0 mt-0 w-48 bg-black/95 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                  <Link
                    href="/about-us"
                    className="block px-4 py-2 text-white hover:text-impact-gold hover:bg-white/5 transition"
                  >
                    ABOUT US
                  </Link>
                  <Link
                    href="/gallery"
                    className="block px-4 py-2 text-white hover:text-impact-gold hover:bg-white/5 transition"
                  >
                    GALLERY
                  </Link>
                  <Link
                    href="/blog"
                    className="block px-4 py-2 text-white hover:text-impact-gold hover:bg-white/5 transition"
                  >
                    Blog
                  </Link>
                  <Link
                    href="/schedule-inspection"
                    className="block px-4 py-2 text-white hover:text-impact-gold hover:bg-white/5 transition"
                  >
                    Schedule Inspection
                  </Link>
                </div>
              </div>

              <Link
                href="/all-properties"
                className="text-white font-semibold hover:text-impact-gold transition"
              >
                PROPERTIES
              </Link>
              <Link
                href="/projects"
                className="text-white font-semibold hover:text-impact-gold transition"
              >
                PROJECTS
              </Link>

              {/* Become a Sales Partner Dropdown */}
              <div className="relative group">
                <button
                  onClick={() => toggleDropdown('partner')}
                  className="text-white font-semibold hover:text-impact-gold transition flex items-center gap-1"
                >
                  BECOME A SALES PARTNER
                  <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-200" />
                </button>
                <div className="absolute left-0 mt-0 w-56 bg-black/95 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                  <Link
                    href="become-individual-partner"
                    className="block px-4 py-2 text-white hover:text-impact-gold hover:bg-white/5 transition"
                  >
                    INDIVIDUAL
                  </Link>
                  <Link
                    href="become-corporate-partner"
                    className="block px-4 py-2 text-white hover:text-impact-gold hover:bg-white/5 transition"
                  >
                   CORPORATE
                  </Link>
                </div>
              </div>

              <Link
                href="special-offer"
                className="hover:text-impact-gold transition"
              >
                SPECIAL OFFERS
              </Link>

              <Link
                href="/contact-us"
                className="hover:text-impact-gold transition"
              >
                Contact Us
              </Link>
            </div>

            {/* Right Side Icons and Button */}
            <div className="hidden lg:flex items-center gap-6 z-[9999] relative">
              {mounted && !loading ? (
                user && userName ? (
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      isButtonClickRef.current = true
                      setUserDropdownOpen(!userDropdownOpen)
                    }}
                    className="flex items-center gap-2 hover:text-impact-gold transition"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={userName}
                        className="w-10 h-10 rounded-full object-cover border-2 border-impact-gold"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-impact-gold flex items-center justify-center text-white font-semibold text-sm">
                        {userName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                      </div>
                    )}
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        userDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-black/95 border border-gray-700 rounded-lg shadow-xl py-2 z-[99999]">
                      <div className="px-4 py-3 border-b border-gray-700">
                        <p className="font-semibold text-white">{userName}</p>
                        <p className="text-sm text-gray-300">{user.email || 'No email'}</p>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          isButtonClickRef.current = true
                          setUserDropdownOpen(false)
                          router.push('/dashboard')
                        }}
                        className="w-full block text-left px-4 py-2 text-white hover:text-impact-gold hover:bg-white/5 transition"
                      >
                        <div className="flex items-center gap-2">
                          <User size={16} />
                          Dashboard
                        </div>
                      </button>
                      
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          isButtonClickRef.current = true
                          setUserDropdownOpen(false)
                          router.push('/dashboard/all-property')
                        }}
                        className="w-full block text-left px-4 py-2 text-white hover:text-impact-gold hover:bg-white/5 transition"
                      >
                        <div className="flex items-center gap-2">
                          <User size={16} />
                          Manage Properties
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          isButtonClickRef.current = true
                          setUserDropdownOpen(false)
                          router.push('/dashboard/my-profile')
                        }}
                        className="w-full block text-left px-4 py-2 text-white hover:text-impact-gold hover:bg-white/5 transition"
                      >
                        <div className="flex items-center gap-2">
                          <Settings size={16} />
                          Profile
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          isButtonClickRef.current = true
                          setUserDropdownOpen(false)
                          handleLogout()
                        }}
                        className="w-full block text-left px-4 py-2 text-white hover:text-red-400 hover:bg-white/5 transition border-t border-gray-700"
                      >
                        <div className="flex items-center gap-2">
                          <LogOut size={16} />
                          Logout
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="hover:text-impact-gold transition">
                  <CircleUserRound size={40} />
                </Link>
              )
              ) : null}

              <Link
                href="/download-brochure"
                className="bg-impact-gold hover:bg-impact-gold/90 text-white px-6 py-3 rounded font-semibold transition whitespace-nowrap"
              >
                DOWNLOAD BROCHURES
              </Link>
            </div>

            {/* Mobile Menu Button */}
             {!isScrolled && (
            <button
              className="lg:hidden flex items-center gap-4 z-10 relative"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
              )}
            <div className="lg:hidden flex items-center gap-4 z-10 relative">
              <Link
                href="/download-brochure"
                className="bg-impact-gold hover:bg-impact-gold/90 text-[9px] md:text-[14px] text-white px-2 py-2 rounded font-semibold transition whitespace-nowrap"
              >
                DOWNLOAD BROCHURES
              </Link>
              {mounted && !loading ? (
                user ? (
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      isButtonClickRef.current = true
                      setUserDropdownOpen(!userDropdownOpen)
                    }}
                    className="flex items-center hover:text-impact-gold transition"
                  >
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-impact-gold"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-impact-gold flex items-center justify-center text-white font-semibold text-xs">
                        {user.name
                          ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase()
                          : 'U'}
                      </div>
                    )}
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-black/95 border border-gray-700 rounded-lg shadow-xl py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-700">
                        <p className="font-semibold text-white text-sm">{user.name}</p>
                        <p className="text-xs text-gray-300">{user.email}</p>
                      </div>
                      
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          isButtonClickRef.current = true
                          setUserDropdownOpen(false)
                          router.push('/dashboard')
                        }}
                        className="w-full block text-left px-4 py-2 text-white hover:text-impact-gold hover:bg-white/5 transition"
                      >
                        <div className="flex items-center gap-2">
                          <User size={16} />
                          Dashboard
                        </div>
                      </button>
                      
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          isButtonClickRef.current = true
                          setUserDropdownOpen(false)
                          router.push('/dashboard/all-property')
                        }}
                        className="w-full block text-left px-4 py-2 text-white hover:text-impact-gold hover:bg-white/5 transition"
                      >
                        <div className="flex items-center gap-2">
                          <User size={16} />
                          Manage Properties
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          isButtonClickRef.current = true
                          setUserDropdownOpen(false)
                          router.push('/dashboard/my-profile')
                        }}
                        className="w-full block text-left px-4 py-2 text-white hover:text-impact-gold hover:bg-white/5 transition text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <User size={16} />
                          Profile
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          isButtonClickRef.current = true
                          setUserDropdownOpen(false)
                          handleLogout()
                        }}
                        className="w-full block text-left px-4 py-2 text-white hover:text-red-400 hover:bg-white/5 transition border-t border-gray-700 text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <LogOut size={16} />
                          Logout
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login">
                  <CircleUserRound size={30} />
                </Link>
              )
              ) : null}
              {isScrolled && (
                <button
                  className="lg:hidden flex items-center gap-4 z-10 relative"
                  onClick={toggleMobileMenu}
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              )}
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden pb-4 border-t border-gray-700 z-10 relative">
              <div className="flex flex-col gap-3 py-4">
                <Link href="/" className="text-impact-gold font-semibold">
                  HOME
                </Link>

                {/* Mobile About Dropdown */}
                <div>
                  <button
                    onClick={() => toggleDropdown('mobile-about')}
                    className="w-full text-left hover:text-impact-gold flex items-center justify-between"
                  >
                    ABOUT
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        openDropdown === 'mobile-about' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openDropdown === 'mobile-about' && (
                    <div className="ml-4 mt-2 border-l border-gray-600 pl-3 space-y-2">
                      <Link href="/about-us" className="block text-white hover:text-impact-gold text-sm">
                        About Us
                      </Link>
                      <Link href="/gallery" className="block text-white hover:text-impact-gold text-sm">
                        Gallery
                      </Link>
                      <Link href="/schedule-inspection" className="block text-white hover:text-impact-gold text-sm">
                        Schedule Inspection
                      </Link>
                    </div>
                  )}
                </div>

                <Link href="/all-properties" className="hover:text-impact-gold">
                  PROPERTIES
                </Link>
                <Link href="/projects" className="hover:text-impact-gold">
                  PROJECTS
                </Link>
                <Link href="/blog" className="hover:text-impact-gold">
                  BLOG
                </Link>

                {/* Mobile Sales Partner Dropdown */}
                <div>
                  <button
                    onClick={() => toggleDropdown('mobile-partner')}
                    className="w-full text-left hover:text-impact-gold flex items-center justify-between"
                  >
                    BECOME A SALES PARTNER
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        openDropdown === 'mobile-partner' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openDropdown === 'mobile-partner' && (
                    <div className="ml-4 mt-2 border-l border-gray-600 pl-3 space-y-2">
                      <Link href="become-individual-partner" className="block text-white hover:text-impact-gold text-sm">
                        Individual
                      </Link>
                      <Link href="become-corporate-partner" className="block text-white hover:text-impact-gold text-sm">
                        Corporate
                      </Link>
                    </div>
                  )}
                </div>

                <Link href="special-offer" className="hover:text-impact-gold">
                  SPECIAL OFFERS
                </Link>
                <Link
                  href="/contact-us"
                  className="hover:text-impact-gold transition"
                >
                  Contact Us
                </Link>
                <Link
                  href="/download-brochure"
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
  )
}
