# Raksha AI - AI Health Triage 24/7

Raksha AI adalah aplikasi web triage kesehatan berbasis AI yang inklusif dan kontekstual untuk Indonesia. Aplikasi ini menyediakan triage kesehatan 24/7 dengan prioritas musiman, mode low-bandwidth, dan integrasi bot WhatsApp/SMS.

## 🚀 Fitur Utama

### 🎯 Triage Kesehatan AI
- **Triage yang Dapat Dijelaskan**: Menjelaskan alasan penilaian risiko dan gejala yang memicu tingkat tertentu
- **Prioritas Musiman**: Mempertimbangkan musim dan wilayah untuk meningkatkan akurasi (misalnya risiko DBD di musim hujan)
- **NLP Bahasa Indonesia**: Memahami gejala dalam bahasa Indonesia dengan kata kunci dan alias
- **Micro-education**: Panduan perawatan yang disesuaikan dengan tingkat risiko

### 📱 Multi-Platform Access
- **Web App**: Interface lengkap dengan semua fitur
- **Lite Mode**: Mode ringan untuk koneksi lambat (text-only, minimal CSS)
- **PWA**: Progressive Web App yang dapat berjalan offline
- **Bot WhatsApp/SMS**: Akses melalui pesan teks (stub implementation)

### 🗺️ Kesehatan Komunitas
- **Heatmap Regional**: Visualisasi tren kesehatan berdasarkan laporan anonim
- **Dashboard Admin**: Monitoring laporan dan analisis tren
- **Data Anonim**: Laporan dianonimkan untuk melindungi privasi

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **UI**: Tailwind CSS + Lucide React icons
- **State Management**: React Server Components + TanStack Query
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Maps**: MapLibre GL + OpenStreetMap
- **Database**: Prisma + PostgreSQL
- **Auth**: NextAuth.js (credentials only for demo)
- **Internationalization**: next-intl (default id-ID)

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL database (Supabase/Neon recommended)
- npm atau pnpm

## 🚀 Setup & Installation

### 1. Clone Repository
```bash
git clone <repository-url>
cd raksha
```

### 2. Install Dependencies
```bash
npm install
# atau
pnpm install
```

### 3. Environment Setup
Copy `env.example` ke `.env.local` dan isi dengan konfigurasi Anda:

```bash
cp env.example .env.local
```

Edit `.env.local`:
```env
# Database
DATABASE_URL="postgresql://USER:PASS@HOST:PORT/DB?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="change-me"
NEXTAUTH_URL="http://localhost:3000"

# Admin credentials (for demo)
ADMIN_USER="admin"
ADMIN_PASS="admin123"

# Twilio (for bot stub)
TWILIO_ACCOUNT_SID="your_twilio_account_sid"
TWILIO_AUTH_TOKEN="your_twilio_auth_token"
TWILIO_PHONE_NUMBER="your_twilio_phone_number"
```

### 4. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with sample data
npm run db:seed
```

### 5. Run Development Server
```bash
npm run dev
```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000)

## 📁 Struktur Project

```
raksha/
├── app/                    # Next.js App Router
│   ├── (marketing)/       # Landing page
│   ├── triage/           # Main triage page
│   ├── lite/             # Low-bandwidth mode
│   ├── bot/              # WhatsApp/SMS bot info
│   ├── dashboard/        # Admin dashboard
│   ├── privacy/          # Privacy policy
│   ├── disclaimer/       # Medical disclaimer
│   └── api/              # API routes
├── components/           # Reusable UI components
├── lib/                  # Core logic
│   ├── triage/          # Triage engine
│   └── utils/           # Utility functions
├── prisma/              # Database schema & seed
└── public/              # Static assets
```

## 🧠 Triage Engine

### Input Types
```typescript
type TriageInput = {
  symptomsText: string
  age?: number
  tempC?: number
  daysFever?: number
  region?: string
  month?: number
  redFlags?: {
    chestPain?: boolean
    bleeding?: boolean
    sob?: boolean
  }
}
```

### Output Types
```typescript
type TriageResult = {
  level: "EMERGENCY" | "CONSULT" | "SELF_CARE"
  score: number
  reasons: string[]
  microEducation: string[]
  seasonalContext?: string
}
```

### Rules Engine
- **Emergency**: Red flags, high fever + breathing issues, severe symptoms
- **Consult**: Moderate fever for 2+ days, persistent vomiting, rash + fever, infants/elderly with fever
- **Self-care**: Mild symptoms, common cold/flu symptoms
- **Seasonal Prior**: DBD risk escalation during rainy season in high-risk regions

## 🔌 API Endpoints

### POST /api/triage
Performs health triage based on symptoms and context.

**Request:**
```json
{
  "symptomsText": "Demam tinggi, sakit kepala, mual",
  "age": 25,
  "tempC": 38.5,
  "region": "Jakarta",
  "consent": true
}
```

**Response:**
```json
{
  "level": "CONSULT",
  "score": 65,
  "reasons": ["Gejala perlu konsultasi: demam tinggi"],
  "microEducation": ["Kunjungi Puskesmas dalam 24 jam", "..."],
  "seasonalContext": "Prior musiman: risiko DBD meningkat di musim hujan"
}
```

### GET /api/reports
Retrieves anonymized health reports for dashboard.

**Query Parameters:**
- `region`: Filter by region
- `month`: Filter by month
- `risk`: Filter by risk level

### POST /api/bot/mock
Mock endpoint for WhatsApp/SMS bot integration.

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
# Build application
npm run build

# Start production server
npm start
```

## 🔒 Security & Privacy

- **No PII Storage**: Tidak menyimpan informasi pribadi
- **Data Anonymization**: Semua laporan dianonimkan
- **Consent-based**: Data hanya disimpan dengan persetujuan eksplisit
- **HTTPS Only**: Semua komunikasi dienkripsi
- **Input Validation**: Validasi ketat menggunakan Zod

## ⚠️ Disclaimer Medis

**PENTING**: Raksha AI bukan perangkat medis dan tidak dimaksudkan untuk menggantikan konsultasi medis profesional. Selalu konsultasikan dengan dokter untuk diagnosis dan pengobatan yang tepat.

Dalam situasi darurat, segera hubungi 118/119 atau datang ke IGD terdekat.

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Emergency**: 118/119
- **Health Hotline**: 119
- **Email**: support@raksha-ai.com

## 🙏 Acknowledgments

- OpenStreetMap for map tiles
- Indonesian health authorities for regional data
- Medical professionals who provided guidance
- Open source community for amazing tools

---

**Raksha AI** - Melindungi kesehatan masyarakat Indonesia dengan teknologi AI yang inklusif dan kontekstual.