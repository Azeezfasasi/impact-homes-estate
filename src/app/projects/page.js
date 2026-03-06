import MainNav from '@/components/home-component/MainNav'
import ProjectsGallery from '@/components/home-component/ProjectsGallery'
import React from 'react'

export default function page() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Projects' }
  ]

  return (
    <>
    <MainNav
      title="Our Projects"
      subtitle="Review some of our completed projects"
      breadcrumbs={breadcrumbs}
    />
        <ProjectsGallery />
    </>
  )
}
