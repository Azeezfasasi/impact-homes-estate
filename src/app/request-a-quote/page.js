// import PageTitle from "@/components/home-component/PageTitle";
import RequestQuote from "@/components/home-component/RequestQuote";

export const metadata = {
  title: 'Request a Quote - Impact Homes Real Estate',
  description: 'Get a free, customized quote for your real estate needs. Submit your details and our team will provide a detailed proposal within 24 hours.',
  keywords: 'Real Estate Quote, Free Estimate, Property Valuation',
  openGraph: {
    title: 'Request a Quote - Impact Homes Real Estate',
    description: 'Get a free, customized quote for your real estate needs from our expert team.',
    url: 'https://impacthomes.com/request-a-quote',
    type: 'website',
  },
}

export default function RequestAQuote() {
  return (
    <>
    {/* <PageTitle title="Request A Quote" subtitle="You can request a free quotes" /> */}
    <RequestQuote />
    </>
  )
}
