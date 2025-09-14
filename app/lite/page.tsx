'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { RiskCard } from '@/components/RiskCard'
import { TriageResult } from '@/lib/triage/engine'
import { HeartPulse } from 'lucide-react'

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

  const { register, handleSubmit, formState: { errors } } = useForm<TriageForm>({
    resolver: zodResolver(triageSchema)
  })

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

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Simple Header */}
      <header className="bg-sky-500 text-white p-4">
        <div className="container mx-auto flex items-center gap-2">
          <HeartPulse className="w-6 h-6" />
          <h1 className="text-xl font-bold">Raksha AI - Lite</h1>
        </div>
      </header>

      <div className="container mx-auto p-4 max-w-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Triage Kesehatan</h2>
          <p className="text-gray-600">Mode ringan untuk koneksi lambat</p>
        </div>

        <div className="space-y-6">
          {/* Simple Form */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Gejala *</label>
                <textarea
                  {...register('symptomsText')}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  placeholder="Jelaskan gejala yang dialami..."
                  rows={3}
                />
                {errors.symptomsText && (
                  <p className="text-red-600 text-sm">{errors.symptomsText.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">Usia</label>
                  <input
                    type="number"
                    {...register('age', { valueAsNumber: true })}
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                    placeholder="25"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Suhu (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    {...register('tempC', { valueAsNumber: true })}
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                    placeholder="38.5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">Wilayah</label>
                <input
                  type="text"
                  {...register('region')}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  placeholder="Contoh: Jakarta"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Gejala Darurat</label>
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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded"
              >
                {loading ? 'Memproses...' : 'Triage'}
              </button>

              {error && (
                <div className="p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                  {error}
                </div>
              )}
            </form>
          </div>

          {/* Results */}
          {result && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3">Hasil Triage</h3>
              
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">Tingkat Risiko:</span>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    result.level === 'EMERGENCY' ? 'bg-red-100 text-red-800' :
                    result.level === 'CONSULT' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {result.level}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Skor: {result.score}/100</p>
              </div>

              {result.reasons.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium mb-1">Alasan:</h4>
                  <ul className="text-sm text-gray-700">
                    {result.reasons.map((reason, index) => (
                      <li key={index}>• {reason}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mb-4">
                <h4 className="font-medium mb-1">Panduan:</h4>
                <ul className="text-sm text-gray-700">
                  {result.microEducation.map((education, index) => (
                    <li key={index}>• {education}</li>
                  ))}
                </ul>
              </div>

              <div className="p-2 bg-yellow-100 border border-yellow-300 rounded text-yellow-800 text-xs">
                <strong>PENTING:</strong> Ini bukan diagnosis medis. Konsultasikan dengan dokter.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>© 2024 Raksha AI - Mode Lite</p>
          <p>Bukan perangkat medis</p>
        </footer>
      </div>
    </div>
  )
}
