import { createContext } from 'react'

export type Theme = 'light' | 'dark' | 'system'

export interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

// Create the context with a default value
export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
})