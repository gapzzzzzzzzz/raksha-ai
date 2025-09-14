'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TriageResult } from '@/lib/triage/engine'
import { 
  Activity, 
  Thermometer, 
  Calendar, 
  MapPin, 
  AlertTriangle,
  HeartPulse,
  Clock,
  User,
  CheckCircle,
  ArrowRight,
  Shield,
  Info
} from 'lucide-react'

const triageSchema = z.object({
  symptomsText: z.string().min(1, 'Gejala harus diisi'),
  age: z.number().min(0).max(120).optional(),
  tempC: z.number().min(30).max(45).optional(),
  daysFever: z.number().min(0).max(30).optional(),
  region: z.string().optional(),
  month: z.number().min(1).max(12).optional(),
  redFlags: z.object({
    chestPain: z.boolean().optional(),
    bleeding: z.boolean().optional(),
    sob: z.boolean().optional()
  }).optional()
})

type TriageForm = z.infer<typeof triageSchema>

const symptomSuggestions = [
  'demam', 'ruam', 'mual', 'pusing', 'lemas', 'batuk', 'sesak', 'nyeri', 'muntah'
]

const INDONESIAN_PROVINCES = [
  'Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Kepulauan Riau', 'Jambi',
  'Sumatera Selatan', 'Bangka Belitung', 'Bengkulu', 'Lampung', 'DKI Jakarta',
  'Jawa Barat', 'Banten', 'Jawa Tengah', 'DI Yogyakarta', 'Jawa Timur',
  'Bali', 'Nusa Tenggara Barat', 'Nusa Tenggara Timur', 'Kalimantan Barat',
  'Kalimantan Tengah', 'Kalimantan Selatan', 'Kalimantan Timur', 'Kalimantan Utara',
  'Sulawesi Utara', 'Sulawesi Tengah', 'Sulawesi Selatan', 'Sulawesi Tenggara',
  'Gorontalo', 'Sulawesi Barat', 'Maluku', 'Maluku Utara', 'Papua Barat', 'Papua'
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
        throw new Error('Gagal melakukan triage')
      }

      const triageResult = await response.json()
      setResult(triageResult)
    } catch (err) {
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
      case 'EMERGENCY': return 'text-red-600 bg-red-50 border-red-200'
      case 'CONSULT': return 'text-amber-600 bg-amber-50 border-amber-200'
      case 'SELF_CARE': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getRiskLabel = (level: string) => {
    switch (level) {
      case 'EMERGENCY': return 'DARURAT'
      case 'CONSULT': return 'KONSULTASI'
      case 'SELF_CARE': return 'PERAWATAN DIRI'
      default: return level
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

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-rk-primary-50 text-rk-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              AI Health Triage
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-rk-text mb-6">
              Triage Kesehatan
            </h1>
            <p className="text-xl text-rk-subtle max-w-3xl mx-auto leading-relaxed">
              Jelaskan gejala Anda untuk mendapatkan panduan triage yang akurat dan kontekstual untuk Indonesia
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form Panel */}
            <div className="space-y-8">
              <div className="rk-card-elevated p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  {/* Symptoms */}
                  <div>
                    <label className="block text-lg font-semibold text-rk-text mb-3">
                      <Activity className="w-5 h-5 inline mr-2" />
                      Gejala yang Dialami *
                    </label>
                    <textarea
                      {...register('symptomsText')}
                      className="w-full p-4 border border-rk-border rounded-xl text-rk-text placeholder-rk-subtle focus:outline-none focus:ring-2 focus:ring-rk-primary focus:border-transparent resize-none"
                      placeholder="Contoh: demam tinggi 39°C selama 2 hari, mual, ruam merah, lemas"
                      rows={4}
                    />
                    {errors.symptomsText && (
                      <p className="text-red-600 text-sm mt-2">{errors.symptomsText.message}</p>
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
                        <User className="w-4 h-4 inline mr-2" />
                        Usia (tahun)
                      </label>
                      <input
                        type="number"
                        {...register('age', { valueAsNumber: true })}
                        className="w-full p-3 border border-rk-border rounded-lg text-rk-text placeholder-rk-subtle focus:outline-none focus:ring-2 focus:ring-rk-primary focus:border-transparent"
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
                        className="w-full p-3 border border-rk-border rounded-lg text-rk-text placeholder-rk-subtle focus:outline-none focus:ring-2 focus:ring-rk-primary focus:border-transparent"
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
                      className="w-full p-3 border border-rk-border rounded-lg text-rk-text placeholder-rk-subtle focus:outline-none focus:ring-2 focus:ring-rk-primary focus:border-transparent"
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
                      className="w-full p-3 border border-rk-border rounded-lg text-rk-text focus:outline-none focus:ring-2 focus:ring-rk-primary focus:border-transparent"
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
                      Gejala Darurat
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-3 border border-rk-border rounded-lg hover:bg-rk-surface transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('redFlags.chestPain')}
                          className="w-4 h-4 text-rk-primary rounded focus:ring-rk-primary"
                        />
                        <span className="text-rk-text">Nyeri dada</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-rk-border rounded-lg hover:bg-rk-surface transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('redFlags.bleeding')}
                          className="w-4 h-4 text-rk-primary rounded focus:ring-rk-primary"
                        />
                        <span className="text-rk-text">Pendarahan</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-rk-border rounded-lg hover:bg-rk-surface transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('redFlags.sob')}
                          className="w-4 h-4 text-rk-primary rounded focus:ring-rk-primary"
                        />
                        <span className="text-rk-text">Sesak napas</span>
                      </label>
                    </div>
                  </div>

                  {/* Consent */}
                  <div>
                    <label className="flex items-start gap-3 p-4 border border-rk-border rounded-lg hover:bg-rk-surface transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="w-4 h-4 text-rk-primary rounded focus:ring-rk-primary mt-1"
                      />
                      <div className="text-sm text-rk-text">
                        <span className="font-medium">Saya setuju</span> untuk berbagi data anonim untuk penelitian kesehatan masyarakat. 
                        Data tidak akan menyertakan informasi pribadi.
                      </div>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rk-button rk-button-primary rk-button-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  </button>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="w-5 h-5" />
                        <span className="font-medium">Error</span>
                      </div>
                      <p className="text-red-600 text-sm mt-1">{error}</p>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Results Panel */}
            <div className="space-y-8">
              {result ? (
                <div className="rk-card-elevated p-8">
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
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-blue-800 mb-1">Konteks Musiman</h4>
                          <p className="text-blue-700 text-sm">{result.seasonalContext}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Reasons */}
                  {result.reasons.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-rk-text mb-3">Alasan Penilaian</h4>
                      <ul className="space-y-2">
                        {result.reasons.map((reason, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-rk-text">{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Micro Education */}
                  <div>
                    <h4 className="text-lg font-semibold text-rk-text mb-3">Panduan Perawatan</h4>
                    <ul className="space-y-2">
                      {result.microEducation.map((education, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-rk-primary rounded-full mt-2 flex-shrink-0" />
                          <span className="text-rk-text">{education}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="rk-card-elevated p-8 text-center">
                  <div className="w-16 h-16 bg-rk-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <HeartPulse className="w-8 h-8 text-rk-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-rk-text mb-2">
                    Hasil Triage Akan Muncul Di Sini
                  </h3>
                  <p className="text-rk-subtle">
                    Isi form di sebelah kiri dan klik &quot;Mulai Triage&quot; untuk mendapatkan hasil
                  </p>
                </div>
              )}

              {/* Disclaimer */}
              <div className="rk-card p-6 bg-amber-50 border-amber-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-800 mb-2">Penting</h4>
                    <p className="text-amber-700 text-sm mb-2">
                      Raksha bukan perangkat medis. Hasil triage hanya sebagai panduan awal.
                    </p>
                    <p className="text-amber-700 text-sm">
                      Dalam keadaan darurat, segera hubungi 118/119 atau ke IGD terdekat.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}