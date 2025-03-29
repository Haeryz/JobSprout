import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '@/components/custom/Navbar'

const PublicLayout = () => {
  const location = useLocation()
  const isLandingPage = location.pathname === '/'
  
  return (
    <div className="flex flex-col min-h-svh">
      {isLandingPage && <Navbar />}
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  )
}

export default PublicLayout