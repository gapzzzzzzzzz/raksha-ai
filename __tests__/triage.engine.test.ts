import { describe, it, expect, vi, beforeEach } from 'vitest'
import { triageHybrid } from '@/lib/triage/gemini'
import { validateTriageInput, type TriageInput } from '@/lib/triage/schema'
import { detectRedFlags, extractKeywords, shouldApplySeasonalPrior } from '@/lib/triage/ontology'

// Mock the Google Generative AI
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: vi.fn().mockReturnValue({
      generateContent: vi.fn()
    })
  }))
}))

// Mock environment variables
vi.mock('process', () => ({
  env: {
    GOOGLE_GENERATIVE_AI_API_KEY: 'test-api-key',
    GEMINI_MODEL: 'gemini-1.5-pro'
  }
}))

describe('Triage Engine', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Input Validation', () => {
    it('should validate valid triage input', () => {
      const validInput = {
        symptomsText: 'demam tinggi, sakit kepala',
        age: 25,
        tempC: 38.5,
        daysFever: 2,
        region: 'Jakarta',
        month: 1
      }

      expect(() => validateTriageInput(validInput)).not.toThrow()
    })

    it('should reject invalid age', () => {
      const invalidInput = {
        symptomsText: 'demam',
        age: -5
      }

      expect(() => validateTriageInput(invalidInput)).toThrow()
    })

    it('should reject invalid temperature', () => {
      const invalidInput = {
        symptomsText: 'demam',
        tempC: 50
      }

      expect(() => validateTriageInput(invalidInput)).toThrow()
    })

    it('should reject empty symptoms text', () => {
      const invalidInput = {
        symptomsText: ''
      }

      expect(() => validateTriageInput(invalidInput)).toThrow()
    })

    it('should reject symptoms text that is too long', () => {
      const invalidInput = {
        symptomsText: 'a'.repeat(2001)
      }

      expect(() => validateTriageInput(invalidInput)).toThrow()
    })
  })

  describe('Red Flag Detection', () => {
    it('should detect chest pain red flag', () => {
      const text = 'nyeri dada yang sangat sakit'
      const redFlags = detectRedFlags(text)
      
      expect(redFlags.chestPain).toBe(true)
      expect(redFlags.bleeding).toBe(false)
      expect(redFlags.sob).toBe(false)
      expect(redFlags.neuro).toBe(false)
    })

    it('should detect bleeding red flag', () => {
      const text = 'mimisan hebat dan berdarah'
      const redFlags = detectRedFlags(text)
      
      expect(redFlags.bleeding).toBe(true)
    })

    it('should detect shortness of breath red flag', () => {
      const text = 'sesak napas dan terengah-engah'
      const redFlags = detectRedFlags(text)
      
      expect(redFlags.sob).toBe(true)
    })

    it('should detect neurological red flag', () => {
      const text = 'pingsan dan kejang-kejang'
      const redFlags = detectRedFlags(text)
      
      expect(redFlags.neuro).toBe(true)
    })

    it('should detect multiple red flags', () => {
      const text = 'nyeri dada, sesak napas, dan berdarah'
      const redFlags = detectRedFlags(text)
      
      expect(redFlags.chestPain).toBe(true)
      expect(redFlags.sob).toBe(true)
      expect(redFlags.bleeding).toBe(true)
    })
  })

  describe('Keyword Extraction', () => {
    it('should extract keywords from symptoms text', () => {
      const text = 'mencret 7x/hari, mual, lemas, tidak demam'
      const keywords = extractKeywords(text)
      
      expect(keywords).toContain('mencret')
      expect(keywords).toContain('mual')
      expect(keywords).toContain('lemas')
      expect(keywords).toContain('demam')
    })

    it('should handle aliases correctly', () => {
      const text = 'susah nafas dan sakit dada'
      const keywords = extractKeywords(text)
      
      expect(keywords).toContain('susah nafas')
      expect(keywords).toContain('sakit dada')
    })
  })

  describe('Seasonal Prior Application', () => {
    it('should apply seasonal prior for DBD in rainy season', () => {
      const month = 2 // February (rainy season)
      const region = 'Jawa Timur'
      const symptoms = ['demam', 'ruam', 'nyeri otot']
      
      const shouldApply = shouldApplySeasonalPrior(month, region, symptoms)
      expect(shouldApply).toBe(true)
    })

    it('should not apply seasonal prior in dry season', () => {
      const month = 7 // July (dry season)
      const region = 'Jawa Timur'
      const symptoms = ['demam', 'ruam']
      
      const shouldApply = shouldApplySeasonalPrior(month, region, symptoms)
      expect(shouldApply).toBe(false)
    })

    it('should not apply seasonal prior in non-DBD regions', () => {
      const month = 2 // February (rainy season)
      const region = 'Papua' // Not in DBD regions
      const symptoms = ['demam', 'ruam']
      
      const shouldApply = shouldApplySeasonalPrior(month, region, symptoms)
      expect(shouldApply).toBe(false)
    })
  })

  describe('Triage Engine Integration', () => {
    it('should handle GI case without fever', async () => {
      // Mock Gemini response for GI case
      const mockGeminiResponse = {
        symptoms: ['diare', 'mual', 'lemas'],
        metadata: {
          age: 22,
          tempC: null,
          daysFever: null,
          diarrheaFreqPerDay: 7,
          vomitFreqPerDay: null,
          painLocation: null,
          redFlags: { chestPain: false, bleeding: false, sob: false, neuro: false }
        },
        differential: [
          { condition: 'Gastroenteritis/Diare Infeksi', likelihood: 0.8, why: 'Diare frekuensi tinggi dengan mual dan lemas' },
          { condition: 'Dehidrasi', likelihood: 0.7, why: 'Diare 7x/hari berisiko dehidrasi' }
        ],
        matchedKeywords: ['mencret', 'mual', 'lemas', 'tidak demam', 'umur 22'],
        initialLevel: 'CONSULT' as const,
        initialReasons: ['Diare frekuensi tinggi (7x/hari)', 'Gejala dehidrasi (lemas)'],
        reasoning: 'Diare dengan frekuensi tinggi dan gejala dehidrasi memerlukan konsultasi medis untuk evaluasi dan rehidrasi yang tepat.'
      }

      // Mock the Gemini model
      const { GoogleGenerativeAI } = await import('@google/generative-ai')
      const mockModel = {
        generateContent: vi.fn().mockResolvedValue({
          response: {
            text: () => JSON.stringify(mockGeminiResponse)
          }
        })
      }
      
      const mockGenAI = {
        getGenerativeModel: vi.fn().mockReturnValue(mockModel)
      }
      
      vi.mocked(GoogleGenerativeAI).mockImplementation(() => mockGenAI as any)

      const input: TriageInput = {
        symptomsText: 'mencret 7x/hari, mual, lemas, tidak demam, umur 22',
        diarrheaFreqPerDay: 7
      }

      const result = await triageHybrid(input)

      expect(result.level).toBe('CONSULT')
      expect(result.score).toBeGreaterThanOrEqual(65)
      expect(result.topConditions).toContainEqual(
        expect.objectContaining({ condition: 'Gastroenteritis/Diare Infeksi' })
      )
      expect(result.matchedKeywords).toContain('mencret')
      expect(result.matchedKeywords).toContain('mual')
      expect(result.matchedKeywords).toContain('lemas')
    })

    it('should handle DBD seasonal case', async () => {
      const mockGeminiResponse = {
        symptoms: ['demam', 'ruam', 'nyeri otot'],
        metadata: {
          age: null,
          tempC: 38.4,
          daysFever: 2,
          diarrheaFreqPerDay: null,
          vomitFreqPerDay: null,
          painLocation: null,
          redFlags: { chestPain: false, bleeding: false, sob: false, neuro: false }
        },
        differential: [
          { condition: 'DBD/Dengue', likelihood: 0.6, why: 'Demam dengan ruam dan nyeri otot di musim hujan' },
          { condition: 'ISPA/Flu/COVID-like', likelihood: 0.4, why: 'Demam dengan gejala sistemik' }
        ],
        matchedKeywords: ['demam 38.4', 'ruam', 'nyeri otot', 'Jawa Timur', 'Februari'],
        initialLevel: 'CONSULT' as const,
        initialReasons: ['Demam dengan ruam dan nyeri otot'],
        reasoning: 'Kombinasi demam, ruam, dan nyeri otot di musim hujan meningkatkan kecurigaan DBD.'
      }

      const { GoogleGenerativeAI } = await import('@google/generative-ai')
      const mockModel = {
        generateContent: vi.fn().mockResolvedValue({
          response: {
            text: () => JSON.stringify(mockGeminiResponse)
          }
        })
      }
      
      const mockGenAI = {
        getGenerativeModel: vi.fn().mockReturnValue(mockModel)
      }
      
      vi.mocked(GoogleGenerativeAI).mockImplementation(() => mockGenAI as any)

      const input: TriageInput = {
        symptomsText: 'demam 38.4 dua hari, ruam, nyeri otot; Jawa Timur; Februari',
        tempC: 38.4,
        daysFever: 2,
        region: 'Jawa Timur',
        month: 2
      }

      const result = await triageHybrid(input)

      expect(result.level).toBe('CONSULT')
      expect(result.seasonalContext).toContain('risiko DBD meningkat di musim hujan')
      expect(result.topConditions).toContainEqual(
        expect.objectContaining({ condition: 'DBD/Dengue' })
      )
    })

    it('should handle red flags case', async () => {
      const mockGeminiResponse = {
        symptoms: ['nyeri dada', 'sesak napas', 'demam tinggi'],
        metadata: {
          age: null,
          tempC: 39.6,
          daysFever: null,
          diarrheaFreqPerDay: null,
          vomitFreqPerDay: null,
          painLocation: 'dada',
          redFlags: { chestPain: true, bleeding: false, sob: true, neuro: false }
        },
        differential: [
          { condition: 'ISPA/Flu/COVID-like', likelihood: 0.6, why: 'Demam tinggi dengan gejala pernapasan' },
          { condition: 'Asma eksaserbasi', likelihood: 0.4, why: 'Sesak napas dengan nyeri dada' }
        ],
        matchedKeywords: ['nyeri dada', 'sesak napas', 'suhu 39.6'],
        initialLevel: 'EMERGENCY' as const,
        initialReasons: ['Nyeri dada - gejala serius', 'Sesak napas - gejala darurat', 'Demam tinggi (39.6°C)'],
        reasoning: 'Kombinasi nyeri dada, sesak napas, dan demam tinggi merupakan gejala darurat yang memerlukan penanganan segera di IGD.'
      }

      const { GoogleGenerativeAI } = await import('@google/generative-ai')
      const mockModel = {
        generateContent: vi.fn().mockResolvedValue({
          response: {
            text: () => JSON.stringify(mockGeminiResponse)
          }
        })
      }
      
      const mockGenAI = {
        getGenerativeModel: vi.fn().mockReturnValue(mockModel)
      }
      
      vi.mocked(GoogleGenerativeAI).mockImplementation(() => mockGenAI as any)

      const input: TriageInput = {
        symptomsText: 'nyeri dada, sesak napas, suhu 39.6',
        tempC: 39.6,
        redFlags: { chestPain: true, sob: true }
      }

      const result = await triageHybrid(input)

      expect(result.level).toBe('EMERGENCY')
      expect(result.score).toBeGreaterThanOrEqual(92)
      expect(result.reasons).toContain('Nyeri dada - gejala serius')
      expect(result.reasons).toContain('Sesak napas - gejala darurat')
    })

    it('should handle ISK case', async () => {
      const mockGeminiResponse = {
        symptoms: ['nyeri saat kencing', 'sering kencing', 'urine keruh'],
        metadata: {
          age: null,
          tempC: null,
          daysFever: null,
          diarrheaFreqPerDay: null,
          vomitFreqPerDay: null,
          painLocation: 'perut bawah',
          redFlags: { chestPain: false, bleeding: false, sob: false, neuro: false }
        },
        differential: [
          { condition: 'Infeksi Saluran Kemih (ISK)', likelihood: 0.8, why: 'Gejala klasik ISK dengan nyeri saat kencing dan urine keruh' },
          { condition: 'Gastritis/Maag', likelihood: 0.2, why: 'Nyeri perut bawah ringan' }
        ],
        matchedKeywords: ['nyeri saat kencing', 'sering kencing', 'urine keruh'],
        initialLevel: 'CONSULT' as const,
        initialReasons: ['Gejala ISK klasik', 'Perlu evaluasi dan pengobatan'],
        reasoning: 'Gejala klasik ISK memerlukan konsultasi untuk konfirmasi diagnosis dan pengobatan antibiotik yang tepat.'
      }

      const { GoogleGenerativeAI } = await import('@google/generative-ai')
      const mockModel = {
        generateContent: vi.fn().mockResolvedValue({
          response: {
            text: () => JSON.stringify(mockGeminiResponse)
          }
        })
      }
      
      const mockGenAI = {
        getGenerativeModel: vi.fn().mockReturnValue(mockModel)
      }
      
      vi.mocked(GoogleGenerativeAI).mockImplementation(() => mockGenAI as any)

      const input: TriageInput = {
        symptomsText: 'nyeri saat kencing, sering kencing sedikit, urine keruh'
      }

      const result = await triageHybrid(input)

      expect(result.level).toBe('CONSULT')
      expect(result.topConditions).toContainEqual(
        expect.objectContaining({ condition: 'Infeksi Saluran Kemih (ISK)' })
      )
      expect(result.matchedKeywords).toContain('nyeri saat kencing')
      expect(result.matchedKeywords).toContain('urine keruh')
    })
  })

  describe('Error Handling', () => {
    it('should handle Gemini API errors', async () => {
      const { GoogleGenerativeAI } = await import('@google/generative-ai')
      const mockModel = {
        generateContent: vi.fn().mockRejectedValue(new Error('API key invalid'))
      }
      
      const mockGenAI = {
        getGenerativeModel: vi.fn().mockReturnValue(mockModel)
      }
      
      vi.mocked(GoogleGenerativeAI).mockImplementation(() => mockGenAI as any)

      const input: TriageInput = {
        symptomsText: 'demam tinggi'
      }

      await expect(triageHybrid(input)).rejects.toThrow('model_unavailable')
    })

    it('should handle JSON parsing errors', async () => {
      const { GoogleGenerativeAI } = await import('@google/generative-ai')
      const mockModel = {
        generateContent: vi.fn().mockResolvedValue({
          response: {
            text: () => 'invalid json response'
          }
        })
      }
      
      const mockGenAI = {
        getGenerativeModel: vi.fn().mockReturnValue(mockModel)
      }
      
      vi.mocked(GoogleGenerativeAI).mockImplementation(() => mockGenAI as any)

      const input: TriageInput = {
        symptomsText: 'demam tinggi'
      }

      await expect(triageHybrid(input)).rejects.toThrow('Failed to parse Gemini response')
    })

    it('should handle timeout errors', async () => {
      const { GoogleGenerativeAI } = await import('@google/generative-ai')
      const mockModel = {
        generateContent: vi.fn().mockImplementation(() => 
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('timeout')), 13000)
          )
        )
      }
      
      const mockGenAI = {
        getGenerativeModel: vi.fn().mockReturnValue(mockModel)
      }
      
      vi.mocked(GoogleGenerativeAI).mockImplementation(() => mockGenAI as any)

      const input: TriageInput = {
        symptomsText: 'demam tinggi'
      }

      await expect(triageHybrid(input)).rejects.toThrow('model_unavailable')
    })
  })
})
