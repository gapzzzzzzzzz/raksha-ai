import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Fallback demo data
const generateDemoData = () => {
  const regions = ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Makassar', 'Palembang', 'Tangerang']
  const riskLevels = ['EMERGENCY', 'CONSULT', 'SELF_CARE']
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  
  const reports = []
  for (let i = 0; i < 50; i++) {
    reports.push({
      id: `demo-${i}`,
      region: regions[Math.floor(Math.random() * regions.length)],
      month: months[Math.floor(Math.random() * months.length)],
      riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    })
  }

  // Generate aggregations
  const regionAggregation = regions.map(region => ({
    region,
    _count: { region: Math.floor(Math.random() * 20) + 5 }
  }))

  const riskAggregation = riskLevels.map(risk => ({
    riskLevel: risk,
    _count: { riskLevel: Math.floor(Math.random() * 30) + 10 }
  }))

  const monthAggregation = months.map(month => ({
    month,
    _count: { month: Math.floor(Math.random() * 15) + 5 }
  }))

  return {
    reports,
    aggregations: {
      byRegion: regionAggregation,
      byRisk: riskAggregation,
      byMonth: monthAggregation
    },
    total: reports.length,
    isDemo: true
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const region = searchParams.get('region')
    const month = searchParams.get('month')
    const risk = searchParams.get('risk')

    // Try to connect to database
    let dbConnected = false
    try {
      await prisma.$connect()
      dbConnected = true
    } catch (error) {
      console.warn('Database connection failed, using demo data:', error)
    }

    if (!dbConnected) {
      // Return demo data with demo mode flag
      const demoData = generateDemoData()
      return NextResponse.json({
        ...demoData,
        message: 'Demo Mode - Database offline'
      })
    }

    // Build filter conditions
    const where: Record<string, unknown> = {}
    
    if (region) {
      where.region = region
    }
    
    if (month) {
      where.month = parseInt(month)
    }
    
    if (risk) {
      where.riskLevel = risk
    }

    // Get aggregated data
    const reports = await prisma.report.findMany({
      where,
      select: {
        id: true,
        region: true,
        month: true,
        riskLevel: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Aggregate by region for heatmap
    const regionAggregation = await prisma.report.groupBy({
      by: ['region'],
      where: {
        region: { not: null }
      },
      _count: {
        region: true
      }
    })

    // Aggregate by risk level
    const riskAggregation = await prisma.report.groupBy({
      by: ['riskLevel'],
      _count: {
        riskLevel: true
      }
    })

    // Aggregate by month
    const monthAggregation = await prisma.report.groupBy({
      by: ['month'],
      where: {
        month: { not: null }
      },
      _count: {
        month: true
      }
    })

    return NextResponse.json({
      reports,
      aggregations: {
        byRegion: regionAggregation,
        byRisk: riskAggregation,
        byMonth: monthAggregation
      },
      total: reports.length,
      isDemo: false
    })
  } catch (error) {
    console.error('Reports API error:', error)
    
    // Return demo data as fallback
    const demoData = generateDemoData()
    return NextResponse.json({
      ...demoData,
      message: 'Demo Mode - Error occurred'
    })
  } finally {
    try {
      await prisma.$disconnect()
    } catch {
      // Ignore disconnect errors
    }
  }
}
