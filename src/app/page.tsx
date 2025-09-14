import Link from "next/link"
import { HeartPulse, Activity, AlertTriangle, MapPin, Smartphone, Wifi } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-8 h-8 text-sky-500" />
            <span className="text-2xl font-bold text-white">Raksha AI</span>
          </div>
          <div className="flex gap-4">
            <Link href="/triage" className="text-gray-300 hover:text-white transition-colors">
              Triage
            </Link>
            <Link href="/lite" className="text-gray-300 hover:text-white transition-colors">
              Lite
            </Link>
            <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            AI Health Triage
            <span className="text-sky-500"> 24/7</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Triage kesehatan berbasis AI yang inklusif dan kontekstual untuk Indonesia
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full">
              <Wifi className="w-4 h-4" />
              <span className="text-sm">PWA/Offline</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full">
              <Smartphone className="w-4 h-4" />
              <span className="text-sm">Low-Bandwidth</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">WA/SMS Bot</span>
            </div>
          </div>

          <Link 
            href="/triage"
            className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-colors"
          >
            <Activity className="w-5 h-5" />
            Mulai Triage
          </Link>
        </div>
      </section>

      {/* Problem Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Masalah yang Kami Pecahkan</h2>
          <p className="text-gray-300 text-lg">
            Akses layanan kesehatan yang terbatas, terutama di daerah terpencil, 
            membuat banyak orang kesulitan mendapatkan triage kesehatan yang cepat dan akurat.
          </p>
        </div>
      </section>

      {/* Solution Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Solusi Kami</h2>
          <p className="text-gray-300 text-lg">
            Raksha AI menyediakan triage kesehatan 24/7 yang dapat diakses melalui web, 
            PWA, atau bot WhatsApp/SMS dengan prioritas musiman dan konteks regional Indonesia.
          </p>
        </div>
      </section>

      {/* Differentiators Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Keunggulan Kami</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-6 rounded-2xl">
              <MapPin className="w-8 h-8 text-sky-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Prioritas Musiman</h3>
              <p className="text-gray-300">
                Mempertimbangkan musim dan wilayah untuk meningkatkan akurasi triage, 
                seperti risiko DBD di musim hujan.
              </p>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-2xl">
              <Wifi className="w-8 h-8 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Mode Low-Bandwidth</h3>
              <p className="text-gray-300">
                PWA yang dapat berjalan offline dan mode teks-only untuk akses 
                di jaringan yang terbatas.
              </p>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-2xl">
              <HeartPulse className="w-8 h-8 text-amber-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Triage + Edukasi</h3>
              <p className="text-gray-300">
                Tidak hanya triage, tetapi juga memberikan panduan perawatan 
                yang disesuaikan dengan tingkat risiko.
              </p>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-2xl">
              <AlertTriangle className="w-8 h-8 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Triage yang Dapat Dijelaskan</h3>
              <p className="text-gray-300">
                Menjelaskan alasan penilaian risiko dan gejala apa yang memicu 
                tingkat tertentu.
              </p>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-2xl">
              <Activity className="w-8 h-8 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Mode Kesehatan Komunitas</h3>
              <p className="text-gray-300">
                Heatmap tren wabah dari laporan anonim untuk membantu 
                pemantauan kesehatan masyarakat.
              </p>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-2xl">
              <Smartphone className="w-8 h-8 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Bot WhatsApp/SMS</h3>
              <p className="text-gray-300">
                Akses triage melalui pesan teks untuk pengguna yang lebih 
                nyaman dengan komunikasi sederhana.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy & Safety Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Privasi & Keamanan</h2>
          <p className="text-gray-300 text-lg mb-8">
            Kami memprioritaskan privasi Anda. Data pribadi tidak disimpan, 
            dan semua laporan dianonimkan untuk melindungi identitas.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/privacy"
              className="text-sky-400 hover:text-sky-300 transition-colors"
            >
              Kebijakan Privasi
            </Link>
            <span className="text-gray-500">•</span>
            <Link 
              href="/disclaimer"
              className="text-sky-400 hover:text-sky-300 transition-colors"
            >
              Disclaimer Medis
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-800">
        <div className="text-center text-gray-400">
          <p>&copy; 2024 Raksha AI. Bukan perangkat medis. Konsultasikan dengan dokter untuk penanganan yang tepat.</p>
        </div>
      </footer>
    </div>
  )
}