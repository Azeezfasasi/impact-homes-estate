import OurServices from '@/components/home-component/OurServices'
import MainNav from '@/components/home-component/MainNav'
import React from 'react'

export const metadata = {
  title: 'Our Services - Impact Homes Real Estate',
  description: 'Explore our comprehensive real estate services including property sales, rentals, investment advisory, and property management. We are committed to providing exceptional service to all our clients.',
  keywords: 'Real Estate Services, Property Sales, Property Rental, Investment Advisory',
  openGraph: {
    title: 'Our Services - Impact Homes Real Estate',
    description: 'Explore our comprehensive real estate services including property sales, rentals, and investment advisory.',
    url: 'https://impacthomes.com/services',
    type: 'website',
  },
}

export default function page() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Services' }
  ]

  return (
    <>
    <MainNav
      title="Our Services"
      subtitle="Welcome to our services page"
      breadcrumbs={breadcrumbs}
    />
    <OurServices />
    </>
  )
}
