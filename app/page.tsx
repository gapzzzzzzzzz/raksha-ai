import Link from 'next/link'
import { 
  Shield, 
  MapPin, 
  Clock, 
  HeartPulse, 
  Activity, 
  Smartphone, 
  Wifi, 
  MessageSquare,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Users,
  Zap
} from 'lucide-react'
import { RKCard } from '@/src/components/RKCard'
import { RKButton } from '@/src/components/RKButton'
import { RKBadge } from '@/src/components/RKBadge'
import { SectionHeading, SectionSubheading } from '@/src/components/SectionHeading'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-rk-bg">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Text Content */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 bg-rk-primary-50 text-rk-primary px-4 py-2 rounded-full text-sm font-medium">
                    <Shield className="w-4 h-4" />
                    AI Health Triage 24/7
                  </div>
                  
                  <SectionHeading as="h1" className="text-4xl md:text-5xl lg:text-6xl">
                    Triage Kesehatan AI Terpercaya untuk Indonesia
                  </SectionHeading>
                  
                  <SectionSubheading className="text-xl">
                    Dapatkan penilaian kesehatan instan dengan AI yang memahami konteks lokal, 
                    prioritas musiman, dan kondisi geografis Indonesia.
                  </SectionSubheading>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-rk-primary">24/7</div>
                    <div className="text-sm text-rk-subtle">Tersedia</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-rk-accent">&lt;30s</div>
                    <div className="text-sm text-rk-subtle">Response</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-rk-success">100%</div>
                    <div className="text-sm text-rk-subtle">Gratis</div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <RKButton size="lg" asChild>
                    <Link href="/triage" className="flex items-center gap-2">
                      Mulai Triage Sekarang
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </RKButton>
                  <RKButton variant="secondary" size="lg" asChild>
                    <Link href="/lite">Mode Lite</Link>
                  </RKButton>
                </div>
              </div>

              {/* Right: Illustration */}
              <div className="relative">
                <div className="rk-card-elevated p-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-rk-primary to-rk-accent rounded-xl flex items-center justify-center">
                        <HeartPulse className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-rk-text">Raksha AI</h3>
                        <p className="text-sm text-rk-subtle">Health Triage Engine</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-rk-success" />
                        <span className="text-rk-text">Local Prior Knowledge</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-rk-success" />
                        <span className="text-rk-text">Seasonal Context</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-rk-success" />
                        <span className="text-rk-text">Explainable Results</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-rk-success" />
                        <span className="text-rk-text">Micro-Education</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problems We Solve */}
      <section className="py-16 md:py-24 bg-rk-surface">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <SectionHeading>Masalah yang Kami Pecahkan</SectionHeading>
              <SectionSubheading>
                Tantangan kesehatan di Indonesia memerlukan solusi yang kontekstual dan inklusif
              </SectionSubheading>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <RKCard elevated className="text-center">
                <div className="w-16 h-16 bg-rk-danger-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="w-8 h-8 text-rk-danger" />
                </div>
                <h3 className="text-xl font-semibold text-rk-text mb-4">
                  Akses Terbatas ke Layanan Kesehatan
                </h3>
                <p className="text-rk-subtle">
                  70% penduduk Indonesia tinggal di daerah dengan akses terbatas ke fasilitas kesehatan. 
                  Raksha memberikan triage awal yang dapat diakses 24/7.
                </p>
              </RKCard>

              <RKCard elevated className="text-center">
                <div className="w-16 h-16 bg-rk-warning-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-8 h-8 text-rk-warning" />
                </div>
                <h3 className="text-xl font-semibold text-rk-text mb-4">
                  Penanganan yang Tidak Tepat Waktu
                </h3>
                <p className="text-rk-subtle">
                  Banyak kasus darurat tidak teridentifikasi dengan cepat. 
                  AI kami dapat mendeteksi red flags dan memberikan panduan segera.
                </p>
              </RKCard>

              <RKCard elevated className="text-center">
                <div className="w-16 h-16 bg-rk-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-rk-primary" />
                </div>
                <h3 className="text-xl font-semibold text-rk-text mb-4">
                  Kurangnya Edukasi Kesehatan
                </h3>
                <p className="text-rk-subtle">
                  Masyarakat sering tidak tahu kapan harus mencari bantuan medis. 
                  Raksha memberikan edukasi mikro yang mudah dipahami.
                </p>
              </RKCard>
            </div>
          </div>
        </div>
      </section>

      {/* Why Raksha is Different */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <SectionHeading>Mengapa Raksha Berbeda</SectionHeading>
              <SectionSubheading>
                Teknologi AI yang dirancang khusus untuk konteks Indonesia
              </SectionSubheading>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <RKBadge variant="primary" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Local Prior
              </RKBadge>
              <RKBadge variant="success" className="flex items-center gap-2">
                <Wifi className="w-4 h-4" />
                Low-Bandwidth
              </RKBadge>
              <RKBadge variant="warning" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Explainable
              </RKBadge>
              <RKBadge variant="primary" className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4" />
                Micro-Education
              </RKBadge>
              <RKBadge variant="success" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Heatmap
              </RKBadge>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <RKCard>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-rk-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-rk-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-rk-text mb-2">Local Prior Knowledge</h3>
                    <p className="text-rk-subtle text-sm">
                      AI memahami penyakit endemik, pola musiman, dan kondisi geografis Indonesia.
                    </p>
                  </div>
                </div>
              </RKCard>

              <RKCard>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-rk-accent-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Wifi className="w-6 h-6 text-rk-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-rk-text mb-2">Low-Bandwidth Optimized</h3>
                    <p className="text-rk-subtle text-sm">
                      Dirancang untuk koneksi internet lambat dengan mode Lite & PWA offline.
                    </p>
                  </div>
                </div>
              </RKCard>

              <RKCard>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-rk-warning-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-rk-warning" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-rk-text mb-2">Explainable AI</h3>
                    <p className="text-rk-subtle text-sm">
                      Setiap keputusan dijelaskan dengan alasan yang mudah dipahami.
                    </p>
                  </div>
                </div>
              </RKCard>

              <RKCard>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-rk-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <HeartPulse className="w-6 h-6 text-rk-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-rk-text mb-2">Micro-Education</h3>
                    <p className="text-rk-subtle text-sm">
                      Panduan perawatan yang disesuaikan dengan kondisi dan budaya lokal.
                    </p>
                  </div>
                </div>
              </RKCard>

              <RKCard>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-rk-accent-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Activity className="w-6 h-6 text-rk-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-rk-text mb-2">Real-time Heatmap</h3>
                    <p className="text-rk-subtle text-sm">
                      Visualisasi pola penyakit untuk membantu pengambilan keputusan.
                    </p>
                  </div>
                </div>
              </RKCard>

              <RKCard>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-rk-warning-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-6 h-6 text-rk-warning" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-rk-text mb-2">Multi-Channel Access</h3>
                    <p className="text-rk-subtle text-sm">
                      Tersedia via web, PWA, dan stub untuk WhatsApp/SMS.
                    </p>
                  </div>
                </div>
              </RKCard>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-rk-surface">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <SectionHeading>Cara Kerja Raksha</SectionHeading>
              <SectionSubheading>
                Proses triage yang sederhana namun powerful
              </SectionSubheading>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-rk-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-lg font-semibold text-rk-text mb-3">Jelaskan Gejala</h3>
                <p className="text-rk-subtle text-sm">
                  Masukkan gejala, usia, suhu, dan lokasi untuk analisis yang akurat.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-rk-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-lg font-semibold text-rk-text mb-3">AI Analysis</h3>
                <p className="text-rk-subtle text-sm">
                  AI menganalisis dengan konteks lokal, musiman, dan prioritas medis.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-rk-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-lg font-semibold text-rk-text mb-3">Dapatkan Hasil</h3>
                <p className="text-rk-subtle text-sm">
                  Terima penilaian risiko, alasan, dan panduan perawatan yang jelas.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-rk-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">4</span>
                </div>
                <h3 className="text-lg font-semibold text-rk-text mb-3">Tindak Lanjut</h3>
                <p className="text-rk-subtle text-sm">
                  Ikuti panduan atau cari bantuan medis sesuai rekomendasi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Triage Card */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <SectionHeading>Lihat Hasil Triage</SectionHeading>
              <SectionSubheading>
                Contoh hasil triage untuk berbagai tingkat risiko
              </SectionSubheading>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Emergency */}
              <RKCard elevated>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-rk-danger-50 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-rk-danger" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-rk-text">Emergency</h3>
                    <p className="text-sm text-rk-subtle">Skor: 95/100</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-sm text-rk-text">
                    <strong>Gejala:</strong> Sesak napas, nyeri dada
                  </div>
                  <div className="text-sm text-rk-subtle">
                    <strong>Rekomendasi:</strong> Segera ke IGD terdekat
                  </div>
                  <div className="text-sm text-rk-subtle">
                    <strong>Alasan:</strong> Gejala kardiovaskular memerlukan evaluasi darurat
                  </div>
                </div>
              </RKCard>

              {/* Consult */}
              <RKCard elevated>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-rk-warning-50 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-rk-warning" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-rk-text">Consult</h3>
                    <p className="text-sm text-rk-subtle">Skor: 65/100</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-sm text-rk-text">
                    <strong>Gejala:</strong> Demam 3 hari, mual
                  </div>
                  <div className="text-sm text-rk-subtle">
                    <strong>Rekomendasi:</strong> Konsultasi dokter dalam 24-48 jam
                  </div>
                  <div className="text-sm text-rk-subtle">
                    <strong>Alasan:</strong> Demam berkepanjangan memerlukan evaluasi
                  </div>
                </div>
              </RKCard>

              {/* Self Care */}
              <RKCard elevated>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-rk-accent-50 rounded-xl flex items-center justify-center">
                    <HeartPulse className="w-6 h-6 text-rk-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-rk-text">Self Care</h3>
                    <p className="text-sm text-rk-subtle">Skor: 25/100</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-sm text-rk-text">
                    <strong>Gejala:</strong> Batuk ringan, pilek
                  </div>
                  <div className="text-sm text-rk-subtle">
                    <strong>Rekomendasi:</strong> Istirahat, minum air putih
                  </div>
                  <div className="text-sm text-rk-subtle">
                    <strong>Alasan:</strong> Gejala ringan dapat diatasi dengan perawatan mandiri
                  </div>
                </div>
              </RKCard>
            </div>

            <div className="text-center mt-12">
              <RKButton size="lg" asChild>
                <Link href="/triage" className="flex items-center gap-2">
                  Coba Triage Sekarang
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </RKButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}