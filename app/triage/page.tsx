'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { RiskCard } from '@/components/RiskCard'
import { ConsentSwitch } from '@/components/ConsentSwitch'
import { TriageResult } from '@/lib/triage/engine'
import { INDONESIAN_PROVINCES } from '@/lib/utils/regions'
import { HeartPulse, MapPin, ExternalLink } from 'lucide-react'

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

export default function TriagePage() {
  const [result, setResult] = useState<TriageResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors }, watch } = useForm<TriageForm>({
    resolver: zodResolver(triageSchema)
  })

  const currentMonth = new Date().getMonth() + 1

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
          month: data.month || currentMonth,
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

  const findNearestFacility = () => {
    const region = watch('region')
    if (region) {
      const query = encodeURIComponent(`rumah sakit terdekat ${region}`)
      window.open(`https://www.google.com/maps/search/${query}`, '_blank')
    } else {
      window.open('https://www.google.com/maps/search/rumah+sakit+terdekat', '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-8 h-8 text-sky-500" />
            <span className="text-2xl font-bold text-white">Raksha AI</span>
          </div>
          <div className="flex gap-4">
            <a href="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </a>
            <a href="/lite" className="text-gray-300 hover:text-white transition-colors">
              Lite
            </a>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              AI Health Triage
            </h1>
            <p className="text-gray-300">
              Jelaskan gejala Anda untuk mendapatkan panduan triage yang akurat
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="bg-gray-900 p-6 rounded-2xl">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Symptoms */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Gejala yang Dialami *
                  </label>
                  <textarea
                    {...register('symptomsText')}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Contoh: Demam tinggi, sakit kepala, mual, lemas..."
                    rows={4}
                  />
                  {errors.symptomsText && (
                    <p className="text-red-400 text-sm mt-1">{errors.symptomsText.message}</p>
                  )}
                </div>

                {/* Age */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Usia (tahun)
                  </label>
                  <input
                    type="number"
                    {...register('age', { valueAsNumber: true })}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Contoh: 25"
                  />
                </div>

                {/* Temperature */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Suhu Tubuh (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    {...register('tempC', { valueAsNumber: true })}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Contoh: 38.5"
                  />
                </div>

                {/* Days of Fever */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Berapa hari demam?
                  </label>
                  <input
                    type="number"
                    {...register('daysFever', { valueAsNumber: true })}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Contoh: 2"
                  />
                </div>

                {/* Region */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Wilayah/Provinsi
                  </label>
                  <select
                    {...register('region')}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="">Pilih wilayah...</option>
                    {INDONESIAN_PROVINCES.map(province => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Red Flags */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Gejala Darurat (centang jika ada)
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-gray-300">
                      <input
                        type="checkbox"
                        {...register('redFlags.chestPain')}
                        className="rounded border-gray-600 bg-gray-800 text-sky-500 focus:ring-sky-500"
                      />
                      Nyeri dada
                    </label>
                    <label className="flex items-center gap-2 text-gray-300">
                      <input
                        type="checkbox"
                        {...register('redFlags.bleeding')}
                        className="rounded border-gray-600 bg-gray-800 text-sky-500 focus:ring-sky-500"
                      />
                      Pendarahan
                    </label>
                    <label className="flex items-center gap-2 text-gray-300">
                      <input
                        type="checkbox"
                        {...register('redFlags.sob')}
                        className="rounded border-gray-600 bg-gray-800 text-sky-500 focus:ring-sky-500"
                      />
                      Sesak napas
                    </label>
                  </div>
                </div>

                {/* Consent */}
                <ConsentSwitch checked={consent} onChange={setConsent} />

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  {loading ? 'Memproses...' : 'Lakukan Triage'}
                </button>

                {error && (
                  <div className="p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
                    {error}
                  </div>
                )}
              </form>
            </div>

            {/* Results */}
            <div>
              {result ? (
                <div className="space-y-6">
                  <RiskCard result={result} />
                  
                  <button
                    onClick={findNearestFacility}
                    className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    <MapPin className="w-5 h-5" />
                    Cari Fasilitas Kesehatan Terdekat
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="bg-gray-900 p-6 rounded-2xl text-center">
                  <HeartPulse className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Hasil Triage Akan Muncul Di Sini
                  </h3>
                  <p className="text-gray-400">
                    Isi form di sebelah kiri dan klik "Lakukan Triage" untuk melihat hasil
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
