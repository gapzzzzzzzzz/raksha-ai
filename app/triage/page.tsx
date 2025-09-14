'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { RiskCard } from '@/components/RiskCard'
import { ConsentSwitch } from '@/components/ConsentSwitch'
import { FormField, TextareaField, SelectField } from '@/components/FormField'
import { SkeletonCard } from '@/components/Skeleton'
import { ToastContainer, ToastProps } from '@/components/Toast'
import { TriageResult } from '@/lib/triage/engine'
import { INDONESIAN_PROVINCES } from '@/lib/utils/regions'
import { 
  Activity, 
  Thermometer, 
  Calendar, 
  MapPin, 
  AlertTriangle,
  HeartPulse,
  Clock,
  User
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

export default function TriagePage() {
  const [result, setResult] = useState<TriageResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [consent, setConsent] = useState(false)
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<TriageForm>({
    resolver: zodResolver(triageSchema)
  })

  const currentMonth = new Date().getMonth() + 1
  const symptomsText = watch('symptomsText')

  const addToast = (toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { ...toast, id, onClose: removeToast }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const onSubmit = async (data: TriageForm) => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/triage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          month: data.month || currentMonth,
          consent
        }),
      })

      if (!response.ok) {
        throw new Error('Gagal melakukan triage')
      }

      const triageResult = await response.json()
      setResult(triageResult)
      
      addToast({
        type: 'success',
        title: 'Triage Berhasil',
        description: 'Hasil triage telah dihasilkan'
      })
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Gagal Triage',
        description: err instanceof Error ? err.message : 'Terjadi kesalahan'
      })
    } finally {
      setLoading(false)
    }
  }

  const addSymptomSuggestion = (symptom: string) => {
    const current = symptomsText || ''
    const newText = current ? `${current}, ${symptom}` : symptom
    setValue('symptomsText', newText)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault()
        handleSubmit(onSubmit)()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="min-h-screen bg-rk-bg">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-rk-text mb-4">
              AI Health Triage
            </h1>
            <p className="text-xl text-rk-subtle max-w-2xl mx-auto">
              Jelaskan gejala Anda untuk mendapatkan panduan triage yang akurat dan kontekstual
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Form Panel - 7 columns */}
            <div className="lg:col-span-7">
              <div className="rk-card p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Symptoms */}
                  <TextareaField
                    label="Gejala yang Dialami"
                    placeholder="Contoh: demam tinggi 39°C selama 2 hari, mual, ruam merah, lemas"
                    error={errors.symptomsText?.message}
                    help="Jelaskan gejala secara detail termasuk durasi dan tingkat keparahan"
                    icon={<Activity className="w-5 h-5" />}
                    {...register('symptomsText')}
                    rows={4}
                  />

                  {/* Symptom Suggestions */}
                  <div>
                    <label className="block text-sm font-medium text-rk-text mb-2">
                      Klik untuk menambah gejala umum:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {symptomSuggestions.map((symptom) => (
                        <button
                          key={symptom}
                          type="button"
                          onClick={() => addSymptomSuggestion(symptom)}
                          className="rk-chip bg-rk-surface text-rk-text hover:bg-rk-primary/10 hover:text-rk-primary transition-colors cursor-pointer"
                        >
                          {symptom}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Age and Temperature Row */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      label="Usia (tahun)"
                      type="number"
                      placeholder="Contoh: 25"
                      icon={<User className="w-5 h-5" />}
                      {...register('age', { valueAsNumber: true })}
                    />
                    <FormField
                      label="Suhu Tubuh (°C)"
                      type="number"
                      step="0.1"
                      placeholder="Contoh: 38.5"
                      icon={<Thermometer className="w-5 h-5" />}
                      {...register('tempC', { valueAsNumber: true })}
                    />
                  </div>

                  {/* Days of Fever */}
                  <FormField
                    label="Berapa hari demam?"
                    type="number"
                    placeholder="Contoh: 2"
                    icon={<Calendar className="w-5 h-5" />}
                    help="Hitung dari hari pertama demam"
                    {...register('daysFever', { valueAsNumber: true })}
                  />

                  {/* Region */}
                  <SelectField
                    label="Wilayah/Provinsi"
                    options={INDONESIAN_PROVINCES.map(province => ({
                      value: province,
                      label: province
                    }))}
                    icon={<MapPin className="w-5 h-5" />}
                    help="Pilih untuk mendapatkan konteks musiman yang akurat"
                    {...register('region')}
                  />

                  {/* Red Flags */}
                  <div>
                    <label className="block text-sm font-medium text-rk-text mb-3">
                      Gejala Darurat (centang jika ada)
                    </label>
                    <div className="rk-card p-4 space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          {...register('redFlags.chestPain')}
                          className="w-4 h-4 text-rk-danger bg-rk-surface border-rk-border rounded focus:ring-rk-danger focus:ring-2"
                        />
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-rk-danger" />
                          <span className="text-rk-text group-hover:text-rk-primary transition-colors">
                            Nyeri dada
                          </span>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          {...register('redFlags.bleeding')}
                          className="w-4 h-4 text-rk-danger bg-rk-surface border-rk-border rounded focus:ring-rk-danger focus:ring-2"
                        />
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-rk-danger" />
                          <span className="text-rk-text group-hover:text-rk-primary transition-colors">
                            Pendarahan
                          </span>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          {...register('redFlags.sob')}
                          className="w-4 h-4 text-rk-danger bg-rk-surface border-rk-border rounded focus:ring-rk-danger focus:ring-2"
                        />
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-rk-danger" />
                          <span className="text-rk-text group-hover:text-rk-primary transition-colors">
                            Sesak napas
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Consent */}
                  <ConsentSwitch checked={consent} onChange={setConsent} />

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="rk-button-primary w-full py-4 text-lg font-semibold group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Memproses Triage...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <HeartPulse className="w-5 h-5 group-hover:animate-pulse" />
                        Lakukan Triage
                        <span className="text-sm opacity-75">(Ctrl+Enter)</span>
                      </div>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Result Panel - 5 columns */}
            <div className="lg:col-span-5">
              <div className="sticky top-8">
                {loading ? (
                  <SkeletonCard />
                ) : result ? (
                  <div className="space-y-6">
                    <RiskCard
                      level={result.level}
                      score={result.score}
                      reasons={result.reasons}
                      microEducation={result.microEducation}
                      seasonalContext={result.seasonalContext}
                      region={watch('region')}
                    />
                    
                    {/* Additional Actions */}
                    <div className="rk-card p-6">
                      <h3 className="font-semibold text-rk-text mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-rk-primary" />
                        Langkah Selanjutnya
                      </h3>
                      <div className="space-y-3">
                        <button
                          onClick={() => {
                            const region = watch('region')
                            const query = region 
                              ? `rumah sakit terdekat ${region}`
                              : 'rumah sakit terdekat'
                            window.open(`https://maps.google.com/maps?q=${encodeURIComponent(query)}`, '_blank')
                          }}
                          className="rk-button-secondary w-full flex items-center justify-center gap-2"
                        >
                          <MapPin className="w-4 h-4" />
                          Cari Fasilitas Kesehatan Terdekat
                        </button>
                        
                        <button
                          onClick={() => {
                            setResult(null)
                            addToast({
                              type: 'info',
                              title: 'Form Direset',
                              description: 'Silakan isi form baru untuk triage berikutnya'
                            })
                          }}
                          className="rk-button-ghost w-full"
                        >
                          Triage Baru
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rk-card p-8 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-rk-primary/10 rounded-2xl flex items-center justify-center">
                      <HeartPulse className="w-10 h-10 text-rk-primary animate-pulse-slow" />
                    </div>
                    <h3 className="text-xl font-display font-semibold text-rk-text mb-3">
                      Hasil Triage Akan Muncul Di Sini
                    </h3>
                    <p className="text-rk-subtle mb-6">
                      Isi form di sebelah kiri dan klik "Lakukan Triage" untuk melihat hasil
                    </p>
                    <div className="text-sm text-rk-subtle">
                      <p className="mb-2">Tips:</p>
                      <ul className="space-y-1 text-left">
                        <li>• Jelaskan gejala secara detail</li>
                        <li>• Sertakan suhu tubuh jika ada demam</li>
                        <li>• Pilih wilayah untuk konteks musiman</li>
                        <li>• Gunakan Ctrl+Enter untuk submit cepat</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}