interface ReasonChipsProps {
  reasons: string[]
}

export function ReasonChips({ reasons }: ReasonChipsProps) {
  if (reasons.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {reasons.map((reason, index) => (
        <span
          key={index}
          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
        >
          {reason}
        </span>
      ))}
    </div>
  )
}
