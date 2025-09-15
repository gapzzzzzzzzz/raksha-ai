import React from 'react'
import { cn } from '@/src/lib/utils'

interface SectionHeadingProps {
  title: string
  subtitle?: string
  className?: string
  align?: 'left' | 'center' | 'right'
}

export function SectionHeading({ title, subtitle, className, align = 'center' }: SectionHeadingProps) {
  return (
    <div className={cn(
      'space-y-4',
      align === 'center' && 'text-center',
      align === 'right' && 'text-right',
      className
    )}>
      <h2 className="text-3xl md:text-4xl font-display font-bold text-rk-text">
        {title}
      </h2>
      {subtitle && (
        <p className="text-xl text-rk-subtle max-w-3xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}