import '../globals.css'
import FooterSection from '@/components/home-component/Footerection';
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from 'react-hot-toast';
// import MainNav from '@/components/home-component/MainNav';

export const metadata = {
  title: 'Rayob Engineering & Mgt. Co. Ltd',
  description: 'Innovative Engineering Solutions for Modern Projects.',
  icons: {
    icon: '/rayob1.jpg',
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
