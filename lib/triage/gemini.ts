import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'
import { TriageInput, TriageResult, GeminiResponse } from './schema'
import { SYSTEM_PROMPT, buildUserPrompt } from './prompt'
import { 
  detectRedFlags, 
  extractKeywords, 
  getSeasonalContext, 
  shouldApplySeasonalPrior,
  SEASONAL_CONFIG 
} from './ontology'

// Configuration
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-pro'
const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY

if (!API_KEY) {
  throw new Error('GOOGLE_GENERATIVE_AI_API_KEY environment variable is required')
}

// Initialize Gemini
const genAI = new GoogleGenerativeAI(API_KEY)
const model: GenerativeModel = genAI.getGenerativeModel({ 
  model: GEMINI_MODEL,
  generationConfig: {
    temperature: 0.1, // Low temperature for consistent outputs
    maxOutputTokens: 1000,
    responseMimeType: 'application/json'
  }
})

// Micro-education content per level
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

// Guardrails and scoring logic
function applyGuardrails(
  geminiResponse: GeminiResponse,
  input: TriageInput
): { level: 'EMERGENCY' | 'CONSULT' | 'SELF_CARE', score: number, reasons: string[] } {
  let level = geminiResponse.initialLevel
  let score = 0
  const reasons = [...geminiResponse.initialReasons]

  // Red flags - force EMERGENCY
  const redFlags = detectRedFlags(input.symptomsText)
  const hasRedFlags = Object.values(redFlags).some(flag => flag)
  
  if (hasRedFlags) {
    level = 'EMERGENCY'
    score = Math.max(score, 92)
    
    if (redFlags.chestPain) reasons.push('Nyeri dada - gejala serius')
    if (redFlags.bleeding) reasons.push('Pendarahan - perlu penanganan segera')
    if (redFlags.sob) reasons.push('Sesak napas - gejala darurat')
    if (redFlags.neuro) reasons.push('Gejala neurologis - perlu evaluasi segera')
  }

  // High temperature escalation
  if (input.tempC && input.tempC >= 39.5) {
    if (level === 'SELF_CARE') {
      level = 'CONSULT'
      score = Math.max(score, 70)
    } else if (level === 'CONSULT' && hasRedFlags) {
      level = 'EMERGENCY'
      score = Math.max(score, 95)
    }
    reasons.push(`Demam tinggi (${input.tempC}°C)`)
  }

  // GI symptoms with high frequency
  if ((input.diarrheaFreqPerDay && input.diarrheaFreqPerDay >= 6) || 
      (input.vomitFreqPerDay && input.vomitFreqPerDay >= 3)) {
    if (level === 'SELF_CARE' && !hasRedFlags) {
      level = 'CONSULT'
      score = Math.max(score, 65)
      reasons.push('Gejala gastrointestinal dengan frekuensi tinggi')
    }
  }

  // Age-based risk
  if (input.age !== undefined) {
    if (input.age < 2 || input.age > 65) {
      if (input.tempC && input.tempC >= 38) {
        if (level === 'SELF_CARE') {
          level = 'CONSULT'
          score = Math.max(score, 70)
        }
        reasons.push(`Demam pada ${input.age < 2 ? 'bayi' : 'lansia'} - perlu konsultasi`)
      }
    }
  }

  // Set default score if not set by guardrails
  if (score === 0) {
    score = level === 'EMERGENCY' ? 90 : level === 'CONSULT' ? 60 : 30
  }

  return { level, score, reasons }
}

// Seasonal prior application
function applySeasonalPrior(
  geminiResponse: GeminiResponse,
  input: TriageInput,
  level: 'EMERGENCY' | 'CONSULT' | 'SELF_CARE',
  score: number,
  reasons: string[]
): { level: 'EMERGENCY' | 'CONSULT' | 'SELF_CARE', score: number, reasons: string[], seasonalContext?: string } {
  const seasonalContext = getSeasonalContext(input.month, input.region)
  
  if (seasonalContext && shouldApplySeasonalPrior(input.month, input.region, geminiResponse.symptoms)) {
    let newLevel = level
    let newScore = score
    const newReasons = [...reasons]

    // Escalate SELF_CARE to CONSULT for DBD risk
    if (level === 'SELF_CARE') {
      newLevel = 'CONSULT'
      newScore = Math.max(newScore, 65)
    }

    // Boost DBD likelihood in differential
    const updatedDifferential = geminiResponse.differential.map(condition => {
      if (condition.condition === 'DBD/Dengue') {
        return {
          ...condition,
          likelihood: Math.min(condition.likelihood + 0.15, 1.0)
        }
      }
      return condition
    })

    newReasons.push(seasonalContext)
    
    return {
      level: newLevel,
      score: newScore,
      reasons: newReasons,
      seasonalContext
    }
  }

  return { level, score, reasons, seasonalContext }
}

// Main hybrid triage function
export async function triageHybrid(input: TriageInput): Promise<TriageResult> {
  try {
    // Build the prompt
    const userPrompt = buildUserPrompt(input.symptomsText, {
      age: input.age,
      tempC: input.tempC,
      daysFever: input.daysFever,
      diarrheaFreqPerDay: input.diarrheaFreqPerDay,
      vomitFreqPerDay: input.vomitFreqPerDay,
      region: input.region,
      month: input.month
    })

    // Call Gemini with timeout
    const result = await Promise.race([
      model.generateContent([SYSTEM_PROMPT, userPrompt]),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Gemini request timeout')), 12000)
      )
    ]) as any

    if (!result.response) {
      throw new Error('No response from Gemini')
    }

    const responseText = result.response.text()
    
    // Parse JSON response
    let geminiResponse: GeminiResponse
    try {
      // Remove any code fences if present
      const cleanResponse = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      geminiResponse = JSON.parse(cleanResponse)
    } catch (parseError) {
      throw new Error(`Failed to parse Gemini response: ${parseError}`)
    }

    // Validate Gemini response
    try {
      geminiResponse = require('./schema').validateGeminiResponse(geminiResponse)
    } catch (validationError) {
      throw new Error(`Invalid Gemini response format: ${validationError}`)
    }

    // Apply guardrails
    const { level, score, reasons } = applyGuardrails(geminiResponse, input)

    // Apply seasonal prior
    const { level: finalLevel, score: finalScore, reasons: finalReasons, seasonalContext } = 
      applySeasonalPrior(geminiResponse, input, level, score, reasons)

    // Sort differential by likelihood
    const sortedDifferential = geminiResponse.differential
      .sort((a, b) => b.likelihood - a.likelihood)
      .slice(0, 3)

    // Extract matched keywords from input
    const matchedKeywords = extractKeywords(input.symptomsText)

    // Build final result
    const result: TriageResult = {
      level: finalLevel,
      score: Math.min(finalScore, 100),
      reasons: finalReasons,
      seasonalContext,
      microEducation: MICRO_EDUCATION[finalLevel],
      topConditions: sortedDifferential,
      matchedKeywords,
      reasoningLLM: geminiResponse.reasoning,
      extracted: geminiResponse // For debugging
    }

    return result

  } catch (error) {
    console.error('Triage engine error:', error)
    
    // Return safe error response
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        throw new Error('model_unavailable')
      }
      if (error.message.includes('API key')) {
        throw new Error('model_unavailable')
      }
    }
    
    throw new Error('Triage engine error')
  }
}

// Retry wrapper for network issues
export async function triageHybridWithRetry(input: TriageInput, maxRetries: number = 1): Promise<TriageResult> {
  let lastError: Error | null = null
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await triageHybrid(input)
    } catch (error) {
      lastError = error as Error
      
      // Don't retry on validation errors or API key issues
      if (error instanceof Error && 
          (error.message.includes('validation') || 
           error.message.includes('API key') ||
           error.message.includes('parse'))) {
        break
      }
      
      // Wait before retry (exponential backoff)
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
      }
    }
  }
  
  throw lastError || new Error('Unknown error')
}
