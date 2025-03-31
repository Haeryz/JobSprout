import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  Home, 
  Briefcase, 
  User, 
  LogOut, 
  Sun, 
  Moon, 
  MonitorSmartphone,
  Check,
  Bell,
  TestTube,
  Palette,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  MoreVertical
} from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { useAuthStore } from '@/store/useAuthStore'
import { cn } from '@/lib/utils'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar"

// Navigation items
const navigationItems = [
  {
    title: "Home",
    icon: Home,
    url: "/app/home",
  },
  {
    title: "Jobs",
    icon: Briefcase,
    url: "/app/jobs",
  },
  {
    title: "Profile",
    icon: User,
    url: "/app/profile",
  },
  {
    title: "Subscription",
    icon: CreditCard,
    url: "/app/subscription",
  }
]

const AppSidebar = () => {
  const { theme, setTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const { state, toggleSidebar } = useSidebar()
  
  // Get user data from auth store
  const { user, logout } = useAuthStore()
  
  const handleLogout = async () => {
    // Call the logout function from auth store
    await logout()
    navigate('/')
  }

  return (
    <Sidebar 
      className="border-r border-sidebar-border relative"
      collapsible="icon"
    >
      {/* Toggle sidebar button - positioned at the right edge of sidebar */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleSidebar}
        className={cn(
          "h-9 w-9 rounded-full hover:dark:shadow-[0_0_10px_2px_rgba(74,222,128,0.3)] transition-all duration-300 flex-shrink-0 absolute top-1/2 -right-4 z-50 bg-background border border-sidebar-border",
        )}
        title={state === "expanded" ? "Collapse sidebar" : "Expand sidebar"}
      >
        {state === "expanded" ? (
          <ChevronLeft className="h-5 w-5" />
        ) : (
          <ChevronRight className="h-5 w-5" />
        )}
      </Button>

      <SidebarHeader className="flex justify-between items-center p-3">
        <Link to="/app/home" className="flex items-center gap-2">
          {state === "collapsed" ? (
            <img src="/vite.svg" alt="JobSprout Logo" className="w-6 h-6" />
          ) : (
            <div className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-b from-[#4ADE80] to-[#22C55E]">
              JobSprout
            </div>
          )}
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Notifications</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  tooltip="Updates"
                >
                  <Link to="#">
                    <Bell className="h-4 w-4" />
                    <span>Updates</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="User Profile"
            >
              <Popover>
                <PopoverTrigger asChild>
                  <div className={cn(
                    "flex w-full items-center gap-2 cursor-pointer rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
                    state === "collapsed" ? "justify-center" : "justify-start"
                  )}>
                    {state === "expanded" && (
                      <div className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-sidebar-accent/80 mr-1">
                        <MoreVertical className="w-4 h-4" />
                      </div>
                    )}
                    <Avatar>
                      <AvatarImage src={user?.avatarUrl} />
                      <AvatarFallback>{user?.name?.charAt(0) || 'U'}{user?.name?.split(' ')[1]?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {state === "expanded" && (
                      <div className="text-sm">
                        <p className="font-medium">{user?.name || 'User'}</p>
                        <p className="text-muted-foreground text-xs">{user?.email || 'user@example.com'}</p>
                      </div>
                    )}
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0 dark:bg-gray-800 dark:border-gray-700">
                  <div className="p-3">
                    <p className="text-xs font-semibold text-muted-foreground">SIGNED IN AS</p>
                    <p className="font-medium">{user?.email || 'user@example.com'}</p>
                  </div>
                  
                  <Separator />
                  
                  <div className="p-2">
                    <Button
                      variant="ghost"
                      className="justify-start py-1.5 px-2 w-full dark:hover:bg-gray-700"
                      onClick={() => {}}
                    >
                      <TestTube className="mr-2 h-4 w-4" />
                      <span>Test Menu 1</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start py-1.5 px-2 w-full dark:hover:bg-gray-700"
                      onClick={() => {}}
                    >
                      <TestTube className="mr-2 h-4 w-4" />
                      <span>Test Menu 2</span>
                    </Button>
                  </div>
                  

                  <Separator />
                  

                  <div className="p-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          className="justify-start py-1.5 px-2 w-full dark:hover:bg-gray-700"
                        >
                          <Palette className="mr-2 h-4 w-4" />
                          <span>Theme</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 p-2 dark:bg-gray-800 dark:border-gray-700">
                        <Button
                          variant="ghost"
                          className="justify-start py-1.5 px-2 w-full dark:hover:bg-gray-700"
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
                          className="justify-start py-1.5 px-2 w-full dark:hover:bg-gray-700"
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
                          className="justify-start py-1.5 px-2 w-full dark:hover:bg-gray-700"
                          onClick={() => setTheme('system')}
                        >
                          <div className="flex items-center">
                            {theme === 'system' && <Check className="mr-2 h-4 w-4" />}
                            <MonitorSmartphone className={cn("mr-2 h-4 w-4", theme !== "system" && "ml-6")} />
                            <span>System</span>
                          </div>
                        </Button>
                      </PopoverContent>
                    </Popover>
                  </div>
                  

                  <Separator />
                  

                  <div className="p-2">
                    <Button
                      variant="ghost"
                      className="justify-start py-1.5 px-2 w-full text-red-500 dark:hover:bg-gray-700"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar