import { TriageResult } from '@/lib/triage/engine'
import { AlertTriangle, HeartPulse, Activity } from 'lucide-react'

interface RiskCardProps {
  result: TriageResult
}

export function RiskCard({ result }: RiskCardProps) {
  const getRiskConfig = (level: string) => {
    switch (level) {
      case 'EMERGENCY':
        return {
          color: 'bg-red-500',
          textColor: 'text-red-500',
          borderColor: 'border-red-500',
          icon: AlertTriangle,
          label: 'DARURAT',
          bgColor: 'bg-red-50 dark:bg-red-950'
        }
      case 'CONSULT':
        return {
          color: 'bg-amber-500',
          textColor: 'text-amber-500',
          borderColor: 'border-amber-500',
          icon: HeartPulse,
          label: 'KONSULTASI',
          bgColor: 'bg-amber-50 dark:bg-amber-950'
        }
      case 'SELF_CARE':
        return {
          color: 'bg-green-500',
          textColor: 'text-green-500',
          borderColor: 'border-green-500',
          icon: Activity,
          label: 'PERAWATAN DIRI',
          bgColor: 'bg-green-50 dark:bg-green-950'
        }
      default:
        return {
          color: 'bg-gray-500',
          textColor: 'text-gray-500',
          borderColor: 'border-gray-500',
          icon: Activity,
          label: 'TIDAK DIKETAHUI',
          bgColor: 'bg-gray-50 dark:bg-gray-950'
        }
    }
  }

  const config = getRiskConfig(result.level)
  const Icon = config.icon

  return (
    <div className={`rounded-2xl border-2 ${config.borderColor} ${config.bgColor} p-6 shadow-md`}>
      <div className="flex items-center gap-4 mb-4">
        <div className={`p-3 rounded-full ${config.color} text-white`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className={`text-xl font-bold ${config.textColor}`}>
            {config.label}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Skor Risiko: {result.score}/100
          </p>
        </div>
      </div>

      {result.reasons.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Alasan Penilaian:
          </h4>
          <ul className="space-y-1">
            {result.reasons.map((reason, index) => (
              <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
                • {reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.seasonalContext && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            🌧️ {result.seasonalContext}
          </p>
        </div>
      )}

      <div className="mb-4">
        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Panduan Perawatan:
        </h4>
        <ul className="space-y-1">
          {result.microEducation.map((education, index) => (
            <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
              • {education}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
        <p className="text-xs text-yellow-800 dark:text-yellow-200">
          ⚠️ <strong>PENTING:</strong> Ini bukan diagnosis medis. Konsultasikan dengan dokter untuk penanganan yang tepat.
        </p>
      </div>
    </div>
  )
}
