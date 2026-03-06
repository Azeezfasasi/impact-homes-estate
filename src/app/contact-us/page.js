import ContactUsMain from "@/components/home-component/ContactUsMain";
import MainNav from "@/components/home-component/MainNav";

export default function ContactUs() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Contact Us' }
  ]

  return (
    <>
    <MainNav
      title="Contact Us"
      subtitle="Have questions or want to work with us? Reach out using the form below or through our contact details."
      breadcrumbs={breadcrumbs}
    />
    <ContactUsMain />
    </>
  )
}
