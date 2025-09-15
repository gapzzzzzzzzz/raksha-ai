import React from 'react'
import { cn } from '@/src/lib/utils'

interface SectionHeadingProps {
  title?: string
  subtitle?: string
  className?: string
  align?: 'left' | 'center' | 'right'
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  children?: React.ReactNode
}

interface SectionSubheadingProps {
  className?: string
  children: React.ReactNode
}

export function SectionHeading({ 
  title, 
  subtitle, 
  className, 
  align = 'center', 
  as: Component = 'h2',
  children 
}: SectionHeadingProps) {
  if (children) {
    return (
      <div className={cn(
        'space-y-4',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className
      )}>
        <Component className="text-3xl md:text-4xl font-display font-bold text-rk-text">
          {children}
        </Component>
        {subtitle && (
          <p className="text-xl text-rk-subtle max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className={cn(
      'space-y-4',
      align === 'center' && 'text-center',
      align === 'right' && 'text-right',
      className
    )}>
      <Component className="text-3xl md:text-4xl font-display font-bold text-rk-text">
        {title}
      </Component>
      {subtitle && (
        <p className="text-xl text-rk-subtle max-w-3xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}

export function SectionSubheading({ className, children }: SectionSubheadingProps) {
  return (
    <p className={cn(
      'text-xl text-rk-subtle max-w-3xl mx-auto leading-relaxed',
      className
    )}>
      {children}
    </p>
  )
}