import { Github, Mail, Twitter } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const Footer = () => {
  const footerLinks = [
    {
      title: 'JobSprout',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Blog', href: '/blog' },
        { label: 'Press', href: '/press' }
      ]
    },
    {
      title: 'Features',
      links: [
        { label: 'Job Tracking', href: '/features/job-tracking' },
        { label: 'Resume Builder', href: '/features/resume-builder' },
        { label: 'Cover Letters', href: '/features/cover-letters' },
        { label: 'Analytics', href: '/features/analytics' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Help Center', href: '/help' },
        { label: 'Documentation', href: '/docs' },
        { label: 'API', href: '/api' },
        { label: 'Community', href: '/community' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Security', href: '/security' },
        { label: 'Accessibility', href: '/accessibility' }
      ]
    }
  ]

  return (
    <footer className="w-full border-t bg-background py-16 flex justify-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Main footer content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-12">
          {footerLinks.map((group, i) => (
            <div key={i} className="flex flex-col">
              <h3 className="font-medium text-base mb-4">{group.title}</h3>
              <ul className="space-y-3">
                {group.links.map((link, j) => (
                  <li key={j}>
                    <Link 
                      to={link.href}
                      className="text-muted-foreground text-sm hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <Separator className="my-12" />
        
        {/* Bottom footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center">
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-b from-[#4ADE80] to-[#22C55E]">
              JobSprout
            </span>
            <span className="text-sm text-muted-foreground ml-3">© {new Date().getFullYear()} All rights reserved.</span>
          </div>
          
          <div className="flex space-x-4">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
              <Mail className="h-4 w-4" />
              <span className="sr-only">Email</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Twitter</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer