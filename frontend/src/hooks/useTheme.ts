import { useContext } from 'react'
import { ThemeContext } from '@/contexts/theme-context'

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext)