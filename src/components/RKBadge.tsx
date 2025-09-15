import { ReactNode } from 'react'
import { cn } from '@/src/lib/utils'

interface RKBadgeProps {
  children: ReactNode
  variant?: 'primary' | 'success' | 'warning' | 'danger'
  className?: string
}

export function RKBadge({ children, variant = 'primary', className }: RKBadgeProps) {
  return (
    <span className={cn(
      'rk-chip',
      `rk-chip-${variant}`,
      className
    )}>
      {children}
    </span>
  )
}
