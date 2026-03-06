import OurServices from '@/components/home-component/OurServices'
import MainNav from '@/components/home-component/MainNav'
import React from 'react'

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
