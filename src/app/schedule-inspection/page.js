import HomeContact from '@/components/home-component/HomeContact'
import MainNav from '@/components/home-component/MainNav'
import React from 'react'

export default function ScheduleInspection() {
    const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Schedule Inspection' }
  ]
  return (
      <>
      <MainNav
        title="Schedule Inspection"
        breadcrumbs={breadcrumbs}
      />
      <HomeContact />
      </>
  )
}
