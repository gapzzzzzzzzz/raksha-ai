'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TriageResult, TriageInput, ApiResponse } from '../../lib/triage/schema'
import { 
  Activity, 
  Thermometer, 
  Calendar, 
  MapPin, 
  AlertTriangle,
  HeartPulse,
  Clock,
  CheckCircle,
  Info,
  ArrowRight,
  ExternalLink
} from 'lucide-react'
import { RKCard } from '@/src/components/RKCard'
import { RKButton } from '@/src/components/RKButton'
import { RKBadge } from '@/src/components/RKBadge'
import { SectionHeading } from '@/src/components/SectionHeading'

const triageSchema = z.object({
  symptomsText: z.string().min(1, 'Gejala harus diisi'),
  age: z.number().min(0).max(120).optional(),
  tempC: z.number().min(30).max(45).optional(),
  daysFever: z.number().min(0).max(30).optional(),
  region: z.string().optional(),
  diarrheaFreq: z.number().min(0).max(50).optional(),
  vomitFreq: z.number().min(0).max(50).optional(),
  redFlags: z.object({
    chestPain: z.boolean().optional(),
    bleeding: z.boolean().optional(),
    sob: z.boolean().optional(),
    neuro: z.boolean().optional()
  }).optional()
})

type TriageForm = z.infer<typeof triageSchema>

const INDONESIAN_PROVINCES = [
  'DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Banten', 'Bali',
  'Nusa Tenggara Barat', 'Nusa Tenggara Timur', 'Kalimantan Barat', 
  'Kalimantan Tengah', 'Kalimantan Selatan', 'Kalimantan Timur', 'Kalimantan Utara',
  'Sulawesi Utara', 'Sulawesi Tengah', 'Sulawesi Selatan', 'Sulawesi Tenggara',
  'Gorontalo', 'Sulawesi Barat', 'Maluku', 'Maluku Utara', 'Papua Barat', 'Papua'
]

const symptomSuggestions = [
  'demam', 'batuk', 'pilek', 'mual', 'muntah', 'diare', 'pusing', 'lemas', 
  'ruam', 'sesak napas', 'nyeri dada', 'sakit kepala', 'nyeri perut'
]

export default function TriagePage() {
  const [result, setResult] = useState<TriageResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<TriageForm>({
    resolver: zodResolver(triageSchema)
  })

  const symptomsText = watch('symptomsText')
  const currentMonth = new Date().getMonth() + 1

  const onSubmit = async (data: TriageForm) => {
    setLoading(true)
    setError(null)
    setResult(null)
    
    try {
      const response = await fetch('/api/triage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          month: currentMonth,
          consent
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Gagal melakukan triage')
      }

      const responseData = await response.json()
      
      // Validate response structure
      if (!responseData.ok || !responseData.result) {
        throw new Error('Format respons tidak valid')
      }

      setResult(responseData.result)
    } catch (err) {
      console.error('Triage error:', err)
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const addSymptomSuggestion = (symptom: string) => {
    const current = symptomsText || ''
    const newText = current ? `${current}, ${symptom}` : symptom
    setValue('symptomsText', newText)
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'EMERGENCY': return 'border-rk-danger bg-rk-danger-50 text-rk-danger'
      case 'CONSULT': return 'border-rk-warning bg-rk-warning-50 text-rk-warning'
      case 'SELF_CARE': return 'border-rk-success bg-rk-success-50 text-rk-success'
      default: return 'border-rk-primary bg-rk-primary-50 text-rk-primary'
    }
  }

  const getRiskLabel = (level: string) => {
    switch (level) {
      case 'EMERGENCY': return 'Emergency'
      case 'CONSULT': return 'Consult'
      case 'SELF_CARE': return 'Self Care'
      default: return 'Unknown'
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'EMERGENCY': return <AlertTriangle className="w-6 h-6" />
      case 'CONSULT': return <Clock className="w-6 h-6" />
      case 'SELF_CARE': return <HeartPulse className="w-6 h-6" />
      default: return <Info className="w-6 h-6" />
    }
  }

  // Show error state if there's an error and not loading
  if (error && !loading) {
    return (
      <div className="min-h-screen bg-rk-bg flex items-center justify-center">
        <RKCard elevated className="max-w-md text-center">
          <AlertTriangle className="w-16 h-16 text-rk-danger mx-auto mb-4" />
          <h2 className="text-xl font-bold text-rk-text mb-2">Terjadi Kesalahan</h2>
          <p className="text-rk-subtle mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null)
              setResult(null)
            }}
            className="rk-button rk-button-primary"
          >
            Coba Lagi
          </button>
        </RKCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-rk-bg">
      <div className="container mx-auto px-6 md:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-rk-primary-50 text-rk-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <HeartPulse className="w-4 h-4" />
              AI Health Triage
            </div>
            <SectionHeading 
              title="Triage Kesehatan"
              subtitle="Jelaskan gejala Anda untuk mendapatkan panduan triage yang akurat dan kontekstual untuk Indonesia"
              className="text-4xl md:text-5xl"
            />
          </div>

          {/* 12-Column Grid Layout */}
          <div className="grid grid-cols-12 gap-8">
            {/* Form Panel - 7 columns */}
            <div className="col-span-12 lg:col-span-7">
              <RKCard elevated>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  {/* Symptoms */}
                  <div>
                    <label className="block text-lg font-semibold text-rk-text mb-3">
                      <Activity className="w-5 h-5 inline mr-2" />
                      Gejala yang Dialami *
                    </label>
                    <textarea
                      {...register('symptomsText')}
                      className="w-full p-4 border border-rk-border rounded-xl text-rk-text placeholder-rk-subtle focus:outline-none focus:ring-2 focus:ring-rk-primary focus:border-transparent resize-none bg-rk-card"
                      placeholder="Contoh: demam tinggi 39°C selama 2 hari, mual, ruam merah, lemas"
                      rows={4}
                    />
                    {errors.symptomsText && (
                      <p className="text-rk-danger text-sm mt-2">{errors.symptomsText.message}</p>
                    )}
                    <p className="text-rk-subtle text-sm mt-2">
                      Jelaskan gejala secara detail termasuk durasi dan tingkat keparahan
                    </p>
                  </div>

                  {/* Symptom Suggestions */}
                  <div>
                    <label className="block text-sm font-medium text-rk-text mb-3">
                      Klik untuk menambah gejala umum:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {symptomSuggestions.map((symptom) => (
                        <button
                          key={symptom}
                          type="button"
                          onClick={() => addSymptomSuggestion(symptom)}
                          className="rk-chip rk-chip-primary cursor-pointer hover:bg-rk-primary hover:text-white transition-colors"
                        >
                          {symptom}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Age and Temperature */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-rk-text mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Usia (tahun)
                      </label>
                      <input
                        type="number"
                        {...register('age', { valueAsNumber: true })}
                        className="w-full p-3 border border-rk-border rounded-lg text-rk-text placeholder-rk-subtle focus:outline-none focus:ring-2 focus:ring-rk-primary focus:border-transparent bg-rk-card"
                        placeholder="25"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-rk-text mb-2">
                        <Thermometer className="w-4 h-4 inline mr-2" />
                        Suhu (°C)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        {...register('tempC', { valueAsNumber: true })}
                        className="w-full p-3 border border-rk-border rounded-lg text-rk-text placeholder-rk-subtle focus:outline-none focus:ring-2 focus:ring-rk-primary focus:border-transparent bg-rk-card"
                        placeholder="38.5"
                      />
                    </div>
                  </div>

                  {/* Days of Fever */}
                  <div>
                    <label className="block text-sm font-medium text-rk-text mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Durasi Demam (hari)
                    </label>
                    <input
                      type="number"
                      {...register('daysFever', { valueAsNumber: true })}
                      className="w-full p-3 border border-rk-border rounded-lg text-rk-text placeholder-rk-subtle focus:outline-none focus:ring-2 focus:ring-rk-primary focus:border-transparent bg-rk-card"
                      placeholder="2"
                    />
                  </div>

                  {/* Region */}
                  <div>
                    <label className="block text-sm font-medium text-rk-text mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Provinsi
                    </label>
                    <select
                      {...register('region')}
                      className="w-full p-3 border border-rk-border rounded-lg text-rk-text focus:outline-none focus:ring-2 focus:ring-rk-primary focus:border-transparent bg-rk-card"
                    >
                      <option value="">Pilih provinsi</option>
                      {INDONESIAN_PROVINCES.map((province) => (
                        <option key={province} value={province}>
                          {province}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Red Flags */}
                  <div>
                    <label className="block text-sm font-medium text-rk-text mb-3">
                      <AlertTriangle className="w-4 h-4 inline mr-2" />
                      Gejala Darurat (centang jika ada)
                    </label>
                    <div className="grid md:grid-cols-2 gap-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('redFlags.chestPain')}
                          className="w-4 h-4 text-rk-primary bg-rk-card border-rk-border rounded focus:ring-rk-primary"
                        />
                        <span className="text-rk-text">Nyeri dada</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('redFlags.bleeding')}
                          className="w-4 h-4 text-rk-primary bg-rk-card border-rk-border rounded focus:ring-rk-primary"
                        />
                        <span className="text-rk-text">Pendarahan</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('redFlags.sob')}
                          className="w-4 h-4 text-rk-primary bg-rk-card border-rk-border rounded focus:ring-rk-primary"
                        />
                        <span className="text-rk-text">Sesak napas</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('redFlags.neuro')}
                          className="w-4 h-4 text-rk-primary bg-rk-card border-rk-border rounded focus:ring-rk-primary"
                        />
                        <span className="text-rk-text">Gangguan neurologis</span>
                      </label>
                    </div>
                  </div>

                  {/* Consent */}
                  <div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="w-4 h-4 text-rk-primary bg-rk-card border-rk-border rounded focus:ring-rk-primary mt-1"
                      />
                      <span className="text-rk-text text-sm">
                        Saya setuju untuk menggunakan layanan triage AI ini dan memahami bahwa ini bukan pengganti konsultasi medis profesional.
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <RKButton
                    type="submit"
                    size="lg"
                    disabled={loading || !consent}
                    className="w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Memproses Triage...
                      </>
                    ) : (
                      <>
                        Mulai Triage
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </RKButton>

                  {error && (
                    <div className="p-4 bg-rk-danger-50 border border-rk-danger rounded-lg">
                      <div className="flex items-center gap-2 text-rk-danger">
                        <AlertTriangle className="w-5 h-5" />
                        <span className="font-medium">Error</span>
                      </div>
                      <p className="text-rk-danger text-sm mt-1">{error}</p>
                    </div>
                  )}
                </form>
              </RKCard>
            </div>

            {/* Results Panel - 5 columns, sticky */}
            <div className="col-span-12 lg:col-span-5">
              <div className="lg:sticky lg:top-8">
                {result ? (
                  <RKCard elevated>
                    <div className="text-center mb-8">
                      <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl border-2 ${getRiskColor(result.level)} mb-4`}>
                        {getRiskIcon(result.level)}
                        <span className="text-lg font-bold">{getRiskLabel(result.level)}</span>
                      </div>
                      <div className="text-3xl font-bold text-rk-text mb-2">
                        Skor: {result.score}/100
                      </div>
                      <p className="text-rk-subtle">
                        Berdasarkan analisis gejala dan konteks regional
                      </p>
                    </div>

                    {/* Seasonal Context */}
                    {result.seasonalContext && (
                      <div className="mb-6 p-4 bg-rk-primary-50 border border-rk-primary rounded-lg">
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-rk-primary mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-rk-primary mb-1">Konteks Musiman</h4>
                            <p className="text-rk-primary text-sm">{result.seasonalContext}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Reasons */}
                    {result.reasons && result.reasons.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-rk-text mb-3">Alasan Penilaian</h4>
                        <ul className="space-y-2">
                          {result.reasons.map((reason: string, index: number) => (
                            <li key={index} className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-rk-success mt-0.5 flex-shrink-0" />
                              <span className="text-rk-text">{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Micro Education */}
                    {result.microEducation && result.microEducation.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-rk-text mb-3">Panduan Perawatan</h4>
                        <ul className="space-y-2">
                          {result.microEducation.map((education: string, index: number) => (
                            <li key={index} className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-rk-primary rounded-full mt-2 flex-shrink-0" />
                              <span className="text-rk-text">{education}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Top Conditions */}
                    {result.topConditions && result.topConditions.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-rk-text mb-3">Kondisi Terdeteksi</h4>
                        <div className="space-y-2">
                          {result.topConditions.map((condition: {condition: string, likelihood: number, why: string}, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-rk-surface rounded-lg">
                              <div>
                                <span className="font-medium text-rk-text">{condition.condition}</span>
                                <p className="text-sm text-rk-subtle">{condition.why}</p>
                              </div>
                              <div className="text-sm text-rk-primary font-medium">
                                {Math.round(condition.likelihood * 100)}%
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Matched Keywords */}
                    {result.matchedKeywords && result.matchedKeywords.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-rk-text mb-3">Kata Kunci Terdeteksi</h4>
                        <div className="flex flex-wrap gap-2">
                          {result.matchedKeywords.map((keyword: string, index: number) => (
                            <RKBadge key={index} variant="primary">
                              {keyword}
                            </RKBadge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Find Nearest Hospital */}
                    <div className="mt-8 p-4 bg-rk-surface rounded-lg">
                      <h4 className="font-semibold text-rk-text mb-2">Butuh Bantuan Medis?</h4>
                      <p className="text-rk-subtle text-sm mb-3">
                        Cari rumah sakit terdekat untuk penanganan lebih lanjut
                      </p>
                      <RKButton 
                        variant="secondary" 
                        size="sm"
                        className="w-full flex items-center justify-center gap-2"
                        onClick={() => {
                          const region = result.seasonalContext || 'Indonesia'
                          const query = encodeURIComponent(`rumah sakit terdekat ${region}`)
                          window.open(`https://www.google.com/maps/search/${query}`, '_blank')
                        }}
                      >
                        <ExternalLink className="w-4 h-4" />
                        Cari Rumah Sakit Terdekat
                      </RKButton>
                    </div>
                  </RKCard>
                ) : (
                  <RKCard elevated className="text-center">
                    <div className="w-16 h-16 bg-rk-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <HeartPulse className="w-8 h-8 text-rk-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-rk-text mb-2">
                      Hasil Triage Akan Muncul di Sini
                    </h3>
                    <p className="text-rk-subtle">
                      Isi form di sebelah kiri dan klik &quot;Mulai Triage&quot; untuk mendapatkan analisis kesehatan AI
                    </p>
                  </RKCard>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}