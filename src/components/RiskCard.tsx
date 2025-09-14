import { AlertTriangle, Clock, HeartPulse, MapPin, ExternalLink, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getAriaLabel, generateId } from '@/lib/accessibility'

export interface RiskCardProps {
  level: 'EMERGENCY' | 'CONSULT' | 'SELF_CARE'
  score: number
  reasons: string[]
  microEducation: string[]
  seasonalContext?: string
  region?: string
}

const riskConfig = {
  EMERGENCY: {
    color: 'text-rk-danger',
    bgColor: 'bg-rk-danger/10',
    borderColor: 'border-rk-danger/50',
    icon: AlertTriangle,
    label: 'DARURAT',
    description: 'Segera ke IGD',
    action: 'Hubungi 118/119 atau ke IGD terdekat'
  },
  CONSULT: {
    color: 'text-rk-warn',
    bgColor: 'bg-rk-warn/10',
    borderColor: 'border-rk-warn/50',
    icon: Clock,
    label: 'KONSULTASI',
    description: 'Konsultasi dalam 24 jam',
    action: 'Kunjungi Puskesmas atau dokter'
  },
  SELF_CARE: {
    color: 'text-rk-accent',
    bgColor: 'bg-rk-accent/10',
    borderColor: 'border-rk-accent/50',
    icon: HeartPulse,
    label: 'PERAWATAN DIRI',
    description: 'Perawatan di rumah',
    action: 'Ikuti panduan perawatan di bawah'
  }
}

export function RiskCard({ 
  level, 
  score, 
  reasons, 
  microEducation, 
  seasonalContext,
  region 
}: RiskCardProps) {
  const config = riskConfig[level]
  const Icon = config.icon
  const cardId = generateId('risk-card')
  const scoreId = generateId('risk-score')
  const reasonsId = generateId('risk-reasons')
  const educationId = generateId('risk-education')

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-rk-danger'
    if (score >= 60) return 'text-rk-warn'
    return 'text-rk-accent'
  }

  const getMapsUrl = (region?: string) => {
    if (!region) return 'https://maps.google.com/maps?q=rumah+sakit+terdekat'
    return `https://maps.google.com/maps?q=rumah+sakit+terdekat+${encodeURIComponent(region)}`
  }

  return (
    <div 
      id={cardId}
      className={cn(
        "rk-card p-6 space-y-6",
        config.borderColor
      )}
      role="region"
      aria-labelledby={`${cardId}-title`}
      aria-describedby={`${scoreId} ${reasonsId} ${educationId}`}
    >
      {/* Header */}
      <div className="text-center">
        <div className={cn(
          "w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center",
          config.bgColor
        )}>
          <Icon className={cn("w-10 h-10", config.color)} />
        </div>
        <h3 
          id={`${cardId}-title`}
          className={cn("text-2xl font-display font-bold mb-2", config.color)}
        >
          {config.label}
        </h3>
        <p className="text-rk-subtle mb-4">{config.description}</p>
        
        {/* Score */}
        <div 
          id={scoreId}
          className="flex items-center justify-center gap-2"
          aria-label={getAriaLabel(level, score)}
        >
          <span className="text-sm text-rk-subtle">Skor:</span>
          <span 
            className={cn("text-3xl font-bold", getScoreColor(score))}
            aria-label={`Skor ${score} dari 100`}
          >
            {score}
          </span>
          <span className="text-sm text-rk-subtle">/100</span>
        </div>
      </div>

      {/* Seasonal Context */}
      {seasonalContext && (
        <div className="bg-rk-primary/10 border border-rk-primary/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-rk-primary mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-rk-primary text-sm mb-1">
                Konteks Musiman
              </h4>
              <p className="text-rk-text text-sm">{seasonalContext}</p>
            </div>
          </div>
        </div>
      )}

      {/* Reasons */}
      <div id={reasonsId}>
        <h4 className="font-semibold text-rk-text mb-3 flex items-center gap-2">
          <span>Mengapa level ini?</span>
        </h4>
        <ul className="space-y-2" role="list">
          {reasons.map((reason, index) => (
            <li key={index} className="flex items-start gap-2">
              <div 
                className="w-1.5 h-1.5 bg-rk-primary rounded-full mt-2 flex-shrink-0" 
                aria-hidden="true"
              />
              <span className="text-rk-subtle text-sm">{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Micro Education */}
      <div id={educationId}>
        <h4 className="font-semibold text-rk-text mb-3">
          Langkah Aman Saat Ini
        </h4>
        <ul className="space-y-2" role="list">
          {microEducation.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <div 
                className="w-1.5 h-1.5 bg-rk-accent rounded-full mt-2 flex-shrink-0" 
                aria-hidden="true"
              />
              <span className="text-rk-subtle text-sm">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Button */}
      <div className="pt-4 border-t border-rk-border">
        <a
          href={getMapsUrl(region)}
          target="_blank"
          rel="noopener noreferrer"
          className="rk-button-primary w-full flex items-center justify-center gap-2"
          aria-label={`Buka Google Maps untuk mencari fasilitas kesehatan terdekat${region ? ` di ${region}` : ''}`}
        >
          <MapPin className="w-4 h-4" aria-hidden="true" />
          Buka Maps Fasilitas Terdekat
          <ExternalLink className="w-4 h-4" aria-hidden="true" />
        </a>
      </div>

      {/* Disclaimer */}
      <div className="text-xs text-rk-subtle text-center pt-2 border-t border-rk-border">
        <p>
          Raksha bukan alat diagnosis. Jika ragu atau kondisi memburuk, segera ke IGD.
        </p>
      </div>
    </div>
  )
}