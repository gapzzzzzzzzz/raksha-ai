// Comprehensive medical ontology for Raksha AI triage system

export interface RedFlagGroup {
  id: string
  name: string
  aliases: string[]
  severity: 'EMERGENCY' | 'CONSULT'
}

export interface ConditionCanon {
  id: string
  name: string
  category: 'respiratory' | 'gastrointestinal' | 'neurological' | 'urinary' | 'infectious' | 'cardiovascular' | 'dermatological'
  keywords: string[]
  seasonal?: boolean
}

export interface AliasMap {
  [key: string]: string // alias -> canonical term
}

// Red flags with Indonesian aliases
export const RED_FLAGS: RedFlagGroup[] = [
  {
    id: 'chestPain',
    name: 'Nyeri Dada',
    severity: 'EMERGENCY',
    aliases: [
      'nyeri dada', 'sakit dada', 'dada sakit', 'nyeri di dada', 'dada terasa sakit',
      'nyeri pada dada', 'sakit pada dada', 'dada nyeri', 'chest pain'
    ]
  },
  {
    id: 'bleeding',
    name: 'Pendarahan',
    severity: 'EMERGENCY',
    aliases: [
      'berdarah', 'mimisan', 'darah', 'perdarahan', 'pendarahan hebat', 'mimisan hebat',
      'keluar darah', 'darah keluar', 'pendarahan aktif', 'bleeding'
    ]
  },
  {
    id: 'sob',
    name: 'Sesak Napas',
    severity: 'EMERGENCY',
    aliases: [
      'sesak napas', 'sesak', 'napas pendek', 'sulit bernapas', 'terengah-engah', 'susah nafas',
      'napas berat', 'sesak nafas', 'sulit nafas', 'napas tersengal', 'shortness of breath'
    ]
  },
  {
    id: 'neuro',
    name: 'Gejala Neurologis',
    severity: 'EMERGENCY',
    aliases: [
      'pingsan', 'tidak sadar', 'hilang kesadaran', 'collapsed', 'kejang', 'kejang-kejang',
      'kram', 'spasme', 'sulit bicara', 'bicara tidak jelas', 'lidah kaku', 'sulit mengucap',
      'lumpuh', 'tidak bisa bergerak', 'anggota tubuh lemah', 'paralysis', 'stroke'
    ]
  }
]

// Comprehensive alias mapping for symptom normalization
export const ALIASES: AliasMap = {
  // Gastrointestinal
  'mencret': 'diare',
  'mencret-mencret': 'diare',
  'buang air besar cair': 'diare',
  'bab cair': 'diare',
  'diare': 'diare',
  'muntah': 'muntah',
  'muntah-muntah': 'muntah',
  'mual': 'mual',
  'mual-mual': 'mual',
  'perut sakit': 'nyeri perut',
  'sakit perut': 'nyeri perut',
  'perut melilit': 'nyeri perut',
  'kram perut': 'nyeri perut',
  'maag': 'gastritis',
  'sakit maag': 'gastritis',
  'lambung sakit': 'gastritis',
  
  // Respiratory
  'batuk': 'batuk',
  'batuk-batuk': 'batuk',
  'cough': 'batuk',
  'pilek': 'pilek',
  'hidung tersumbat': 'pilek',
  'ingusan': 'pilek',
  'hidung meler': 'pilek',
  'flu': 'pilek',
  'sesak napas': 'sesak napas',
  'susah nafas': 'sesak napas',
  'napas berat': 'sesak napas',
  'terengah-engah': 'sesak napas',
  'sesak nafas': 'sesak napas',
  'sulit bernapas': 'sesak napas',
  'napas pendek': 'sesak napas',
  'napas tersengal': 'sesak napas',
  
  // Fever and temperature
  'demam': 'demam',
  'panas': 'demam',
  'panas badan': 'demam',
  'fever': 'demam',
  'panas tinggi': 'demam tinggi',
  'demam tinggi': 'demam tinggi',
  
  // Neurological
  'pusing': 'sakit kepala',
  'pusing-pusing': 'sakit kepala',
  'kepala sakit': 'sakit kepala',
  'sakit kepala': 'sakit kepala',
  'migrain': 'migrain',
  'migraine': 'migrain',
  'pingsan': 'pingsan',
  'tidak sadar': 'pingsan',
  'hilang kesadaran': 'pingsan',
  'collapsed': 'pingsan',
  'kejang': 'kejang',
  'kejang-kejang': 'kejang',
  'kram': 'kejang',
  'spasme': 'kejang',
  
  // Urinary
  'kencing sakit': 'nyeri saat kencing',
  'sakit kencing': 'nyeri saat kencing',
  'nyeri saat kencing': 'nyeri saat kencing',
  'sering kencing': 'sering kencing',
  'kencing sering': 'sering kencing',
  'anyang-anyangan': 'sering kencing',
  'urine keruh': 'urine keruh',
  'air kencing keruh': 'urine keruh',
  
  // Dermatological
  'ruam': 'ruam',
  'bintik-bintik': 'ruam',
  'kemerahan': 'ruam',
  'gatal-gatal': 'ruam',
  'eksim': 'ruam',
  'bintik merah': 'ruam',
  'kulit merah': 'ruam',
  
  // General symptoms
  'lemas': 'lemas',
  'tidak bertenaga': 'lemas',
  'capek': 'lemas',
  'lelah': 'lemas',
  'tidak bersemangat': 'lemas',
  'nyeri otot': 'nyeri otot',
  'sakit otot': 'nyeri otot',
  'pegal-pegal': 'nyeri otot',
  'sendi sakit': 'nyeri sendi',
  'persendian nyeri': 'nyeri sendi',
  'rematik': 'nyeri sendi'
}

// Canonical conditions with categories and keywords
export const CONDITION_CANON: ConditionCanon[] = [
  {
    id: 'ispa_flu_covid',
    name: 'ISPA/Flu/COVID-like',
    category: 'respiratory',
    keywords: ['demam', 'batuk', 'pilek', 'sakit kepala', 'lemas', 'nyeri otot', 'sesak napas'],
    seasonal: true
  },
  {
    id: 'dbd_dengue',
    name: 'DBD/Dengue',
    category: 'infectious',
    keywords: ['demam', 'ruam', 'nyeri otot', 'mual', 'sakit kepala', 'lemas'],
    seasonal: true
  },
  {
    id: 'gastroenteritis',
    name: 'Gastroenteritis/Diare Infeksi',
    category: 'gastrointestinal',
    keywords: ['diare', 'muntah', 'mual', 'nyeri perut', 'demam', 'lemas']
  },
  {
    id: 'dehidrasi',
    name: 'Dehidrasi',
    category: 'gastrointestinal',
    keywords: ['diare', 'muntah', 'lemas', 'pusing', 'tidak bisa minum']
  },
  {
    id: 'isk',
    name: 'Infeksi Saluran Kemih (ISK)',
    category: 'urinary',
    keywords: ['nyeri saat kencing', 'sering kencing', 'urine keruh', 'demam', 'nyeri perut bawah']
  },
  {
    id: 'gastritis',
    name: 'Gastritis/Maag',
    category: 'gastrointestinal',
    keywords: ['mual', 'nyeri perut', 'maag', 'gastritis', 'perut kembung']
  },
  {
    id: 'appendicitis',
    name: 'Appendicitis (curiga)',
    category: 'gastrointestinal',
    keywords: ['nyeri perut kanan bawah', 'mual', 'muntah', 'demam', 'tidak nafsu makan']
  },
  {
    id: 'migrain',
    name: 'Migraine/Sakit Kepala Primer',
    category: 'neurological',
    keywords: ['sakit kepala', 'pusing', 'migrain', 'mual', 'fotofobia']
  },
  {
    id: 'alergi_urti',
    name: 'Alergi/URTI ringan',
    category: 'respiratory',
    keywords: ['pilek', 'batuk', 'bersin', 'gatal mata', 'hidung tersumbat']
  },
  {
    id: 'asma_eksaserbasi',
    name: 'Asma eksaserbasi',
    category: 'respiratory',
    keywords: ['sesak napas', 'batuk', 'mengi', 'dada sesak']
  }
]

// Seasonal configuration
export const SEASONAL_CONFIG = {
  RAINY_MONTHS: [12, 1, 2, 3], // December to March
  DBD_REGIONS: [
    'Jawa Timur', 'Jawa Barat', 'DKI Jakarta', 'Banten', 
    'Bali', 'NTB', 'NTT', 'Kalimantan Timur'
  ],
  DBD_SYMPTOMS: ['demam', 'ruam', 'nyeri otot', 'mual', 'sakit kepala']
}

// Utility functions
export function normalizeSymptom(symptom: string): string {
  const normalized = symptom.toLowerCase().trim()
  return ALIASES[normalized] || normalized
}

export function detectRedFlags(text: string): { [key: string]: boolean } {
  const normalizedText = text.toLowerCase()
  const detected: { [key: string]: boolean } = {}
  
  RED_FLAGS.forEach(flag => {
    detected[flag.id] = flag.aliases.some(alias => 
      normalizedText.includes(alias.toLowerCase())
    )
  })
  
  return detected
}

export function extractKeywords(text: string): string[] {
  const foundKeywords: string[] = []
  
  // Check for exact matches in aliases
  Object.keys(ALIASES).forEach(alias => {
    if (text.toLowerCase().includes(alias.toLowerCase())) {
      foundKeywords.push(alias)
    }
  })
  
  // Check for canonical terms
  CONDITION_CANON.forEach(condition => {
    condition.keywords.forEach(keyword => {
      if (text.toLowerCase().includes(keyword.toLowerCase())) {
        foundKeywords.push(keyword)
      }
    })
  })
  
  return [...new Set(foundKeywords)] // Remove duplicates
}

export function getSeasonalContext(month?: number, region?: string): string | null {
  if (!month || !region) return null
  
  const isRainySeason = SEASONAL_CONFIG.RAINY_MONTHS.includes(month)
  const isDBDRegion = SEASONAL_CONFIG.DBD_REGIONS.includes(region)
  
  if (isRainySeason && isDBDRegion) {
    return `Prior musiman: risiko DBD meningkat di musim hujan (region: ${region})`
  }
  
  return null
}

export function shouldApplySeasonalPrior(
  month?: number, 
  region?: string, 
  symptoms: string[] = []
): boolean {
  if (!month || !region) return false
  
  const isRainySeason = SEASONAL_CONFIG.RAINY_MONTHS.includes(month)
  const isDBDRegion = SEASONAL_CONFIG.DBD_REGIONS.includes(region)
  const hasDBDSymptoms = SEASONAL_CONFIG.DBD_SYMPTOMS.some(symptom => 
    symptoms.some(s => s.toLowerCase().includes(symptom))
  )
  
  return isRainySeason && isDBDRegion && hasDBDSymptoms
}
