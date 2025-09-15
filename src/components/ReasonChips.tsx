import { cn } from '@/src/lib/utils'

interface ReasonChipsProps {
  reasons: string[]
  className?: string
}

export function ReasonChips({ reasons, className }: ReasonChipsProps) {
  if (reasons.length === 0) return null

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {reasons.map((reason, index) => (
        <span
          key={index}
          className="rk-chip bg-rk-primary/10 text-rk-primary border border-rk-primary/20"
        >
          {reason}
        </span>
      ))}
    </div>
  )
}