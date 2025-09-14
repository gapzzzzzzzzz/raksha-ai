'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TriageResult } from '@/lib/triage/engine'
import { HeartPulse, Wifi, Smartphone } from 'lucide-react'

const triageSchema = z.object({
  symptomsText: z.string().min(1, 'Gejala harus diisi'),
  age: z.number().min(0).max(120).optional(),
  tempC: z.number().min(30).max(45).optional(),
  daysFever: z.number().min(0).max(30).optional(),
  region: z.string().optional(),
  redFlags: z.object({
    chestPain: z.boolean().optional(),
    bleeding: z.boolean().optional(),
    sob: z.boolean().optional()
  }).optional()
})

type TriageForm = z.infer<typeof triageSchema>

export default function LitePage() {
  const [result, setResult] = useState<TriageResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOffline, setIsOffline] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<TriageForm>({
    resolver: zodResolver(triageSchema)
  })

  // Check online status
  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine)
      const handleOnline = () => setIsOffline(false)
      const handleOffline = () => setIsOffline(true)
      
      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)
      
      return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
      }
    }
  }, [])

  const onSubmit = async (data: TriageForm) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/triage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          month: new Date().getMonth() + 1,
          consent: false // No consent for lite version
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

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'EMERGENCY': return 'text-red-600 bg-red-50'
      case 'CONSULT': return 'text-yellow-600 bg-yellow-50'
      case 'SELF_CARE': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
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

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Minimal Header */}
      <header className="bg-sky-500 text-white p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5" />
            <h1 className="text-lg font-bold">Raksha Lite</h1>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {isOffline ? (
              <div className="flex items-center gap-1">
                <Wifi className="w-4 h-4" />
                <span>Offline</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Smartphone className="w-4 h-4" />
                <span>Lite</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-6 py-4">
          <h2 className="text-xl font-bold mb-1">Triage Kesehatan</h2>
          <p className="text-sm text-gray-600">Mode ringan untuk koneksi lambat</p>
        </div>

        {/* Form */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Symptoms */}
            <div>
              <label className="block text-sm font-medium mb-1">Gejala *</label>
              <textarea
                {...register('symptomsText')}
                className="w-full p-2 border border-gray-300 rounded text-sm resize-none"
                placeholder="Jelaskan gejala yang dialami..."
                rows={3}
              />
              {errors.symptomsText && (
                <p className="text-red-600 text-xs mt-1">{errors.symptomsText.message}</p>
              )}
            </div>

            {/* Age and Temperature */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Usia</label>
                <input
                  type="number"
                  {...register('age', { valueAsNumber: true })}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  placeholder="25"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Suhu (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  {...register('tempC', { valueAsNumber: true })}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  placeholder="38.5"
                />
              </div>
            </div>

            {/* Region */}
            <div>
              <label className="block text-sm font-medium mb-1">Wilayah</label>
              <input
                type="text"
                {...register('region')}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                placeholder="Contoh: Jakarta"
              />
            </div>

            {/* Red Flags */}
            <div>
              <label className="block text-sm font-medium mb-2">Gejala Darurat</label>
              <div className="space-y-1 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register('redFlags.chestPain')}
                    className="rounded"
                  />
                  Nyeri dada
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register('redFlags.bleeding')}
                    className="rounded"
                  />
                  Pendarahan
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register('redFlags.sob')}
                    className="rounded"
                  />
                  Sesak napas
                </label>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded text-sm"
            >
              {loading ? 'Memproses...' : 'Triage'}
            </button>

            {error && (
              <div className="p-2 bg-red-100 border border-red-300 rounded text-red-700 text-xs">
                {error}
              </div>
            )}
          </form>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="font-bold mb-3 text-sm">Hasil Triage</h3>
            
            {/* Risk Level */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">Tingkat Risiko:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(result.level)}`}>
                  {getRiskLabel(result.level)}
                </span>
              </div>
              <p className="text-xs text-gray-600">Skor: {result.score}/100</p>
            </div>

            {/* Seasonal Context */}
            {result.seasonalContext && (
              <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                <strong>Konteks Musiman:</strong> {result.seasonalContext}
              </div>
            )}

            {/* Reasons */}
            {result.reasons.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-1">Alasan:</h4>
                <ul className="text-xs text-gray-700 space-y-1">
                  {result.reasons.map((reason, index) => (
                    <li key={index}>• {reason}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Micro Education */}
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-1">Panduan:</h4>
              <ul className="text-xs text-gray-700 space-y-1">
                {result.microEducation.map((education, index) => (
                  <li key={index}>• {education}</li>
                ))}
              </ul>
            </div>

            {/* Disclaimer */}
            <div className="p-2 bg-yellow-100 border border-yellow-300 rounded text-yellow-800 text-xs">
              <strong>PENTING:</strong> Ini bukan diagnosis medis. Konsultasikan dengan dokter.
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-xs text-gray-500 py-4">
          <p>© 2024 Raksha - Mode Lite</p>
          <p>Bukan perangkat medis</p>
          <div className="mt-2 flex justify-center gap-4 text-xs">
            <span>PWA/Offline</span>
            <span>•</span>
            <span>Low-Bandwidth</span>
          </div>
        </footer>
      </div>
    </div>
  )
}