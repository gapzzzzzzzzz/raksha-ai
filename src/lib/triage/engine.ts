export type TriageInput = {
  symptomsText: string
  age?: number
  tempC?: number
  daysFever?: number
  region?: string
  month?: number
  redFlags?: {
    chestPain?: boolean
    bleeding?: boolean
    sob?: boolean // shortness of breath
  }
}

export type TriageResult = {
  level: "EMERGENCY" | "CONSULT" | "SELF_CARE"
  score: number
  reasons: string[]
  microEducation: string[]
  seasonalContext?: string
}

// Indonesian symptom keywords with aliases
const SYMPTOM_KEYWORDS = {
  // Emergency symptoms
  emergency: {
    'sesak napas': ['sesak', 'napas pendek', 'sulit bernapas', 'terengah-engah'],
    'pendarahan': ['berdarah', 'mimisan', 'darah', 'perdarahan'],
    'nyeri dada': ['sakit dada', 'dada sakit', 'nyeri di dada'],
    'pingsan': ['tidak sadar', 'hilang kesadaran', 'pingsan'],
    'kejang': ['kejang-kejang', 'kram', 'spasme']
  },
  // Consultation symptoms
  consult: {
    'demam tinggi': ['panas tinggi', 'demam', 'fever'],
    'muntah terus': ['muntah berulang', 'muntah-muntah', 'muntah terus menerus'],
    'ruam': ['bintik-bintik', 'kemerahan', 'gatal-gatal', 'eksim'],
    'sakit kepala parah': ['pusing berat', 'sakit kepala hebat'],
    'nyeri perut': ['sakit perut', 'perut sakit', 'kram perut']
  },
  // Self-care symptoms
  selfcare: {
    'batuk': ['batuk-batuk', 'cough'],
    'pilek': ['hidung tersumbat', 'ingusan', 'flu'],
    'sakit kepala ringan': ['pusing ringan', 'sakit kepala biasa'],
    'lemas': ['tidak bertenaga', 'capek', 'lelah'],
    'mual': ['mual-mual', 'mual ringan']
  }
}

// Seasonal regions for DBD risk
const DBD_RISK_REGIONS = [
  'Jawa Timur', 'Jawa Barat', 'DKI Jakarta', 'Banten', 
  'Bali', 'NTB', 'NTT', 'Kaltim'
]

// DBD symptoms
const DBD_SYMPTOMS = ['demam', 'ruam', 'nyeri otot', 'mual']

// Micro-education content
const MICRO_EDUCATION = {
  EMERGENCY: [
    'Segera ke IGD atau rumah sakit terdekat',
    'Jangan tunda mencari pertolongan medis',
    'Pantau saturasi oksigen bila ada oximeter',
    'Hindari aktivitas berat',
    'Minum air putih secukupnya'
  ],
  CONSULT: [
    'Kunjungi Puskesmas atau dokter dalam 24 jam',
    'Minum air putih yang cukup (8-10 gelas/hari)',
    'Catat suhu tubuh 2 kali sehari',
    'Istirahat yang cukup',
    'Jika gejala memburuk, segera ke IGD'
  ],
  SELF_CARE: [
    'Istirahat yang cukup di rumah',
    'Minum air putih minimal 8 gelas/hari',
    'Konsumsi obat penurun panas sesuai dosis',
    'Makan makanan bergizi dan mudah dicerna',
    'Waspada jika gejala memburuk atau muncul gejala baru'
  ]
}

function normalizeText(text: string): string {
  return text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function findMatchingSymptoms(symptomsText: string): { category: string, symptoms: string[] }[] {
  const normalized = normalizeText(symptomsText)
  const matches: { category: string, symptoms: string[] }[] = []

  for (const [category, symptoms] of Object.entries(SYMPTOM_KEYWORDS)) {
    const foundSymptoms: string[] = []
    
    for (const [mainSymptom, aliases] of Object.entries(symptoms)) {
      const allVariants = [mainSymptom, ...aliases]
      const found = allVariants.some(variant => 
        normalized.includes(variant.toLowerCase())
      )
      
      if (found) {
        foundSymptoms.push(mainSymptom)
      }
    }
    
    if (foundSymptoms.length > 0) {
      matches.push({ category, symptoms: foundSymptoms })
    }
  }

  return matches
}

function getSeasonalContext(month?: number, region?: string): string | null {
  if (!month || !region) return null
  
  // Rainy season: December to March
  const isRainySeason = month >= 12 || month <= 3
  const isDBDRiskRegion = DBD_RISK_REGIONS.includes(region)
  
  if (isRainySeason && isDBDRiskRegion) {
    return `Prior musiman: risiko DBD meningkat di musim hujan (region: ${region})`
  }
  
  return null
}

function checkSeasonalPrior(input: TriageInput, symptoms: string[]): boolean {
  if (!input.month || !input.region) return false
  
  const isRainySeason = input.month >= 12 || input.month <= 3
  const isDBDRiskRegion = DBD_RISK_REGIONS.includes(input.region)
  const hasDBDSymptoms = DBD_SYMPTOMS.some(symptom => 
    symptoms.some(s => s.toLowerCase().includes(symptom))
  )
  
  return isRainySeason && isDBDRiskRegion && hasDBDSymptoms
}

export function performTriage(input: TriageInput): TriageResult {
  const reasons: string[] = []
  const symptoms = findMatchingSymptoms(input.symptomsText)
  let riskLevel: "EMERGENCY" | "CONSULT" | "SELF_CARE" = "SELF_CARE"
  let score = 0

  // Check red flags first (highest priority)
  if (input.redFlags) {
    if (input.redFlags.chestPain) {
      riskLevel = "EMERGENCY"
      reasons.push("Nyeri dada - gejala serius")
      score = 90
    }
    
    if (input.redFlags.bleeding) {
      riskLevel = "EMERGENCY"
      reasons.push("Pendarahan - perlu penanganan segera")
      score = 95
    }
    
    if (input.redFlags.sob) {
      riskLevel = "EMERGENCY"
      reasons.push("Sesak napas - gejala darurat")
      score = 90
    }
  }

  // Check temperature and fever duration
  if (input.tempC && input.daysFever) {
    if (input.tempC >= 39.5 && input.redFlags?.sob) {
      riskLevel = "EMERGENCY"
      reasons.push(`Demam tinggi (${input.tempC}°C) dengan sesak napas`)
      score = 95
    } else if (input.tempC >= 38 && input.tempC < 39.5 && input.daysFever >= 2) {
      if (riskLevel === "SELF_CARE") {
        riskLevel = "CONSULT"
        reasons.push(`Demam ${input.tempC}°C selama ${input.daysFever} hari`)
        score = 60
      }
    }
  }

  // Check age-based risk
  if (input.age !== undefined) {
    if (input.age < 2 || input.age > 65) {
      if (input.tempC && input.tempC >= 38) {
        if (riskLevel === "SELF_CARE") {
          riskLevel = "CONSULT"
          reasons.push(`Demam pada ${input.age < 2 ? 'bayi' : 'lansia'} - perlu konsultasi`)
          score = 70
        }
      }
    }
  }

  // Check symptom-based risk
  for (const { category, symptoms: foundSymptoms } of symptoms) {
    if (category === 'emergency') {
      riskLevel = "EMERGENCY"
      reasons.push(`Gejala darurat: ${foundSymptoms.join(', ')}`)
      score = Math.max(score, 85)
    } else if (category === 'consult') {
      if (riskLevel === "SELF_CARE") {
        riskLevel = "CONSULT"
        reasons.push(`Gejala perlu konsultasi: ${foundSymptoms.join(', ')}`)
        score = Math.max(score, 60)
      }
    } else if (category === 'selfcare') {
      if (riskLevel === "SELF_CARE") {
        reasons.push(`Gejala ringan: ${foundSymptoms.join(', ')}`)
        score = Math.max(score, 30)
      }
    }
  }

  // Apply seasonal prior
  const seasonalContext = getSeasonalContext(input.month, input.region)
  if (seasonalContext && checkSeasonalPrior(input, input.symptomsText.split(' '))) {
    if (riskLevel === "SELF_CARE") {
      riskLevel = "CONSULT"
      score = 65
    }
    reasons.push(seasonalContext)
  }

  // Default score if no specific reasons
  if (score === 0) {
    score = riskLevel === "EMERGENCY" ? 90 : riskLevel === "CONSULT" ? 60 : 30
  }

  return {
    level: riskLevel,
    score: Math.min(score, 100),
    reasons,
    microEducation: MICRO_EDUCATION[riskLevel],
    seasonalContext: seasonalContext || undefined
  }
}
