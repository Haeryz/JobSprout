import React, { useState, useEffect } from 'react'
import { ThemeContext, Theme } from './theme-context'

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('light')

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null
    
    if (savedTheme) {
      setTheme(savedTheme)
      applyTheme(savedTheme)
    } else {
      // Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark')
        applyTheme('dark')
      }
    }

    // Listen for system theme changes if using system theme
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }

  const applyTheme = (selectedTheme: Theme) => {
    const root = document.documentElement
    const isDark = 
      selectedTheme === 'dark' || 
      (selectedTheme === 'system' && 
       window.matchMedia && 
       window.matchMedia('(prefers-color-scheme: dark)').matches)

    if (isDark) {
      root.classList.add('dark')
      // Using a softer dark background for better neon effect visibility
      document.body.style.backgroundColor = '#111827' // dark blue-gray instead of pure black
      document.body.style.color = '#f3f4f6'
    } else {
      root.classList.remove('dark')
      document.body.style.backgroundColor = '#ffffff'
      document.body.style.color = '#111827'
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleThemeChange }}>
      {children}
    </ThemeContext.Provider>
  )
}