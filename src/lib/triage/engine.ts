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
    'sesak napas': ['sesak', 'napas pendek', 'sulit bernapas', 'terengah-engah', 'susah nafas', 'napas berat', 'sesak nafas'],
    'pendarahan': ['berdarah', 'mimisan', 'darah', 'perdarahan', 'pendarahan hebat', 'mimisan hebat'],
    'nyeri dada': ['sakit dada', 'dada sakit', 'nyeri di dada', 'dada terasa sakit'],
    'pingsan': ['tidak sadar', 'hilang kesadaran', 'pingsan', 'collapsed'],
    'kejang': ['kejang-kejang', 'kram', 'spasme', 'kejang'],
    'sulit bicara': ['bicara tidak jelas', 'lidah kaku', 'sulit mengucap'],
    'lumpuh': ['tidak bisa bergerak', 'anggota tubuh lemah', 'paralysis']
  },
  // Consultation symptoms
  consult: {
    'demam tinggi': ['panas tinggi', 'demam', 'fever', 'panas badan'],
    'muntah terus': ['muntah berulang', 'muntah-muntah', 'muntah terus menerus', 'muntah berkepanjangan'],
    'ruam': ['bintik-bintik', 'kemerahan', 'gatal-gatal', 'eksim', 'bintik merah'],
    'sakit kepala parah': ['pusing berat', 'sakit kepala hebat', 'kepala sakit sekali'],
    'nyeri perut': ['sakit perut', 'perut sakit', 'kram perut', 'perut melilit'],
    'diare parah': ['mencret terus', 'diare berkepanjangan', 'buang air terus'],
    'sulit menelan': ['tidak bisa menelan', 'tenggorokan sakit', 'sulit makan'],
    'nyeri sendi': ['sendi sakit', 'persendian nyeri', 'rematik']
  },
  // Self-care symptoms
  selfcare: {
    'batuk': ['batuk-batuk', 'cough', 'batuk ringan'],
    'pilek': ['hidung tersumbat', 'ingusan', 'flu', 'hidung meler'],
    'sakit kepala ringan': ['pusing ringan', 'sakit kepala biasa', 'kepala pusing'],
    'lemas': ['tidak bertenaga', 'capek', 'lelah', 'tidak bersemangat'],
    'mual': ['mual-mual', 'mual ringan', 'perut mual'],
    'hidung tersumbat': ['pilek', 'hidung mampet', 'susah bernapas lewat hidung'],
    'sakit tenggorokan': ['tenggorokan sakit', 'radang tenggorokan ringan']
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

function findMatchingSymptoms(symptomsText: string): { category: string, symptoms: string[], matchedKeywords: string[] }[] {
  const normalized = normalizeText(symptomsText)
  const matches: { category: string, symptoms: string[], matchedKeywords: string[] }[] = []

  for (const [category, symptoms] of Object.entries(SYMPTOM_KEYWORDS)) {
    const foundSymptoms: string[] = []
    const matchedKeywords: string[] = []
    
    for (const [mainSymptom, aliases] of Object.entries(symptoms)) {
      const allVariants = [mainSymptom, ...aliases]
      const foundVariant = allVariants.find(variant => 
        normalized.includes(variant.toLowerCase())
      )
      
      if (foundVariant) {
        foundSymptoms.push(mainSymptom)
        matchedKeywords.push(foundVariant)
      }
    }
    
    if (foundSymptoms.length > 0) {
      matches.push({ category, symptoms: foundSymptoms, matchedKeywords })
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
  for (const { category, symptoms: foundSymptoms, matchedKeywords } of symptoms) {
    if (category === 'emergency') {
      riskLevel = "EMERGENCY"
      reasons.push(`Gejala darurat terdeteksi: ${foundSymptoms.join(', ')} (kata kunci: ${matchedKeywords.join(', ')})`)
      score = Math.max(score, 85)
    } else if (category === 'consult') {
      if (riskLevel === "SELF_CARE") {
        riskLevel = "CONSULT"
        reasons.push(`Gejala perlu konsultasi: ${foundSymptoms.join(', ')} (kata kunci: ${matchedKeywords.join(', ')})`)
        score = Math.max(score, 60)
      }
    } else if (category === 'selfcare') {
      if (riskLevel === "SELF_CARE") {
        reasons.push(`Gejala ringan: ${foundSymptoms.join(', ')} (kata kunci: ${matchedKeywords.join(', ')})`)
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
