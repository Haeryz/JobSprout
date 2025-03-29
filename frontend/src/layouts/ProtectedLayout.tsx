import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/custom/Sidebar'

const ProtectedLayout = () => {
  return (
    <div className="flex flex-col min-h-svh">
      <div className="flex flex-row h-full">
        <Sidebar />
        <main className="flex-grow p-6 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default ProtectedLayout