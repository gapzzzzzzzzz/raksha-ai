import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { performTriage, TriageInput } from '@/lib/triage/engine'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const triageSchema = z.object({
  symptomsText: z.string().min(1, 'Gejala harus diisi'),
  age: z.number().min(0).max(120).optional(),
  tempC: z.number().min(30).max(45).optional(),
  daysFever: z.number().min(0).max(30).optional(),
  region: z.string().optional(),
  month: z.number().min(1).max(12).optional(),
  redFlags: z.object({
    chestPain: z.boolean().optional(),
    bleeding: z.boolean().optional(),
    sob: z.boolean().optional()
  }).optional(),
  consent: z.boolean().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = triageSchema.parse(body)
    
    // Perform triage
    const result = performTriage(validatedData as TriageInput)
    
    // Store anonymized report if consent given
    if (validatedData.consent) {
      try {
        await prisma.report.create({
          data: {
            region: validatedData.region || null,
            month: validatedData.month || null,
            riskLevel: result.level,
            reasons: result.reasons
          }
        })
      } catch (dbError) {
        console.error('Failed to store report:', dbError)
        // Don't fail the request if DB storage fails
      }
    }
    
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.issues },
        { status: 400 }
      )
    }
    
    console.error('Triage error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
