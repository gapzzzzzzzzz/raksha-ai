import Link from 'next/link'
import { Hero } from '@/components/Hero'
import { 
  MapPin, 
  Wifi, 
  HeartPulse, 
  AlertTriangle, 
  Activity, 
  Smartphone,
  Users,
  Globe,
  Clock,
  Shield,
  BookOpen,
  BarChart3
} from 'lucide-react'

export default function Home() {
  const problems = [
    {
      icon: Users,
      title: "RS Penuh Sesak",
      description: "Antrian panjang di rumah sakit membuat akses kesehatan sulit, terutama di daerah terpencil."
    },
    {
      icon: Globe,
      title: "Bias Barat",
      description: "Sistem triage yang ada tidak mempertimbangkan konteks lokal dan musiman Indonesia."
    },
    {
      icon: MapPin,
      title: "Kesenjangan Akses",
      description: "Masyarakat di daerah terpencil kesulitan mendapatkan panduan kesehatan yang cepat dan akurat."
    }
  ]

  const differentiators = [
    {
      icon: MapPin,
      title: "Prioritas Lokal",
      description: "Mempertimbangkan musim dan wilayah untuk meningkatkan akurasi triage, seperti risiko DBD di musim hujan.",
      color: "text-rk-primary"
    },
    {
      icon: Wifi,
      title: "Low-Bandwidth",
      description: "PWA yang dapat berjalan offline dan mode teks-only untuk akses di jaringan yang terbatas.",
      color: "text-rk-accent"
    },
    {
      icon: AlertTriangle,
      title: "Triage Dapat Dijelaskan",
      description: "Menjelaskan alasan penilaian risiko dan gejala apa yang memicu tingkat tertentu.",
      color: "text-rk-warn"
    },
    {
      icon: BookOpen,
      title: "Micro-Education",
      description: "Tidak hanya triage, tetapi juga memberikan panduan perawatan yang disesuaikan dengan tingkat risiko.",
      color: "text-rk-primary"
    },
    {
      icon: BarChart3,
      title: "Heatmap Komunitas",
      description: "Heatmap tren wabah dari laporan anonim untuk membantu pemantauan kesehatan masyarakat.",
      color: "text-rk-accent"
    }
  ]

  const workflow = [
    {
      step: "1",
      title: "Input Gejala",
      description: "Masukkan gejala, usia, suhu, dan lokasi melalui form yang mudah digunakan atau pesan teks.",
      icon: Activity
    },
    {
      step: "2",
      title: "Engine AI",
      description: "Algoritma menganalisis gejala dengan mempertimbangkan prioritas musiman dan konteks regional.",
      icon: HeartPulse
    },
    {
      step: "3",
      title: "Hasil Triage",
      description: "Mendapatkan tingkat risiko (Emergency/Consult/Self-care) dengan penjelasan yang jelas.",
      icon: Shield
    },
    {
      step: "4",
      title: "Tren Komunitas",
      description: "Data anonim berkontribusi pada heatmap kesehatan masyarakat untuk pemantauan wabah.",
      icon: BarChart3
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Problem Section */}
      <section className="py-24 bg-rk-surface">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-rk-text mb-6">
              Masalah yang Kami Pecahkan
            </h2>
            <p className="text-xl text-rk-subtle max-w-3xl mx-auto">
              Akses layanan kesehatan yang terbatas, terutama di daerah terpencil, 
              membuat banyak orang kesulitan mendapatkan triage kesehatan yang cepat dan akurat.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {problems.map((problem, index) => (
              <div key={index} className="rk-card p-8 text-center group hover:border-rk-primary/50 transition-colors">
                <div className="w-16 h-16 mx-auto mb-6 bg-rk-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-rk-primary/20 transition-colors">
                  <problem.icon className="w-8 h-8 text-rk-primary" />
                </div>
                <h3 className="text-xl font-display font-semibold text-rk-text mb-4">
                  {problem.title}
                </h3>
                <p className="text-rk-subtle leading-relaxed">
                  {problem.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Differentiators Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-rk-text mb-6">
              Apa yang Membuat Raksha Beda?
            </h2>
            <p className="text-xl text-rk-subtle max-w-3xl mx-auto">
              Solusi inovatif yang menggabungkan teknologi AI dengan pemahaman mendalam tentang konteks kesehatan Indonesia.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {differentiators.map((item, index) => (
              <div key={index} className="rk-card p-8 group hover:border-rk-primary/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-rk-surface rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-semibold text-rk-text mb-2">
                      {item.title}
                    </h3>
                    <p className="text-rk-subtle text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-24 bg-rk-surface">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-rk-text mb-6">
              Cara Kerja
            </h2>
            <p className="text-xl text-rk-subtle max-w-3xl mx-auto">
              Proses sederhana yang memberikan hasil triage yang akurat dan dapat diandalkan.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workflow.map((step, index) => (
              <div key={index} className="relative">
                <div className="rk-card p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-rk-primary to-rk-accent rounded-2xl flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-rk-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-display font-semibold text-rk-text mb-3">
                    {step.title}
                  </h3>
                  <p className="text-rk-subtle text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
                
                {/* Connector Line */}
                {index < workflow.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-rk-border transform -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-rk-text mb-6">
              Lihat Hasil Triage
            </h2>
            <p className="text-xl text-rk-subtle max-w-3xl mx-auto">
              Contoh hasil triage yang menunjukkan tingkat risiko dan penjelasan yang jelas.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="rk-card p-8">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Emergency Example */}
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-rk-danger rounded-2xl flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-rk-danger mb-2">EMERGENCY</h3>
                  <p className="text-sm text-rk-subtle">Segera ke IGD</p>
                </div>
                
                {/* Consult Example */}
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-rk-warn rounded-2xl flex items-center justify-center">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-rk-warn mb-2">CONSULT</h3>
                  <p className="text-sm text-rk-subtle">Konsultasi dalam 24 jam</p>
                </div>
                
                {/* Self-care Example */}
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-rk-accent rounded-2xl flex items-center justify-center">
                    <HeartPulse className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-rk-accent mb-2">SELF-CARE</h3>
                  <p className="text-sm text-rk-subtle">Perawatan di rumah</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-rk-primary to-rk-accent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
            Siap Mencoba Raksha?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Mulai triage kesehatan Anda sekarang dan dapatkan panduan yang tepat untuk kondisi Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/triage"
              className="bg-white text-rk-primary hover:bg-gray-100 px-8 py-4 rounded-2xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Activity className="w-5 h-5" />
              Mulai Triage
            </Link>
            <Link
              href="/lite"
              className="border-2 border-white text-white hover:bg-white hover:text-rk-primary px-8 py-4 rounded-2xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Smartphone className="w-5 h-5" />
              Mode Lite
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}