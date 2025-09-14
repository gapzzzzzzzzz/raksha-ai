export function getSeasonFromMonth(month: number): string {
  if (month >= 12 || month <= 2) {
    return 'musim hujan'
  } else if (month >= 3 && month <= 5) {
    return 'musim kemarau'
  } else if (month >= 6 && month <= 8) {
    return 'musim kemarau'
  } else {
    return 'musim peralihan'
  }
}

export function getCurrentMonth(): number {
  return new Date().getMonth() + 1
}

export function isRainySeason(month: number): boolean {
  return month >= 12 || month <= 3
}

export function getSeasonalRiskLevel(month: number, region: string): 'low' | 'medium' | 'high' {
  const isRainy = isRainySeason(month)
  const isDBDRiskRegion = [
    'Jawa Timur', 'Jawa Barat', 'DKI Jakarta', 'Banten', 
    'Bali', 'NTB', 'NTT', 'Kaltim'
  ].includes(region)

  if (isRainy && isDBDRiskRegion) {
    return 'high'
  } else if (isRainy || isDBDRiskRegion) {
    return 'medium'
  }
  
  return 'low'
}
