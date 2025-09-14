'use client'

import { useState, useEffect } from 'react'
import { MapHeat } from '@/components/MapHeat'
import { Charts } from '@/components/Charts'
import { HeartPulse, MapPin, BarChart3, Filter } from 'lucide-react'

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

  const fetchData = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.region) params.append('region', filters.region)
      if (filters.month) params.append('month', filters.month)
      if (filters.risk) params.append('risk', filters.risk)

      const response = await fetch(`/api/reports?${params}`)
      if (!response.ok) throw new Error('Failed to fetch data')
      
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [filters])

  const getRegionCoordinates = (region: string) => {
    const coordinates: Record<string, { lat: number; lng: number }> = {
      'DKI Jakarta': { lat: -6.2088, lng: 106.8456 },
      'Jawa Barat': { lat: -6.9175, lng: 107.6191 },
      'Jawa Tengah': { lat: -7.7956, lng: 110.3695 },
      'Jawa Timur': { lat: -7.2504, lng: 112.7688 },
      'Banten': { lat: -6.4058, lng: 106.0640 },
      'Bali': { lat: -8.3405, lng: 115.0920 },
      'Nusa Tenggara Barat': { lat: -8.6529, lng: 117.3616 },
      'Nusa Tenggara Timur': { lat: -8.6574, lng: 121.0794 },
      'Kalimantan Timur': { lat: -1.2379, lng: 116.8529 },
      'Sumatera Utara': { lat: 3.5952, lng: 98.6722 },
      'Sumatera Barat': { lat: -0.9471, lng: 100.4172 },
      'Sumatera Selatan': { lat: -3.3194, lng: 103.9144 },
      'Sulawesi Selatan': { lat: -5.1477, lng: 119.4327 },
      'Papua': { lat: -4.2699, lng: 138.0804 }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-red-400 text-xl">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-8 h-8 text-sky-500" />
              <span className="text-2xl font-bold text-white">Raksha AI Dashboard</span>
            </div>
            <a href="/" className="text-gray-300 hover:text-white transition-colors">
              Back to Home
            </a>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 p-6 rounded-lg">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-sky-500" />
              <div>
                <p className="text-gray-400 text-sm">Total Reports</p>
                <p className="text-2xl font-bold text-white">{data?.total || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg">
            <div className="flex items-center gap-3">
              <MapPin className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-gray-400 text-sm">Regions</p>
                <p className="text-2xl font-bold text-white">{data?.aggregations.byRegion.length || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg">
            <div className="flex items-center gap-3">
              <HeartPulse className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-gray-400 text-sm">Emergency</p>
                <p className="text-2xl font-bold text-white">
                  {data?.aggregations.byRisk.find(r => r.riskLevel === 'EMERGENCY')?._count.riskLevel || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg">
            <div className="flex items-center gap-3">
              <Filter className="w-8 h-8 text-amber-500" />
              <div>
                <p className="text-gray-400 text-sm">Consult</p>
                <p className="text-2xl font-bold text-white">
                  {data?.aggregations.byRisk.find(r => r.riskLevel === 'CONSULT')?._count.riskLevel || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-900 p-6 rounded-lg mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-1">Region</label>
              <select
                value={filters.region}
                onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value }))}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              >
                <option value="">All Regions</option>
                {data?.aggregations.byRegion.map(item => (
                  <option key={item.region} value={item.region}>
                    {item.region}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm mb-1">Month</label>
              <select
                value={filters.month}
                onChange={(e) => setFilters(prev => ({ ...prev, month: e.target.value }))}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              >
                <option value="">All Months</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                  <option key={month} value={month}>
                    {new Date(2024, month - 1).toLocaleString('id-ID', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm mb-1">Risk Level</label>
              <select
                value={filters.risk}
                onChange={(e) => setFilters(prev => ({ ...prev, risk: e.target.value }))}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              >
                <option value="">All Risk Levels</option>
                <option value="EMERGENCY">Emergency</option>
                <option value="CONSULT">Consult</option>
                <option value="SELF_CARE">Self Care</option>
              </select>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="bg-gray-900 p-6 rounded-lg mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Heatmap Regional</h3>
          <MapHeat data={mapData} />
        </div>

        {/* Charts */}
        <Charts riskData={riskData} regionData={regionData} />

        {/* Recent Reports */}
        <div className="bg-gray-900 p-6 rounded-lg mt-8">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Reports</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-gray-300 py-2">Date</th>
                  <th className="text-left text-gray-300 py-2">Region</th>
                  <th className="text-left text-gray-300 py-2">Risk Level</th>
                  <th className="text-left text-gray-300 py-2">Month</th>
                </tr>
              </thead>
              <tbody>
                {data?.reports.slice(0, 10).map((report) => (
                  <tr key={report.id} className="border-b border-gray-800">
                    <td className="text-gray-300 py-2">
                      {new Date(report.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="text-gray-300 py-2">{report.region || '-'}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        report.riskLevel === 'EMERGENCY' ? 'bg-red-100 text-red-800' :
                        report.riskLevel === 'CONSULT' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {report.riskLevel}
                      </span>
                    </td>
                    <td className="text-gray-300 py-2">
                      {report.month ? new Date(2024, report.month - 1).toLocaleString('id-ID', { month: 'short' }) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
