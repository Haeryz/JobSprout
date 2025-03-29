import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'
import { Button } from "@/components/ui/button"
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover"
import { 
  Home,
  Search,
  Crown,
  User,
  Settings,
  Sun, 
  Moon, 
  MonitorSmartphone,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Check
} from 'lucide-react'
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

const Sidebar = () => {
  const location = useLocation()
  const { theme, setTheme } = useTheme()
  const [collapsed, setCollapsed] = useState(false)
  
  // Placeholder user data - this would come from your auth state
  const user = {
    name: "John Doe",
    email: "john@example.com",
    avatarUrl: "" // Empty for now, falls back to initials
  }
  
  // Navigation items
  const navItems = [
    { 
      name: 'Home', 
      path: '/app/home', 
      icon: <Home className="h-5 w-5" /> 
    },
    { 
      name: 'Jobs', 
      path: '/app/jobs', 
      icon: <Search className="h-5 w-5" /> 
    },
    { 
      name: 'Profile', 
      path: '/app/profile', 
      icon: <User className="h-5 w-5" /> 
    },
    { 
      name: 'Subscription', 
      path: '/app/subscription', 
      icon: <Crown className="h-5 w-5" /> 
    }
  ]
  
  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
  }
  
  // Handle sidebar toggle
  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }
  
  return (
    <div 
      className={cn(
        "flex flex-col h-full bg-gray-50 dark:bg-gray-800 border-r dark:border-gray-700 relative transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-64",
        "border-r-4 border-r-green-500/40 dark:border-r-green-600/30"
      )}
    >
      {/* Toggle button - adjusted to be more seamless */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-2.5 top-1/2 transform -translate-y-1/2 w-4 h-10 bg-green-500/40 dark:bg-green-600/30 
        rounded-r-sm flex items-center justify-center cursor-pointer z-10
        hover:bg-green-500/50 dark:hover:bg-green-600/40 transition-colors"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3 text-white/90" />
        ) : (
          <ChevronLeft className="h-3 w-3 text-white/90" />
        )}
      </button>

      {/* Logo */}
      <div className={cn("p-4", collapsed && "flex justify-center")}>
        <Link to="/app/home">
          <div className={cn(
            "font-bold bg-clip-text text-transparent bg-gradient-to-b from-[#4ADE80] to-[#22C55E]",
            collapsed ? "text-2xl" : "text-xl"
          )}>
            {collapsed ? "JS" : "JobSprout"}
          </div>
        </Link>
      </div>
      
      {/* Navigation */}
      <nav className={cn("flex-1 p-4 space-y-2", collapsed && "px-2")}>
        {navItems.map((item) => (
          <Link key={item.name} to={item.path}>
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start dark:text-gray-300 dark:hover:text-white hover:dark:shadow-[0_0_10px_2px_rgba(74,222,128,0.3)]",
                location.pathname === item.path && "bg-gray-200 dark:bg-gray-700 font-medium",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.name : undefined}
            >
              {item.icon}
              {!collapsed && <span className="ml-2">{item.name}</span>}
            </Button>
          </Link>
        ))}
      </nav>
      
      {/* User Profile Section */}
      <div className={cn("p-4 mt-auto", collapsed && "p-2")}>
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              className={cn(
                "w-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg hover:dark:shadow-[0_0_10px_2px_rgba(74,222,128,0.3)]",
                collapsed ? "justify-center" : "justify-start"
              )}
            >
              <div className={cn("flex items-center", collapsed ? "w-auto" : "w-full")}>
                <Avatar className="border-2 border-green-500 dark:border-opacity-50">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="ml-3 text-left">
                    <p className="text-sm font-medium dark:text-gray-200 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                  </div>
                )}
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-3">
              <div className="flex flex-col space-y-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">Signed in as</p>
                <p className="text-sm font-medium dark:text-gray-200">{user.email}</p>
              </div>
            </div>
            <Separator className="dark:bg-gray-700" />
            
            <div className="p-2">
              <div className="grid gap-1">
                <Button
                  variant="ghost"
                  className="justify-start py-1.5 px-2 w-full dark:hover:bg-gray-700 
                  dark:hover:shadow-[0_0_10px_2px_rgba(74,222,128,0.3)]"
                  asChild
                >
                  <Link to="/app/home">
                    <Home className="mr-2 h-4 w-4" />
                    <span>Home</span>
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start py-1.5 px-2 w-full dark:hover:bg-gray-700
                  dark:hover:shadow-[0_0_10px_2px_rgba(74,222,128,0.3)]"
                  asChild
                >
                  <Link to="/app/profile">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </Button>
              </div>
            </div>
            <Separator className="dark:bg-gray-700" />
            
            {/* Theme Selector Group */}
            <div className="p-2">
              <div className="grid gap-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="justify-between py-1.5 px-2 w-full dark:hover:bg-gray-700
                      dark:hover:shadow-[0_0_10px_2px_rgba(74,222,128,0.3)]"
                    >
                      <div className="flex items-center">
                        {theme === 'light' ? (
                          <Sun className="mr-2 h-4 w-4" />
                        ) : theme === 'dark' ? (
                          <Moon className="mr-2 h-4 w-4" />
                        ) : (
                          <MonitorSmartphone className="mr-2 h-4 w-4" />
                        )}
                        <span>Theme</span>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent side="right" className="w-48 p-0 dark:bg-gray-800 dark:border-gray-700">
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
            </div>
            <Separator className="dark:bg-gray-700" />
            
            {/* Sign Out Button */}
            <div className="p-2">
              <Button
                variant="ghost"
                className="justify-start py-1.5 px-2 w-full text-red-500 dark:text-red-400
                hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={() => console.log('Sign out')} // To be implemented with actual sign out logic
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

export default Sidebar