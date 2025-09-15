import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  children: ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export function SectionHeading({ 
  children, 
  className, 
  as: Component = 'h2' 
}: SectionHeadingProps) {
  return (
    <Component className={cn('rk-section-heading', className)}>
      {children}
    </Component>
  )
}

interface SectionSubheadingProps {
  children: ReactNode
  className?: string
}

export function SectionSubheading({ children, className }: SectionSubheadingProps) {
  return (
    <p className={cn('rk-section-subheading', className)}>
      {children}
    </p>
  )
}
