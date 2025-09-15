'use client'

import { useState, useEffect, useCallback } from 'react'
import { HeartPulse, MapPin, BarChart3, Filter, AlertTriangle, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { RKCard } from '@/src/components/RKCard'
import { RKButton } from '@/src/components/RKButton'
import { RKBadge } from '@/src/components/RKBadge'
import { SectionHeading } from '@/src/components/SectionHeading'

interface ReportData {
  reports: Array<{
    id: string
    region: string | null
    month: number | null
    riskLevel: string
    createdAt: string
  }>
  aggregations: {
    byRegion: Array<{ region: string; _count: { region: number } }>
    byRisk: Array<{ riskLevel: string; _count: { riskLevel: number } }>
    byMonth: Array<{ month: number; _count: { month: number } }>
  }
  total: number
  isDemo?: boolean
  message?: string
}

export default function DashboardPage() {
  const [data, setData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    region: '',
    month: '',
    risk: ''
  })

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams()
      if (filters.region) params.append('region', filters.region)
      if (filters.month) params.append('month', filters.month)
      if (filters.risk) params.append('risk', filters.risk)

      const response = await fetch(`/api/reports?${params}`)
      if (!response.ok) throw new Error('Failed to fetch data')
      
      const result = await response.json()
      setData(result)
    } catch (err) {
      console.error('Dashboard fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const getRegionCoordinates = (region: string) => {
    const coordinates: Record<string, { lat: number; lng: number }> = {
      'Jakarta': { lat: -6.2088, lng: 106.8456 },
      'Surabaya': { lat: -7.2504, lng: 112.7688 },
      'Bandung': { lat: -6.9175, lng: 107.6191 },
      'Medan': { lat: 3.5952, lng: 98.6722 },
      'Semarang': { lat: -7.7956, lng: 110.3695 },
      'Makassar': { lat: -5.1477, lng: 119.4327 },
      'Palembang': { lat: -3.3194, lng: 103.9144 },
      'Tangerang': { lat: -6.1781, lng: 106.6300 }
    }
    return coordinates[region]
  }

  const mapData = data?.aggregations.byRegion.map(item => {
    const coords = getRegionCoordinates(item.region)
    return {
      region: item.region,
      count: item._count.region,
      lat: coords?.lat,
      lng: coords?.lng
    }
  }).filter(item => item.lat && item.lng) || []

  const riskData = data?.aggregations.byRisk.map(item => ({
    name: item.riskLevel,
    value: item._count.riskLevel
  })) || []

  const regionData = data?.aggregations.byRegion.map(item => ({
    name: item.region,
    value: item._count.region
  })) || []

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-rk-bg">
        <div className="container mx-auto px-6 md:px-8 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-rk-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <HeartPulse className="w-8 h-8 text-white" />
              </div>
              <SectionHeading title="Loading Dashboard..." />
              <p className="text-rk-subtle">Fetching health data and analytics</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <RKCard key={i} className="animate-pulse">
                  <div className="rk-skeleton h-32 rounded-lg"></div>
                </RKCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-rk-bg flex items-center justify-center">
        <RKCard elevated className="max-w-md text-center">
          <div className="w-16 h-16 bg-rk-danger-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-rk-danger" />
          </div>
          <h2 className="text-xl font-bold text-rk-text mb-4">Failed to Load Dashboard</h2>
          <p className="text-rk-subtle mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <RKButton onClick={fetchData} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Retry
            </RKButton>
            <RKButton variant="secondary" asChild>
              <Link href="/">Back to Home</Link>
            </RKButton>
          </div>
        </RKCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-rk-bg">
      {/* Header */}
      <header className="bg-rk-surface border-b border-rk-border">
        <div className="container mx-auto px-6 md:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-rk-primary to-rk-accent rounded-xl flex items-center justify-center">
                <HeartPulse className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-rk-text">Raksha AI Dashboard</h1>
                {data?.isDemo && (
                  <RKBadge variant="warning" className="mt-1">
                    Demo Mode
                  </RKBadge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {data?.isDemo && (
                <div className="text-sm text-rk-warning bg-rk-warning-50 px-3 py-1 rounded-lg">
                  {data.message}
                </div>
              )}
              <RKButton variant="secondary" asChild>
                <Link href="/">Back to Home</Link>
              </RKButton>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 md:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <RKCard>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-rk-primary-50 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-rk-primary" />
                </div>
                <div>
                  <p className="text-rk-subtle text-sm">Total Reports</p>
                  <p className="text-2xl font-bold text-rk-text">{data?.total || 0}</p>
                </div>
              </div>
            </RKCard>
            
            <RKCard>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-rk-accent-50 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-rk-accent" />
                </div>
                <div>
                  <p className="text-rk-subtle text-sm">Regions</p>
                  <p className="text-2xl font-bold text-rk-text">{data?.aggregations.byRegion.length || 0}</p>
                </div>
              </div>
            </RKCard>

            <RKCard>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-rk-warning-50 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-rk-warning" />
                </div>
                <div>
                  <p className="text-rk-subtle text-sm">Emergency Cases</p>
                  <p className="text-2xl font-bold text-rk-text">
                    {data?.aggregations.byRisk.find(r => r.riskLevel === 'EMERGENCY')?._count.riskLevel || 0}
                  </p>
                </div>
              </div>
            </RKCard>

            <RKCard>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-rk-success-50 rounded-xl flex items-center justify-center">
                  <HeartPulse className="w-6 h-6 text-rk-success" />
                </div>
                <div>
                  <p className="text-rk-subtle text-sm">Self Care</p>
                  <p className="text-2xl font-bold text-rk-text">
                    {data?.aggregations.byRisk.find(r => r.riskLevel === 'SELF_CARE')?._count.riskLevel || 0}
                  </p>
                </div>
              </div>
            </RKCard>
          </div>

          {/* Filters */}
          <RKCard className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Filter className="w-5 h-5 text-rk-primary" />
              <h3 className="text-lg font-semibold text-rk-text">Filters</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-rk-text mb-2">Region</label>
                <select
                  value={filters.region}
                  onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value }))}
                  className="w-full p-3 border border-rk-border rounded-lg bg-rk-card text-rk-text focus:outline-none focus:ring-2 focus:ring-rk-primary"
                >
                  <option value="">All Regions</option>
                  {data?.aggregations.byRegion.map(region => (
                    <option key={region.region} value={region.region}>
                      {region.region}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-rk-text mb-2">Month</label>
                <select
                  value={filters.month}
                  onChange={(e) => setFilters(prev => ({ ...prev, month: e.target.value }))}
                  className="w-full p-3 border border-rk-border rounded-lg bg-rk-card text-rk-text focus:outline-none focus:ring-2 focus:ring-rk-primary"
                >
                  <option value="">All Months</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleString('id-ID', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-rk-text mb-2">Risk Level</label>
                <select
                  value={filters.risk}
                  onChange={(e) => setFilters(prev => ({ ...prev, risk: e.target.value }))}
                  className="w-full p-3 border border-rk-border rounded-lg bg-rk-card text-rk-text focus:outline-none focus:ring-2 focus:ring-rk-primary"
                >
                  <option value="">All Risk Levels</option>
                  <option value="EMERGENCY">Emergency</option>
                  <option value="CONSULT">Consult</option>
                  <option value="SELF_CARE">Self Care</option>
                </select>
              </div>
            </div>
          </RKCard>

          {/* Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Risk Distribution */}
            <RKCard elevated>
              <h3 className="text-lg font-semibold text-rk-text mb-6">Risk Level Distribution</h3>
              <div className="space-y-4">
                {riskData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${
                        item.name === 'EMERGENCY' ? 'bg-rk-danger' :
                        item.name === 'CONSULT' ? 'bg-rk-warning' :
                        'bg-rk-success'
                      }`} />
                      <span className="text-rk-text">{item.name}</span>
                    </div>
                    <div className="text-rk-text font-semibold">{item.value}</div>
                  </div>
                ))}
              </div>
            </RKCard>

            {/* Top Regions */}
            <RKCard elevated>
              <h3 className="text-lg font-semibold text-rk-text mb-6">Top Regions</h3>
              <div className="space-y-4">
                {regionData.slice(0, 5).map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-rk-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {index + 1}
                      </div>
                      <span className="text-rk-text">{item.name}</span>
                    </div>
                    <div className="text-rk-text font-semibold">{item.value}</div>
                  </div>
                ))}
              </div>
            </RKCard>
          </div>

          {/* Map Placeholder */}
          <RKCard elevated className="mt-8">
            <h3 className="text-lg font-semibold text-rk-text mb-6">Regional Heatmap</h3>
            <div className="h-64 bg-rk-surface rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-rk-subtle mx-auto mb-4" />
                <p className="text-rk-subtle">Map visualization would be here</p>
                <p className="text-sm text-rk-subtle mt-2">
                  {mapData.length} regions with data
                </p>
              </div>
            </div>
          </RKCard>
        </div>
      </div>
    </div>
  )
}