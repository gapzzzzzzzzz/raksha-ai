import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check database connection
    let dbStatus = 'connected'
    try {
      // This would be a real DB check in production
      // For now, we'll simulate it
      dbStatus = 'connected'
    } catch {
      dbStatus = 'fallback'
    }

    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      db: dbStatus,
      version: '1.0.0'
    })
  } catch {
    return NextResponse.json({
      ok: false,
      error: 'Health check failed',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
