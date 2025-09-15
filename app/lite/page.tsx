'use client'

import { useState, useEffect } from 'react'
import { HeartPulse, ArrowRight, AlertTriangle, Clock, CheckCircle } from 'lucide-react'
import { RKButton } from '@/src/components/RKButton'

interface TriageResult {
  level: 'EMERGENCY' | 'CONSULT' | 'SELF_CARE'
  score: number
  reasons: string[]
  microEducation: string[]
}

export default function LitePage() {
  const [symptoms, setSymptoms] = useState('')
  const [age, setAge] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TriageResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine)
      const handleOnline = () => setIsOnline(true)
      const handleOffline = () => setIsOnline(false)
      
      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)
      
      return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!symptoms.trim()) return

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
          symptomsText: symptoms,
          age: age ? parseInt(age) : undefined,
          month: new Date().getMonth() + 1,
          consent: true
        }),
      })

      if (!response.ok) {
        throw new Error('Triage gagal')
      }

      const data = await response.json()
      if (data.ok && data.result) {
        setResult({
          level: data.result.level,
          score: data.result.score,
          reasons: data.result.reasons || [],
          microEducation: data.result.microEducation || []
        })
      } else {
        throw new Error('Format respons tidak valid')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'EMERGENCY': return 'text-red-500'
      case 'CONSULT': return 'text-yellow-500'
      case 'SELF_CARE': return 'text-green-500'
      default: return 'text-blue-500'
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'EMERGENCY': return <AlertTriangle className="w-5 h-5" />
      case 'CONSULT': return <Clock className="w-5 h-5" />
      case 'SELF_CARE': return <CheckCircle className="w-5 h-5" />
      default: return <HeartPulse className="w-5 h-5" />
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

  return (
    <div className="min-h-screen bg-rk-bg text-rk-text">
      {/* Header */}
      <header className="bg-rk-primary text-white p-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <HeartPulse className="w-6 h-6" />
          <h1 className="text-lg font-bold">Raksha Lite</h1>
          {!isOnline && (
            <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded">
              Offline
            </span>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4">
        {!result ? (
          /* Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Gejala (wajib)
              </label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Jelaskan gejala Anda..."
                className="w-full p-3 border border-rk-border rounded-lg bg-rk-card text-rk-text placeholder-rk-subtle focus:outline-none focus:ring-2 focus:ring-rk-primary"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Usia (opsional)
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="25"
                className="w-full p-3 border border-rk-border rounded-lg bg-rk-card text-rk-text placeholder-rk-subtle focus:outline-none focus:ring-2 focus:ring-rk-primary"
              />
            </div>

            <RKButton
              type="submit"
              disabled={loading || !symptoms.trim()}
              className="w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  Mulai Triage
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </RKButton>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}
          </form>
        ) : (
          /* Results */
          <div className="space-y-6">
            {/* Risk Level */}
            <div className="text-center p-6 bg-rk-card rounded-lg border border-rk-border">
              <div className={`inline-flex items-center gap-2 ${getRiskColor(result.level)} mb-2`}>
                {getRiskIcon(result.level)}
                <span className="text-lg font-bold">{getRiskLabel(result.level)}</span>
              </div>
              <div className="text-2xl font-bold text-rk-text">
                Skor: {result.score}/100
              </div>
            </div>

            {/* Reasons */}
            {result.reasons.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Alasan:</h3>
                <ul className="space-y-2">
                  {result.reasons.slice(0, 3).map((reason, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tips */}
            {result.microEducation.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Tips Perawatan:</h3>
                <ul className="space-y-2">
                  {result.microEducation.slice(0, 3).map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-2 h-2 bg-rk-primary rounded-full mt-2 flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <RKButton
                onClick={() => {
                  setResult(null)
                  setSymptoms('')
                  setAge('')
                  setError(null)
                }}
                variant="secondary"
                className="w-full"
              >
                Triage Lagi
              </RKButton>
              
              {result.level === 'EMERGENCY' && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm font-medium">
                    ⚠️ Segera cari bantuan medis darurat!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-8 pt-4 border-t border-rk-border text-center">
          <p className="text-xs text-rk-subtle">
            Raksha Lite - AI Health Triage untuk Indonesia
          </p>
          <p className="text-xs text-rk-subtle mt-1">
            Bukan pengganti konsultasi medis profesional
          </p>
        </footer>
      </main>
    </div>
  )
}