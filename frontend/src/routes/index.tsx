import React from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import PublicLayout from '@/layouts/PublicLayout'
import ProtectedLayout from '@/layouts/ProtectedLayout'
import LandingPage from '@/pages/LandingPage'
import Home from '@/pages/Home'
import JobSearch from '@/pages/JobSearch'
import Profile from '@/pages/Profile'
import SignIn from '@/pages/SignIn'
import SignUp from '@/pages/SignUp'
import Subscription from '@/pages/Subscription'

// This function would normally check if the user is authenticated
// For development, it always returns true
const isAuthenticated = () => {
  // TODO: Implement actual authentication check
  return true // Always return true during development
}

// This would be a proper auth guard component
// Currently allowing all access for development
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const authenticated = isAuthenticated()
  
  // For development, we're allowing access to all routes
  // Later this will redirect unauthenticated users to login
  if (!authenticated) {
    // Uncomment this when ready to implement authentication
    // return <Navigate to="/auth/sign-in" replace />
  }
  
  return <>{children}</>
}

// Define the routes configuration
const routes = [
  // Public routes (with Navbar)
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />
      },
      {
        path: "auth",
        children: [
          {
            index: true,
            element: <Navigate to="/auth/sign-in" replace />
          },
          {
            path: "sign-in",
            element: <SignIn />
          },
          {
            path: "sign-up",
            element: <SignUp />
          }
        ]
      }
    ]
  },
  
  // Protected routes (with future Sidebar)
  {
    path: "/app",
    element: (
      <AuthGuard>
        <ProtectedLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/app/home" replace />
      },
      {
        path: "home",
        element: <Home />
      },
      {
        path: "jobs",
        element: <JobSearch />
      },
      {
        path: "profile",
        element: <Profile />
      },
      {
        path: "subscription",
        element: <Subscription />
      }
    ]
  },
  
  // Catch-all route for Netlify SPA support
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
]

// Export the Routes component directly for better HMR compatibility
export const AppRoutes = () => {
  return <RouterProvider router={createBrowserRouter(routes)} />
}