import MainNav from '@/components/home-component/MainNav'
import BrochureDisplay from '@/components/dashboard-components/BrochureManagement/BrochureDisplay'

export default function DownloadBrochure() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Download Brochure' }
  ]

  return (
    <>
      <MainNav
        title="Download Brochures"
        breadcrumbs={breadcrumbs}
        subtitle="Browse and download our comprehensive brochures"
      />
      <BrochureDisplay />
    </>
  )
}
