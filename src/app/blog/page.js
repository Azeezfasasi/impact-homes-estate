import BlogNews from '@/components/home-component/BlogNews'
import MainNav from '@/components/home-component/MainNav'
import React from 'react'

export default function page() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Blog' }
  ]

  return (
    <>
    <MainNav
      title="Real Estate Insights & News"
      subtitle="Stay updated with the latest trends, insights, and news in real estate."
      breadcrumbs={breadcrumbs}
    />
    <BlogNews />
    </>
  )
}
