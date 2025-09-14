import { z } from 'zod'

// Input schema for triage requests
export const TriageInputSchema = z.object({
  symptomsText: z.string()
    .min(1, 'Gejala harus diisi')
    .max(2000, 'Gejala terlalu panjang (maksimal 2000 karakter)'),
  age: z.number()
    .min(0, 'Usia tidak valid')
    .max(120, 'Usia tidak valid')
    .optional(),
  tempC: z.number()
    .min(30, 'Suhu tidak valid (minimum 30°C)')
    .max(45, 'Suhu tidak valid (maksimum 45°C)')
    .optional(),
  daysFever: z.number()
    .min(0, 'Durasi demam tidak valid')
    .max(30, 'Durasi demam tidak valid')
    .optional(),
  region: z.string()
    .min(1, 'Region tidak valid')
    .max(100, 'Region terlalu panjang')
    .optional(),
  month: z.number()
    .min(1, 'Bulan tidak valid')
    .max(12, 'Bulan tidak valid')
    .optional(),
  diarrheaFreqPerDay: z.number()
    .min(0, 'Frekuensi diare tidak valid')
    .max(50, 'Frekuensi diare tidak valid')
    .optional(),
  vomitFreqPerDay: z.number()
    .min(0, 'Frekuensi muntah tidak valid')
    .max(50, 'Frekuensi muntah tidak valid')
    .optional(),
  redFlags: z.object({
    chestPain: z.boolean().optional(),
    bleeding: z.boolean().optional(),
    sob: z.boolean().optional(),
    neuro: z.boolean().optional()
  }).optional()
})

// Schema for individual condition in differential
export const ConditionSchema = z.object({
  condition: z.string().min(1, 'Nama kondisi tidak valid'),
  likelihood: z.number()
    .min(0, 'Likelihood tidak valid')
    .max(1, 'Likelihood tidak valid'),
  why: z.string().min(1, 'Penjelasan kondisi tidak valid')
})

// Output schema for triage results
export const TriageResultSchema = z.object({
  level: z.enum(['EMERGENCY', 'CONSULT', 'SELF_CARE']),
  score: z.number()
    .min(0, 'Skor tidak valid')
    .max(100, 'Skor tidak valid'),
  reasons: z.array(z.string()).min(1, 'Alasan harus ada'),
  seasonalContext: z.string().optional(),
  microEducation: z.array(z.string()).min(1, 'Pendidikan mikro harus ada'),
  topConditions: z.array(ConditionSchema).min(1, 'Kondisi top harus ada').max(5, 'Maksimal 5 kondisi'),
  matchedKeywords: z.array(z.string()).min(1, 'Kata kunci yang cocok harus ada'),
  reasoningLLM: z.string()
    .min(10, 'Penalaran LLM terlalu pendek')
    .max(500, 'Penalaran LLM terlalu panjang'),
  extracted: z.any() // Raw JSON from Gemini for debugging
})

// API response schema
export const ApiResponseSchema = z.union([
  z.object({
    ok: z.literal(true),
    result: TriageResultSchema
  }),
  z.object({
    ok: z.literal(false),
    error: z.string().min(1, 'Pesan error harus ada')
  })
])

// Gemini response schema (what we expect from the LLM)
export const GeminiResponseSchema = z.object({
  symptoms: z.array(z.string()).min(1, 'Gejala harus ada'),
  metadata: z.object({
    age: z.number().optional(),
    tempC: z.number().optional(),
    daysFever: z.number().optional(),
    diarrheaFreqPerDay: z.number().optional(),
    vomitFreqPerDay: z.number().optional(),
    painLocation: z.string().optional(),
    redFlags: z.object({
      chestPain: z.boolean().optional(),
      bleeding: z.boolean().optional(),
      sob: z.boolean().optional(),
      neuro: z.boolean().optional()
    }).optional()
  }),
  differential: z.array(ConditionSchema).min(1, 'Diferensial harus ada').max(5, 'Maksimal 5 kondisi'),
  matchedKeywords: z.array(z.string()).min(1, 'Kata kunci yang cocok harus ada'),
  initialLevel: z.enum(['EMERGENCY', 'CONSULT', 'SELF_CARE']),
  initialReasons: z.array(z.string()).min(1, 'Alasan awal harus ada'),
  reasoning: z.string()
    .min(10, 'Penalaran terlalu pendek')
    .max(350, 'Penalaran terlalu panjang')
})

// Type exports
export type TriageInput = z.infer<typeof TriageInputSchema>
export type TriageResult = z.infer<typeof TriageResultSchema>
export type Condition = z.infer<typeof ConditionSchema>
export type ApiResponse = z.infer<typeof ApiResponseSchema>
export type GeminiResponse = z.infer<typeof GeminiResponseSchema>

// Validation helper functions
export function validateTriageInput(input: unknown): TriageInput {
  return TriageInputSchema.parse(input)
}

export function validateTriageResult(result: unknown): TriageResult {
  return TriageResultSchema.parse(result)
}

export function validateGeminiResponse(response: unknown): GeminiResponse {
  return GeminiResponseSchema.parse(response)
}

export function validateApiResponse(response: unknown): ApiResponse {
  return ApiResponseSchema.parse(response)
}

// Safe error response creator
export function createErrorResponse(error: string): ApiResponse {
  return {
    ok: false,
    error: error
  }
}

// Success response creator
export function createSuccessResponse(result: TriageResult): ApiResponse {
  return {
    ok: true,
    result: result
  }
}
