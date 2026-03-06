import '../globals.css'
import FooterSection from '@/components/home-component/Footerection';
// import MainNav from '@/components/home-component/MainNav';
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from 'react-hot-toast';
// import MainNav from '@/components/home-component/MainNav';

export const metadata = {
  title: 'Impact Homes Real Estate - Your Trusted Partner in Property Investment',
  description: 'Discover exceptional real estate investment opportunities with Impact Homes Real Estate. We provide expert guidance, personalized service, and a wide range of properties to help you achieve your investment goals. Whether you are a first-time buyer or an experienced investor, we are here to support you every step of the way.',
  icons: {
    icon: '/impact2.png',
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="site-main-header sticky top-0 z-50">
            {/* <MainNav /> */}
          </div>
          <main>{children}</main>
          <div className="site-main-header">
            <FooterSection />
          </div>
          <Toaster position="top-center" reverseOrder={false} />
        </AuthProvider>
      </body>
    </html>
  )
}
