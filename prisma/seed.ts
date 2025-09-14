import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const regions = [
  'DKI Jakarta',
  'Jawa Barat',
  'Jawa Tengah',
  'Jawa Timur',
  'Banten',
  'Bali',
  'NTB',
  'NTT',
  'Kaltim',
  'Sumatera Utara',
  'Sumatera Barat',
  'Sumatera Selatan',
  'Sulawesi Selatan',
  'Papua',
  'Kalimantan Barat'
]

const riskLevels = ['EMERGENCY', 'CONSULT', 'SELF_CARE'] as const

const sampleReasons = [
  ['Demam tinggi', 'Sesak napas'],
  ['Nyeri dada', 'Pusing'],
  ['Mual', 'Muntah'],
  ['Ruam', 'Gatal'],
  ['Lemas', 'Tidak nafsu makan'],
  ['Batuk', 'Pilek'],
  ['Sakit kepala', 'Demam ringan'],
  ['Nyeri otot', 'Kelelahan']
]

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.report.deleteMany()

  // Generate ~50 dummy reports
  const reports = []
  for (let i = 0; i < 50; i++) {
    const region = regions[Math.floor(Math.random() * regions.length)]
    const month = Math.floor(Math.random() * 12) + 1
    const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)]
    const reasons = sampleReasons[Math.floor(Math.random() * sampleReasons.length)]
    
    // Create date within last 3 months
    const createdAt = new Date()
    createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 90))

    reports.push({
      region,
      month,
      riskLevel,
      reasons,
      createdAt
    })
  }

  await prisma.report.createMany({
    data: reports
  })

  console.log(`✅ Created ${reports.length} reports`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
