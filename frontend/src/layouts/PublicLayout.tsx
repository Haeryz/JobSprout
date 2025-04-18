import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '@/components/custom/Navbar'
import Footer from '@/components/custom/Footer'

const PublicLayout = () => {
  const location = useLocation()
  const isLandingPage = location.pathname === '/'
  const isAuthPage = location.pathname.startsWith('/auth')
  
  return (
    <div className="flex flex-col min-h-screen w-full">
      {isLandingPage && <Navbar />}
      <main className="flex-grow">
        <Outlet />
      </main>
      {!isAuthPage && (
        <Footer />
      )}
    </div>
  )
}

export default PublicLayout