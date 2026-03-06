import CompanyOverview from '@/components/home-component/CompanyOverview'
import HistoryMilestones from '@/components/home-component/HistoryMilestones'
import MainNav from '@/components/home-component/MainNav'
import React from 'react'

export default function page() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'About Us' }
  ]

  return (
    <>
    <MainNav
      title="About Us"
      // subtitle="Learn more about our company and values"
      breadcrumbs={breadcrumbs}
    />
    <CompanyOverview />
    <HistoryMilestones />
    </>
  )
}
