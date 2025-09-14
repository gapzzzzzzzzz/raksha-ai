import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { performTriage, TriageInput } from '@/lib/triage/engine'

const botSchema = z.object({
  phone: z.string().min(1, 'Nomor telepon harus diisi'),
  message: z.string().min(1, 'Pesan harus diisi')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, message } = botSchema.parse(body)
    
    // Simple triage from message text
    const triageInput: TriageInput = {
      symptomsText: message,
      month: new Date().getMonth() + 1
    }
    
    const result = performTriage(triageInput)
    
    // Format response for WhatsApp/SMS
    let response = `🏥 *Raksha AI - Hasil Triage*\n\n`
    response += `📊 *Tingkat Risiko:* ${result.level}\n`
    response += `📈 *Skor:* ${result.score}/100\n\n`
    
    if (result.reasons.length > 0) {
      response += `🔍 *Alasan:*\n`
      result.reasons.forEach(reason => {
        response += `• ${reason}\n`
      })
      response += `\n`
    }
    
    response += `💡 *Saran:*\n`
    result.microEducation.forEach(education => {
      response += `• ${education}\n`
    })
    
    response += `\n⚠️ *PENTING:* Ini bukan diagnosis medis. Konsultasikan dengan dokter untuk penanganan yang tepat.`
    
    if (result.level === 'EMERGENCY') {
      response += `\n\n🚨 *DARURAT:* Segera ke IGD atau hubungi 118/119!`
    }
    
    return NextResponse.json({
      success: true,
      response,
      riskLevel: result.level,
      score: result.score
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Bot mock error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
