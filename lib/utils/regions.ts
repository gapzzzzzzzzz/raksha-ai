export const INDONESIAN_PROVINCES = [
  'Aceh',
  'Sumatera Utara',
  'Sumatera Barat',
  'Riau',
  'Kepulauan Riau',
  'Jambi',
  'Sumatera Selatan',
  'Bangka Belitung',
  'Bengkulu',
  'Lampung',
  'DKI Jakarta',
  'Jawa Barat',
  'Banten',
  'Jawa Tengah',
  'DI Yogyakarta',
  'Jawa Timur',
  'Bali',
  'Nusa Tenggara Barat',
  'Nusa Tenggara Timur',
  'Kalimantan Barat',
  'Kalimantan Tengah',
  'Kalimantan Selatan',
  'Kalimantan Timur',
  'Kalimantan Utara',
  'Sulawesi Utara',
  'Sulawesi Tengah',
  'Sulawesi Selatan',
  'Sulawesi Tenggara',
  'Gorontalo',
  'Sulawesi Barat',
  'Maluku',
  'Maluku Utara',
  'Papua',
  'Papua Barat',
  'Papua Selatan',
  'Papua Tengah',
  'Papua Pegunungan'
] as const

export const DBD_HIGH_RISK_REGIONS = [
  'Jawa Timur',
  'Jawa Barat', 
  'DKI Jakarta',
  'Banten',
  'Bali',
  'Nusa Tenggara Barat',
  'Nusa Tenggara Timur',
  'Kalimantan Timur'
] as const

export function isDBDRiskRegion(region: string): boolean {
  return DBD_HIGH_RISK_REGIONS.includes(region as any)
}

export function getRegionCoordinates(region: string): { lat: number; lng: number } | null {
  // Simplified coordinates for major regions
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
  
  return coordinates[region] || null
}
