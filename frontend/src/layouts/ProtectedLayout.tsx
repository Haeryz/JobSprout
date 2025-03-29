import React from 'react'
import { Outlet } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover"
import { cn } from '@/lib/utils'
import { 
  Sun, 
  Moon, 
  MonitorSmartphone, 
  Check,
  Home,
  Search,
  User
} from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

const ProtectedLayout = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex flex-col min-h-svh">
      <div className="flex flex-row h-full">
        <div className="hidden md:flex md:flex-col w-64 bg-gray-50 dark:bg-gray-800 p-4 border-r dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-b from-[#4ADE80] to-[#22C55E]">
              JobSprout
            </div>
            
            {/* Theme Selector */}
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 rounded-full hover:dark:shadow-[0_0_10px_2px_rgba(74,222,128,0.3)]"
                >
                  {theme === 'light' ? (
                    <Sun className="h-5 w-5" />
                  ) : theme === 'dark' ? (
                    <Moon className="h-5 w-5 text-gray-300" />
                  ) : (
                    <MonitorSmartphone className="h-5 w-5" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-2">
                  <div className="grid gap-1">
                    <Button
                      variant="ghost"
                      className="justify-start py-1.5 px-2 w-full dark:hover:bg-gray-700 
                      dark:hover:shadow-[0_0_10px_2px_rgba(74,222,128,0.3)]"
                      onClick={() => setTheme('light')}
                    >
                      <div className="flex items-center">
                        {theme === 'light' && <Check className="mr-2 h-4 w-4" />}
                        <Sun className={cn("mr-2 h-4 w-4", theme !== "light" && "ml-6")} />
                        <span>Light</span>
                      </div>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start py-1.5 px-2 w-full dark:hover:bg-gray-700
                      dark:hover:shadow-[0_0_10px_2px_rgba(74,222,128,0.3)]"
                      onClick={() => setTheme('dark')}
                    >
                      <div className="flex items-center">
                        {theme === 'dark' && <Check className="mr-2 h-4 w-4" />}
                        <Moon className={cn("mr-2 h-4 w-4", theme !== "dark" && "ml-6")} />
                        <span>Dark</span>
                      </div>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start py-1.5 px-2 w-full dark:hover:bg-gray-700
                      dark:hover:shadow-[0_0_10px_2px_rgba(74,222,128,0.3)]"
                      onClick={() => setTheme('system')}
                    >
                      <div className="flex items-center">
                        {theme === 'system' && <Check className="mr-2 h-4 w-4" />}
                        <MonitorSmartphone className={cn("mr-2 h-4 w-4", theme !== "system" && "ml-6")} />
                        <span>System</span>
                      </div>
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <nav className="space-y-2 mt-6">
            <Button variant="ghost" className="w-full justify-start dark:text-gray-300 dark:hover:text-white
              hover:dark:shadow-[0_0_10px_2px_rgba(74,222,128,0.3)]">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
            <Button variant="ghost" className="w-full justify-start dark:text-gray-300 dark:hover:text-white
              hover:dark:shadow-[0_0_10px_2px_rgba(74,222,128,0.3)]">
              <Search className="mr-2 h-4 w-4" />
              Jobs
            </Button>
            <Button variant="ghost" className="w-full justify-start dark:text-gray-300 dark:hover:text-white
              hover:dark:shadow-[0_0_10px_2px_rgba(74,222,128,0.3)]">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
          </nav>
        </div>
        <main className="flex-grow p-6 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default ProtectedLayout