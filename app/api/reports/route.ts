import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const region = searchParams.get('region')
    const month = searchParams.get('month')
    const risk = searchParams.get('risk')

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
      total: reports.length
    })
  } catch (error) {
    console.error('Reports API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
