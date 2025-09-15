import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface RKCardProps {
  children: ReactNode
  className?: string
  elevated?: boolean
}

export function RKCard({ children, className, elevated = false }: RKCardProps) {
  return (
    <div className={cn(
      'rk-card',
      elevated && 'rk-card-elevated',
      className
    )}>
      {children}
    </div>
  )
}
