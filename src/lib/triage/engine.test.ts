import { describe, it, expect } from 'vitest'
import { performTriage, type TriageInput } from './engine'

describe('Triage Engine', () => {
  describe('Red Flags', () => {
    it('should escalate to EMERGENCY for chest pain', () => {
      const input: TriageInput = {
        symptomsText: 'sakit dada',
        redFlags: { chestPain: true }
      }
      
      const result = performTriage(input)
      expect(result.level).toBe('EMERGENCY')
      expect(result.score).toBe(90)
      expect(result.reasons).toContain('Nyeri dada - gejala serius')
    })

    it('should escalate to EMERGENCY for bleeding', () => {
      const input: TriageInput = {
        symptomsText: 'mimisan',
        redFlags: { bleeding: true }
      }
      
      const result = performTriage(input)
      expect(result.level).toBe('EMERGENCY')
      expect(result.score).toBe(95)
      expect(result.reasons).toContain('Pendarahan - perlu penanganan segera')
    })

    it('should escalate to EMERGENCY for shortness of breath', () => {
      const input: TriageInput = {
        symptomsText: 'sesak napas',
        redFlags: { sob: true }
      }
      
      const result = performTriage(input)
      expect(result.level).toBe('EMERGENCY')
      expect(result.score).toBe(90)
      expect(result.reasons).toContain('Sesak napas - gejala darurat')
    })
  })

  describe('Temperature and Fever', () => {
    it('should escalate to EMERGENCY for high fever with SOB', () => {
      const input: TriageInput = {
        symptomsText: 'demam tinggi',
        tempC: 40,
        daysFever: 1,
        redFlags: { sob: true }
      }
      
      const result = performTriage(input)
      expect(result.level).toBe('EMERGENCY')
      expect(result.score).toBe(95)
      expect(result.reasons).toContain('Demam tinggi (40°C) dengan sesak napas')
    })

    it('should escalate to CONSULT for prolonged fever', () => {
      const input: TriageInput = {
        symptomsText: 'demam',
        tempC: 38.5,
        daysFever: 3
      }
      
      const result = performTriage(input)
      expect(result.level).toBe('CONSULT')
      expect(result.score).toBe(60)
      expect(result.reasons).toContain('Demam 38.5°C selama 3 hari')
    })
  })

  describe('Age-based Risk', () => {
    it('should escalate to CONSULT for fever in infants', () => {
      const input: TriageInput = {
        symptomsText: 'demam',
        age: 1,
        tempC: 38.2
      }
      
      const result = performTriage(input)
      expect(result.level).toBe('CONSULT')
      expect(result.score).toBe(70)
      expect(result.reasons).toContain('Demam pada bayi - perlu konsultasi')
    })

    it('should escalate to CONSULT for fever in elderly', () => {
      const input: TriageInput = {
        symptomsText: 'demam',
        age: 70,
        tempC: 38.1
      }
      
      const result = performTriage(input)
      expect(result.level).toBe('CONSULT')
      expect(result.score).toBe(70)
      expect(result.reasons).toContain('Demam pada lansia - perlu konsultasi')
    })
  })

  describe('Symptom-based Risk', () => {
    it('should detect emergency symptoms', () => {
      const input: TriageInput = {
        symptomsText: 'sesak napas dan pingsan'
      }
      
      const result = performTriage(input)
      expect(result.level).toBe('EMERGENCY')
      expect(result.score).toBeGreaterThanOrEqual(85)
      expect(result.reasons.some(r => r.includes('Gejala darurat terdeteksi'))).toBe(true)
    })

    it('should detect consultation symptoms', () => {
      const input: TriageInput = {
        symptomsText: 'demam tinggi dan muntah terus'
      }
      
      const result = performTriage(input)
      expect(result.level).toBe('CONSULT')
      expect(result.score).toBeGreaterThanOrEqual(60)
      expect(result.reasons.some(r => r.includes('Gejala perlu konsultasi'))).toBe(true)
    })

    it('should detect self-care symptoms', () => {
      const input: TriageInput = {
        symptomsText: 'batuk dan pilek'
      }
      
      const result = performTriage(input)
      expect(result.level).toBe('SELF_CARE')
      expect(result.score).toBeGreaterThanOrEqual(30)
      expect(result.reasons.some(r => r.includes('Gejala ringan'))).toBe(true)
    })
  })

  describe('Seasonal Prior', () => {
    it('should apply DBD risk in rainy season', () => {
      const input: TriageInput = {
        symptomsText: 'demam dan ruam',
        month: 1, // January (rainy season)
        region: 'DKI Jakarta'
      }
      
      const result = performTriage(input)
      expect(result.level).toBe('CONSULT')
      expect(result.seasonalContext).toContain('Prior musiman: risiko DBD meningkat di musim hujan')
      expect(result.reasons.some(r => r.includes('risiko DBD meningkat'))).toBe(true)
    })

    it('should not apply DBD risk in dry season', () => {
      const input: TriageInput = {
        symptomsText: 'demam dan ruam',
        month: 7, // July (dry season)
        region: 'DKI Jakarta'
      }
      
      const result = performTriage(input)
      expect(result.seasonalContext).toBeUndefined()
    })

    it('should not apply DBD risk in non-risk regions', () => {
      const input: TriageInput = {
        symptomsText: 'demam dan ruam',
        month: 1, // January (rainy season)
        region: 'Papua'
      }
      
      const result = performTriage(input)
      expect(result.seasonalContext).toBeUndefined()
    })
  })

  describe('Keyword Aliases', () => {
    it('should recognize various ways to express shortness of breath', () => {
      const aliases = ['sesak napas', 'susah nafas', 'napas berat', 'terengah-engah']
      
      aliases.forEach(alias => {
        const input: TriageInput = {
          symptomsText: alias
        }
        
        const result = performTriage(input)
        expect(result.level).toBe('EMERGENCY')
        expect(result.reasons.some(r => r.includes('sesak napas') || r.includes(alias))).toBe(true)
      })
    })

    it('should recognize various ways to express bleeding', () => {
      const aliases = ['berdarah', 'mimisan', 'pendarahan hebat']
      
      aliases.forEach(alias => {
        const input: TriageInput = {
          symptomsText: alias
        }
        
        const result = performTriage(input)
        expect(result.level).toBe('EMERGENCY')
        expect(result.reasons.some(r => r.includes('pendarahan'))).toBe(true)
      })
    })
  })

  describe('Micro Education', () => {
    it('should provide appropriate micro education for EMERGENCY', () => {
      const input: TriageInput = {
        symptomsText: 'sesak napas',
        redFlags: { sob: true }
      }
      
      const result = performTriage(input)
      expect(result.microEducation).toContain('Segera ke IGD atau rumah sakit terdekat')
      expect(result.microEducation).toContain('Jangan tunda mencari pertolongan medis')
    })

    it('should provide appropriate micro education for CONSULT', () => {
      const input: TriageInput = {
        symptomsText: 'demam tinggi',
        tempC: 38.5,
        daysFever: 2
      }
      
      const result = performTriage(input)
      expect(result.microEducation).toContain('Kunjungi Puskesmas atau dokter dalam 24 jam')
      expect(result.microEducation).toContain('Minum air putih yang cukup (8-10 gelas/hari)')
    })

    it('should provide appropriate micro education for SELF_CARE', () => {
      const input: TriageInput = {
        symptomsText: 'batuk dan pilek'
      }
      
      const result = performTriage(input)
      expect(result.microEducation).toContain('Istirahat yang cukup di rumah')
      expect(result.microEducation).toContain('Minum air putih minimal 8 gelas/hari')
    })
  })

  describe('Score Calculation', () => {
    it('should return score between 0-100', () => {
      const inputs: TriageInput[] = [
        { symptomsText: 'batuk' },
        { symptomsText: 'demam tinggi', tempC: 38.5 },
        { symptomsText: 'sesak napas', redFlags: { sob: true } }
      ]
      
      inputs.forEach(input => {
        const result = performTriage(input)
        expect(result.score).toBeGreaterThanOrEqual(0)
        expect(result.score).toBeLessThanOrEqual(100)
      })
    })
  })
})