import { useState } from 'react'
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
  ChevronRight,
  Check
} from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const { theme, setTheme } = useTheme()
  const [isHovering, setIsHovering] = useState(false)
  const navigate = useNavigate()
  
  const navItems = ['Home', 'Jobs', 'Companies', 'Resources']

  return (
    <nav className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left: Logo as text */}
          <div className="flex-shrink-0">
            <Link to="/">
              <div className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-b from-[#4ADE80] to-[#22C55E]">
                JobSprout
              </div>
            </Link>
          </div>

          {/* Middle: Navigation Links */}
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white 
                transition-all duration-200 px-3 py-2 text-sm font-medium
                hover:dark:shadow-[0_0_10px_2px_rgba(74,222,128,0.3)] rounded-md"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Right: Theme Selector and Auth Buttons */}
          <div className="flex items-center space-x-4">
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

            {/* Sign In */}
            <Button 
              variant="ghost" 
              className="text-sm font-medium dark:text-gray-300 dark:hover:text-white
              hover:dark:shadow-[0_0_10px_2px_rgba(74,222,128,0.3)] rounded-md"
              onClick={() => navigate('/auth/sign-in')}
            >
              Sign In
            </Button>

            {/* Sign Up */}
            <Button 
              className="bg-gradient-to-b from-[#4ADE80] to-[#22C55E] text-white 
              hover:from-[#22C55E] hover:to-[#22C55E] rounded-full
              dark:shadow-[0_0_5px_1px_rgba(74,222,128,0.3)]
              hover:dark:shadow-[0_0_15px_3px_rgba(74,222,128,0.4)]
              transition-all duration-300"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onClick={() => navigate('/auth/sign-up')}
            >
              Sign Up
              <ChevronRight className={cn(
                "h-4 w-4 ml-1 transition-transform duration-200",
                isHovering && "transform translate-x-1"
              )} />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar