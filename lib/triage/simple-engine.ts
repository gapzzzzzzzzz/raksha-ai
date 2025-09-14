import { TriageInput, TriageResult } from './schema'

// Simple deterministic triage engine as fallback
export function simpleTriage(input: TriageInput): TriageResult {
  const symptoms = input.symptomsText.toLowerCase()
  let score = 0
  const reasons: string[] = []
  const microEducation: string[] = []

  // Emergency symptoms (score 80-100)
  if (symptoms.includes('sesak') || symptoms.includes('napas') || symptoms.includes('breathing')) {
    score = 95
    reasons.push('Gejala sesak napas memerlukan penanganan darurat')
    microEducation.push('Segera ke IGD terdekat atau hubungi 118/119')
    microEducation.push('Jangan menunggu, sesak napas bisa berbahaya')
    return {
      level: 'EMERGENCY',
      score,
      reasons,
      microEducation,
      seasonalContext: getSeasonalContext(input),
      topConditions: ['Respiratory Emergency'],
      differentialDiagnosis: ['Acute respiratory distress', 'Pneumonia', 'Asthma attack']
    }
  }

  if (symptoms.includes('pendarahan') || symptoms.includes('berdarah') || symptoms.includes('bleeding')) {
    score = 90
    reasons.push('Pendarahan memerlukan evaluasi medis segera')
    microEducation.push('Tekan area yang berdarah dengan kain bersih')
    microEducation.push('Segera ke IGD jika pendarahan tidak berhenti')
    return {
      level: 'EMERGENCY',
      score,
      reasons,
      microEducation,
      seasonalContext: getSeasonalContext(input),
      topConditions: ['Bleeding'],
      differentialDiagnosis: ['Trauma', 'Internal bleeding', 'Hemorrhage']
    }
  }

  if (symptoms.includes('nyeri dada') || symptoms.includes('sakit dada') || symptoms.includes('chest pain')) {
    score = 88
    reasons.push('Nyeri dada memerlukan evaluasi medis segera')
    microEducation.push('Hindari aktivitas berat')
    microEducation.push('Segera ke IGD untuk pemeriksaan jantung')
    return {
      level: 'EMERGENCY',
      score,
      reasons,
      microEducation,
      seasonalContext: getSeasonalContext(input),
      topConditions: ['Chest Pain'],
      differentialDiagnosis: ['Heart attack', 'Angina', 'Pulmonary embolism']
    }
  }

  // High fever (score 70-85)
  if (input.tempC && input.tempC >= 39) {
    score = 80
    reasons.push(`Demam tinggi ${input.tempC}°C memerlukan perhatian medis`)
    microEducation.push('Minum banyak air putih')
    microEducation.push('Kompres dengan air hangat')
    microEducation.push('Konsultasi dokter dalam 24 jam')
    
    if (input.daysFever && input.daysFever >= 3) {
      score = 85
      reasons.push('Demam berlangsung lebih dari 3 hari')
      microEducation.push('Segera konsultasi dokter')
    }
  }

  // Moderate symptoms (score 40-70)
  if (symptoms.includes('demam') && input.tempC && input.tempC >= 37.5 && input.tempC < 39) {
    score = 60
    reasons.push(`Demam ringan ${input.tempC}°C`)
    microEducation.push('Istirahat yang cukup')
    microEducation.push('Minum air putih yang banyak')
    microEducation.push('Monitor suhu tubuh')
  }

  if (symptoms.includes('batuk') || symptoms.includes('cough')) {
    score = Math.max(score, 50)
    reasons.push('Gejala batuk terdeteksi')
    microEducation.push('Hindari makanan pedas dan dingin')
    microEducation.push('Minum air hangat dengan madu')
  }

  if (symptoms.includes('mual') || symptoms.includes('nausea')) {
    score = Math.max(score, 45)
    reasons.push('Gejala mual terdeteksi')
    microEducation.push('Makan dalam porsi kecil')
    microEducation.push('Hindari makanan berlemak')
  }

  // Age factor
  if (input.age) {
    if (input.age < 2) {
      score += 15
      reasons.push('Usia bayi memerlukan perhatian khusus')
    } else if (input.age > 65) {
      score += 10
      reasons.push('Usia lanjut memerlukan perhatian khusus')
    }
  }

  // Seasonal context
  const seasonal = getSeasonalContext(input)
  if (seasonal) {
    if (seasonal.includes('DBD') || seasonal.includes('dengue')) {
      score += 20
      reasons.push('Risiko DBD di musim hujan')
      microEducation.push('Gunakan lotion anti nyamuk')
      microEducation.push('Bersihkan genangan air di sekitar rumah')
    }
  }

  // Determine level
  let level: 'EMERGENCY' | 'CONSULT' | 'SELF_CARE'
  if (score >= 80) {
    level = 'EMERGENCY'
  } else if (score >= 50) {
    level = 'CONSULT'
  } else {
    level = 'SELF_CARE'
  }

  // Add general micro-education based on level
  if (level === 'CONSULT') {
    microEducation.push('Konsultasi dokter dalam 24-48 jam')
    microEducation.push('Monitor gejala dan catat perkembangannya')
  } else if (level === 'SELF_CARE') {
    microEducation.push('Istirahat yang cukup')
    microEducation.push('Minum air putih yang banyak')
    microEducation.push('Konsultasi dokter jika gejala memburuk')
  }

  return {
    level,
    score: Math.min(score, 100),
    reasons,
    microEducation,
    seasonalContext: seasonal,
    topConditions: getTopConditions(symptoms),
    differentialDiagnosis: getDifferentialDiagnosis(symptoms)
  }
}

function getSeasonalContext(input: TriageInput): string | undefined {
  if (!input.region || !input.month) return undefined
  
  const month = input.month
  const region = input.region.toLowerCase()
  
  // Rainy season (October-March) - DBD risk
  if (month >= 10 || month <= 3) {
    if (region.includes('jakarta') || region.includes('jawa') || region.includes('bali')) {
      return 'Musim hujan di Indonesia - waspada risiko DBD. Gunakan lotion anti nyamuk dan bersihkan genangan air.'
    }
  }
  
  // Dry season (April-September) - respiratory issues
  if (month >= 4 && month <= 9) {
    return 'Musim kemarau - waspada polusi udara dan dehidrasi. Minum air putih yang cukup.'
  }
  
  return undefined
}

function getTopConditions(symptoms: string): string[] {
  const conditions: string[] = []
  
  if (symptoms.includes('demam')) conditions.push('Fever')
  if (symptoms.includes('batuk')) conditions.push('Cough')
  if (symptoms.includes('mual')) conditions.push('Nausea')
  if (symptoms.includes('pusing')) conditions.push('Dizziness')
  if (symptoms.includes('lemas')) conditions.push('Weakness')
  if (symptoms.includes('ruam')) conditions.push('Rash')
  
  return conditions.length > 0 ? conditions : ['General symptoms']
}

function getDifferentialDiagnosis(symptoms: string): string[] {
  const diagnosis: string[] = []
  
  if (symptoms.includes('demam') && symptoms.includes('batuk')) {
    diagnosis.push('Upper respiratory infection', 'Flu', 'Common cold')
  }
  
  if (symptoms.includes('demam') && symptoms.includes('ruam')) {
    diagnosis.push('Viral infection', 'Allergic reaction', 'Dengue fever')
  }
  
  if (symptoms.includes('mual') && symptoms.includes('muntah')) {
    diagnosis.push('Gastroenteritis', 'Food poisoning', 'Stomach flu')
  }
  
  return diagnosis.length > 0 ? diagnosis : ['Symptomatic evaluation needed']
}
