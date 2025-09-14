import { HeartPulse, Activity, AlertTriangle } from 'lucide-react'

interface MicroEducationProps {
  level: 'EMERGENCY' | 'CONSULT' | 'SELF_CARE'
  education: string[]
}

export function MicroEducation({ level, education }: MicroEducationProps) {
  const getConfig = (level: string) => {
    switch (level) {
      case 'EMERGENCY':
        return {
          icon: AlertTriangle,
          color: 'text-red-500',
          bgColor: 'bg-red-50 dark:bg-red-950',
          borderColor: 'border-red-200 dark:border-red-800'
        }
      case 'CONSULT':
        return {
          icon: HeartPulse,
          color: 'text-amber-500',
          bgColor: 'bg-amber-50 dark:bg-amber-950',
          borderColor: 'border-amber-200 dark:border-amber-800'
        }
      case 'SELF_CARE':
        return {
          icon: Activity,
          color: 'text-green-500',
          bgColor: 'bg-green-50 dark:bg-green-950',
          borderColor: 'border-green-200 dark:border-green-800'
        }
      default:
        return {
          icon: Activity,
          color: 'text-gray-500',
          bgColor: 'bg-gray-50 dark:bg-gray-950',
          borderColor: 'border-gray-200 dark:border-gray-800'
        }
    }
  }

  const config = getConfig(level)
  const Icon = config.icon

  return (
    <div className={`rounded-lg border ${config.borderColor} ${config.bgColor} p-4`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-5 h-5 ${config.color}`} />
        <h3 className={`font-semibold ${config.color}`}>
          Panduan Perawatan
        </h3>
      </div>
      
      <ul className="space-y-2">
        {education.map((item, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <span className="text-gray-500 mt-1">•</span>
            <span className="text-gray-700 dark:text-gray-300">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
