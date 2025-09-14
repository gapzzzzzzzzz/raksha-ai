import { describe, it, expect } from 'vitest'
import { performTriage, TriageInput } from './engine'

describe('Triage Engine', () => {
  describe('Emergency Cases', () => {
    it('should return EMERGENCY for chest pain', () => {
      const input: TriageInput = {
        symptomsText: 'nyeri dada yang parah',
        redFlags: { chestPain: true }
      }
      
      const result = performTriage(input)
      
      expect(result.level).toBe('EMERGENCY')
      expect(result.score).toBeGreaterThanOrEqual(90)
      expect(result.reasons).toContain('Nyeri dada - gejala serius')
    })

    it('should return EMERGENCY for bleeding', () => {
      const input: TriageInput = {
        symptomsText: 'pendarahan hebat',
        redFlags: { bleeding: true }
      }
      
      const result = performTriage(input)
      
      expect(result.level).toBe('EMERGENCY')
      expect(result.score).toBeGreaterThanOrEqual(95)
      expect(result.reasons).toContain('Pendarahan - perlu penanganan segera')
    })

    it('should return EMERGENCY for shortness of breath', () => {
      const input: TriageInput = {
        symptomsText: 'sesak napas berat',
        redFlags: { sob: true }
      }
      
      const result = performTriage(input)
      
      expect(result.level).toBe('EMERGENCY')
      expect(result.score).toBeGreaterThanOrEqual(90)
      expect(result.reasons).toContain('Sesak napas - gejala darurat')
    })

    it('should return EMERGENCY for high fever with breathing issues', () => {
      const input: TriageInput = {
        symptomsText: 'demam tinggi dan sesak napas',
        tempC: 40,
        redFlags: { sob: true }
      }
      
      const result = performTriage(input)
      
      expect(result.level).toBe('EMERGENCY')
      expect(result.score).toBeGreaterThanOrEqual(95)
      expect(result.reasons).toContain('Demam tinggi (40°C) dengan sesak napas')
    })
  })

  describe('Consultation Cases', () => {
    it('should return CONSULT for persistent fever', () => {
      const input: TriageInput = {
        symptomsText: 'demam sudah 3 hari',
        tempC: 38.5,
        daysFever: 3
      }
      
      const result = performTriage(input)
      
      expect(result.level).toBe('CONSULT')
      expect(result.score).toBeGreaterThanOrEqual(60)
      expect(result.reasons).toContain('Demam 38.5°C selama 3 hari')
    })

    it('should return CONSULT for infant with fever', () => {
      const input: TriageInput = {
        symptomsText: 'bayi demam',
        age: 1,
        tempC: 38.2
      }
      
      const result = performTriage(input)
      
      expect(result.level).toBe('CONSULT')
      expect(result.score).toBeGreaterThanOrEqual(70)
      expect(result.reasons).toContain('Demam pada bayi - perlu konsultasi')
    })

    it('should return CONSULT for elderly with fever', () => {
      const input: TriageInput = {
        symptomsText: 'lansia demam',
        age: 70,
        tempC: 38.1
      }
      
      const result = performTriage(input)
      
      expect(result.level).toBe('CONSULT')
      expect(result.score).toBeGreaterThanOrEqual(70)
      expect(result.reasons).toContain('Demam pada lansia - perlu konsultasi')
    })

    it('should return CONSULT for vomiting symptoms', () => {
      const input: TriageInput = {
        symptomsText: 'muntah terus menerus dan mual'
      }
      
      const result = performTriage(input)
      
      expect(result.level).toBe('CONSULT')
      expect(result.score).toBeGreaterThanOrEqual(60)
      expect(result.reasons.some(reason => reason.includes('muntah'))).toBe(true)
    })
  })

  describe('Self-Care Cases', () => {
    it('should return SELF_CARE for mild symptoms', () => {
      const input: TriageInput = {
        symptomsText: 'batuk dan pilek ringan'
      }
      
      const result = performTriage(input)
      
      expect(result.level).toBe('SELF_CARE')
      expect(result.score).toBeLessThan(60)
      expect(result.reasons.some(reason => reason.includes('ringan'))).toBe(true)
    })

    it('should return SELF_CARE for common cold', () => {
      const input: TriageInput = {
        symptomsText: 'sakit kepala ringan dan lemas'
      }
      
      const result = performTriage(input)
      
      expect(result.level).toBe('SELF_CARE')
      expect(result.score).toBeLessThan(60)
    })
  })

  describe('Seasonal Prior', () => {
    it('should escalate risk for DBD symptoms in rainy season', () => {
      const input: TriageInput = {
        symptomsText: 'demam, ruam, nyeri otot, mual',
        region: 'Jawa Timur',
        month: 1 // January (rainy season)
      }
      
      const result = performTriage(input)
      
      expect(result.seasonalContext).toContain('Prior musiman: risiko DBD meningkat di musim hujan')
      expect(result.reasons.some(reason => reason.includes('Prior musiman'))).toBe(true)
    })

    it('should not escalate risk for non-DBD regions', () => {
      const input: TriageInput = {
        symptomsText: 'demam, ruam, nyeri otot, mual',
        region: 'Papua',
        month: 1 // January (rainy season)
      }
      
      const result = performTriage(input)
      
      expect(result.seasonalContext).toBeUndefined()
    })

    it('should not escalate risk outside rainy season', () => {
      const input: TriageInput = {
        symptomsText: 'demam, ruam, nyeri otot, mual',
        region: 'Jawa Timur',
        month: 6 // June (dry season)
      }
      
      const result = performTriage(input)
      
      expect(result.seasonalContext).toBeUndefined()
    })
  })

  describe('Micro Education', () => {
    it('should provide emergency micro education', () => {
      const input: TriageInput = {
        symptomsText: 'nyeri dada',
        redFlags: { chestPain: true }
      }
      
      const result = performTriage(input)
      
      expect(result.microEducation).toContain('Segera ke IGD atau rumah sakit terdekat')
      expect(result.microEducation).toContain('Jangan tunda mencari pertolongan medis')
    })

    it('should provide consult micro education', () => {
      const input: TriageInput = {
        symptomsText: 'demam tinggi',
        tempC: 38.5,
        daysFever: 2
      }
      
      const result = performTriage(input)
      
      expect(result.microEducation).toContain('Kunjungi Puskesmas atau dokter dalam 24 jam')
      expect(result.microEducation).toContain('Minum air putih yang cukup (8-10 gelas/hari)')
    })

    it('should provide self-care micro education', () => {
      const input: TriageInput = {
        symptomsText: 'batuk ringan'
      }
      
      const result = performTriage(input)
      
      expect(result.microEducation).toContain('Istirahat yang cukup di rumah')
      expect(result.microEducation).toContain('Minum air putih minimal 8 gelas/hari')
    })
  })

  describe('Score Calculation', () => {
    it('should return appropriate score ranges', () => {
      const emergencyInput: TriageInput = {
        symptomsText: 'nyeri dada',
        redFlags: { chestPain: true }
      }
      
      const consultInput: TriageInput = {
        symptomsText: 'demam tinggi',
        tempC: 38.5,
        daysFever: 2
      }
      
      const selfCareInput: TriageInput = {
        symptomsText: 'batuk ringan'
      }
      
      const emergencyResult = performTriage(emergencyInput)
      const consultResult = performTriage(consultInput)
      const selfCareResult = performTriage(selfCareInput)
      
      expect(emergencyResult.score).toBeGreaterThanOrEqual(90)
      expect(consultResult.score).toBeGreaterThanOrEqual(60)
      expect(consultResult.score).toBeLessThan(90)
      expect(selfCareResult.score).toBeLessThan(60)
    })
  })
})
