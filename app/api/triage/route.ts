import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { 
  validateTriageInput, 
  createErrorResponse, 
  createSuccessResponse,
  type TriageInput,
  type ApiResponse 
} from '../../../lib/triage/schema'
import { triageHybridWithRetry } from '../../../lib/triage/gemini'
import { simpleTriage } from '../../../lib/triage/simple-engine'

// Rate limiting (simple in-memory store for demo)
const requestCounts = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10 // 10 requests per minute per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const userRequests = requestCounts.get(ip)
  
  if (!userRequests || now > userRequests.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }
  
  if (userRequests.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }
  
  userRequests.count++
  return true
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    // Rate limiting
    const clientIP = getClientIP(request)
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        createErrorResponse('Rate limit exceeded. Please try again later.'),
        { status: 429 }
      )
    }

    // Parse and validate request body
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        createErrorResponse('Invalid JSON in request body'),
        { status: 400 }
      )
    }

    // Validate input schema
    let triageInput: TriageInput
    try {
      triageInput = validateTriageInput(body)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.issues.map(err => 
          `${err.path.join('.')}: ${err.message}`
        ).join(', ')
        return NextResponse.json(
          createErrorResponse(`Validation error: ${errorMessages}`),
          { status: 400 }
        )
      }
      return NextResponse.json(
        createErrorResponse('Invalid input format'),
        { status: 400 }
      )
    }

    // Check for empty or suspicious input
    if (!triageInput.symptomsText.trim()) {
      return NextResponse.json(
        createErrorResponse('Symptoms text cannot be empty'),
        { status: 400 }
      )
    }

    // Check for potential abuse (very short or very repetitive text)
    const symptomsText = triageInput.symptomsText.trim()
    if (symptomsText.length < 3) {
      return NextResponse.json(
        createErrorResponse('Symptoms text too short'),
        { status: 400 }
      )
    }

    // Check for repetitive text (potential spam)
    const words = symptomsText.split(/\s+/)
    const uniqueWords = new Set(words.map(w => w.toLowerCase()))
    if (words.length > 10 && uniqueWords.size < words.length * 0.3) {
      return NextResponse.json(
        createErrorResponse('Suspicious input detected'),
        { status: 400 }
      )
    }

    // Call the triage engine with fallback
    try {
      let result
      
      // Try Gemini API first if available
      if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        try {
          result = await triageHybridWithRetry(triageInput, 1)
          console.log('Triage completed with Gemini AI')
        } catch (geminiError) {
          console.warn('Gemini API failed, falling back to simple engine:', geminiError)
          result = simpleTriage(triageInput)
          console.log('Triage completed with simple engine (fallback)')
        }
      } else {
        // Use simple engine if no API key
        result = simpleTriage(triageInput)
        console.log('Triage completed with simple engine (no API key)')
      }
      
      // Log successful triage (without PII)
      console.log('Triage completed successfully', {
        level: result.level,
        score: result.score,
        conditionsCount: result.topConditions?.length || 0,
        timestamp: new Date().toISOString()
      })
      
      return NextResponse.json(createSuccessResponse(result))
      
    } catch (error) {
      console.error('Triage engine error:', error)
      
      // Final fallback to simple engine
      try {
        const fallbackResult = simpleTriage(triageInput)
        console.log('Triage completed with simple engine (final fallback)')
        return NextResponse.json(createSuccessResponse(fallbackResult))
      } catch (fallbackError) {
        console.error('Even simple engine failed:', fallbackError)
        return NextResponse.json(
          createErrorResponse('Triage service temporarily unavailable. Please try again later.'),
          { status: 503 }
        )
      }
    }

  } catch (error) {
    console.error('Unexpected error in triage API:', error)
    return NextResponse.json(
      createErrorResponse('Unexpected error occurred'),
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET(): Promise<NextResponse<ApiResponse>> {
  return NextResponse.json(
    createErrorResponse('Method not allowed. Use POST.'),
    { status: 405 }
  )
}

export async function PUT(): Promise<NextResponse<ApiResponse>> {
  return NextResponse.json(
    createErrorResponse('Method not allowed. Use POST.'),
    { status: 405 }
  )
}

export async function DELETE(): Promise<NextResponse<ApiResponse>> {
  return NextResponse.json(
    createErrorResponse('Method not allowed. Use POST.'),
    { status: 405 }
  )
}