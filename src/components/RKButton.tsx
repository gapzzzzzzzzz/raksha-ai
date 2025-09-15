import { ReactNode, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface RKButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function RKButton({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className,
  ...props 
}: RKButtonProps) {
  return (
    <button
      className={cn(
        'rk-button',
        `rk-button-${variant}`,
        size !== 'md' && `rk-button-${size}`,
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
