import React from 'react'
import OurServices from '@/components/home-component/OurServices'
import FeaturedProjects from '@/components/home-component/FeaturedProjects'
import TestimonialsSection from '@/components/home-component/TestimonialsSection'
import CallToAction from '@/components/home-component/CallToAction'
import RequestQuote from '@/components/home-component/RequestQuote'
import ClientsLogoSlider from '@/components/home-component/ClientsLogoSlider'
import SubscribeToNewsletter from '@/components/home-component/SubscribeToNewsletter'
import WhyRayob from '@/components/home-component/WhyRayob'
import HeroSlider from '@/components/home-component/HeroSlider'
import WelcomeCta from '@/components/home-component/WelcomeCta'
import HomeContact from '@/components/home-component/HomeContact'
import ClientReview from '@/components/home-component/ClientReview'
import FeaturedProperties from '@/components/home-component/FeaturedProperties'

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <WelcomeCta />
      <FeaturedProperties />
      <HomeContact />
      <ClientReview />
      <ClientsLogoSlider />
      <CallToAction />
      <SubscribeToNewsletter />
    </>
  )
}
