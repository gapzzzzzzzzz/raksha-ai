import { ReactNode, ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/src/lib/utils'

interface RKButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  asChild?: boolean
}

export const RKButton = forwardRef<HTMLButtonElement, RKButtonProps>(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className,
  asChild = false,
  ...props 
}, ref) => {
  const buttonClasses = cn(
    'rk-button',
    `rk-button-${variant}`,
    size !== 'md' && `rk-button-${size}`,
    className
  )

  if (asChild && typeof children === 'object' && children !== null && 'type' in children) {
    // Clone the child element and add our classes
    return (
      <div className={buttonClasses}>
        {children}
      </div>
    )
  }

  return (
    <button
      ref={ref}
      className={buttonClasses}
      {...props}
    >
      {children}
    </button>
  )
})

RKButton.displayName = 'RKButton'
