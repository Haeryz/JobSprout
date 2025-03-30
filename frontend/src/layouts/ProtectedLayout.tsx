import { Outlet } from 'react-router-dom'
import { SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from '@/components/custom/Sidebar'

const ProtectedLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full">
        <AppSidebar />
        <main className="flex-1 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  )
}

export default ProtectedLayout