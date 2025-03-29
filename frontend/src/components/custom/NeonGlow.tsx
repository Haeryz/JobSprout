import { cn } from '@/lib/utils'
import React from 'react'

interface NeonGlowProps {
  children: React.ReactNode
  className?: string
  color?: 'green' | 'blue' | 'purple' | 'pink'
  size?: 'sm' | 'md' | 'lg'
  active?: boolean
  onlyOnDark?: boolean
}

/**
 * NeonGlow component for creating a glowing effect in dark mode
 * @param children Content to display with the glow effect
 * @param className Additional classes to apply to the container
 * @param color Glow color (green, blue, purple, pink)
 * @param size Size of the glow effect (sm, md, lg)
 * @param active Whether the glow is always active or only on hover
 * @param onlyOnDark Only show the glow effect in dark mode
 */
const NeonGlow = ({
  children,
  className,
  color = 'green',
  size = 'md',
  active = false,
  onlyOnDark = true,
}: NeonGlowProps) => {
  // Define color values
  const colorMap = {
    green: 'rgba(74,222,128,var(--opacity))',
    blue: 'rgba(59,130,246,var(--opacity))',
    purple: 'rgba(139,92,246,var(--opacity))',
    pink: 'rgba(236,72,153,var(--opacity))'
  }

  // Define size values
  const sizeMap = {
    sm: {
      base: '[--opacity:0.2] shadow-[0_0_5px_1px_var(--shadow-color)]',
      hover: '[--opacity:0.3] shadow-[0_0_10px_2px_var(--shadow-color)]'
    },
    md: {
      base: '[--opacity:0.2] shadow-[0_0_8px_2px_var(--shadow-color)]',
      hover: '[--opacity:0.4] shadow-[0_0_15px_3px_var(--shadow-color)]'
    },
    lg: {
      base: '[--opacity:0.25] shadow-[0_0_10px_3px_var(--shadow-color)]',
      hover: '[--opacity:0.5] shadow-[0_0_20px_5px_var(--shadow-color)]'
    }
  }

  // Set shadow color CSS variable
  const shadowColor = colorMap[color]
  const baseSize = sizeMap[size].base
  const hoverSize = sizeMap[size].hover

  // Build class names based on props
  const glowClasses = cn(
    // Common styles
    'transition-all duration-300 [--shadow-color:var(--glow-color)]',
    // Conditionally show only in dark mode
    onlyOnDark ? 'dark:[--glow-color:var(--color-value)] [--glow-color:transparent]' : '[--glow-color:var(--color-value)]',
    // Apply base glow if active, otherwise only on hover
    active 
      ? cn(hoverSize, 'hover:brightness-125') 
      : cn('hover:' + hoverSize, baseSize),
    // Additional custom classes
    className
  )

  return (
    <div 
      className={glowClasses} 
      style={{ '--color-value': shadowColor } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

export default NeonGlow