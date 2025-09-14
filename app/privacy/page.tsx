import { HeartPulse, Shield, Eye, Lock, Database } from 'lucide-react'

export default function PrivacyPage() {
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
            <a href="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </a>
            <a href="/triage" className="text-gray-300 hover:text-white transition-colors">
              Triage
            </a>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Kebijakan Privasi
            </h1>
            <p className="text-gray-300 text-lg">
              Komitmen kami untuk melindungi privasi dan data Anda
            </p>
          </div>

          {/* Privacy Principles */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-gray-900 p-6 rounded-2xl text-center">
              <Shield className="w-8 h-8 text-sky-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Minimal Data</h3>
              <p className="text-gray-300 text-sm">
                Hanya mengumpulkan data yang diperlukan untuk triage
              </p>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-2xl text-center">
              <Eye className="w-8 h-8 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Transparansi</h3>
              <p className="text-gray-300 text-sm">
                Jelas tentang data apa yang dikumpulkan dan digunakan
              </p>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-2xl text-center">
              <Lock className="w-8 h-8 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Anonimisasi</h3>
              <p className="text-gray-300 text-sm">
                Semua data laporan dianonimkan untuk melindungi identitas
              </p>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-2xl text-center">
              <Database className="w-8 h-8 text-purple-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Kontrol Data</h3>
              <p className="text-gray-300 text-sm">
                Anda memiliki kontrol penuh atas data yang dibagikan
              </p>
            </div>
          </div>

          {/* Privacy Details */}
          <div className="space-y-8">
            <div className="bg-gray-900 p-8 rounded-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">Data yang Kami Kumpulkan</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Data Triage</h3>
                  <ul className="text-gray-300 space-y-1">
                    <li>• Gejala yang dijelaskan (teks)</li>
                    <li>• Usia (opsional)</li>
                    <li>• Suhu tubuh (opsional)</li>
                    <li>• Durasi demam (opsional)</li>
                    <li>• Wilayah/provinsi (opsional)</li>
                    <li>• Bulan (untuk konteks musiman)</li>
                    <li>• Gejala darurat (opsional)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Data yang TIDAK Kami Kumpulkan</h3>
                  <ul className="text-gray-300 space-y-1">
                    <li>• Nama lengkap</li>
                    <li>• Nomor telepon</li>
                    <li>• Alamat lengkap</li>
                    <li>• Nomor KTP/NIK</li>
                    <li>• Email</li>
                    <li>• Informasi medis pribadi lainnya</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 p-8 rounded-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">Penggunaan Data</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Tujuan Utama</h3>
                  <ul className="text-gray-300 space-y-1">
                    <li>• Memberikan triage kesehatan yang akurat</li>
                    <li>• Menyediakan panduan perawatan yang sesuai</li>
                    <li>• Meningkatkan akurasi melalui pembelajaran pola</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Data Anonim (dengan persetujuan)</h3>
                  <ul className="text-gray-300 space-y-1">
                    <li>• Analisis tren kesehatan regional</li>
                    <li>• Pemantauan wabah penyakit</li>
                    <li>• Peningkatan algoritma triage</li>
                    <li>• Penelitian kesehatan masyarakat</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 p-8 rounded-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">Keamanan Data</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Langkah Keamanan</h3>
                  <ul className="text-gray-300 space-y-1">
                    <li>• Enkripsi data dalam transit dan penyimpanan</li>
                    <li>• Akses terbatas hanya untuk personel yang berwenang</li>
                    <li>• Audit keamanan berkala</li>
                    <li>• Backup data yang aman</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Retensi Data</h3>
                  <ul className="text-gray-300 space-y-1">
                    <li>• Data triage individual: tidak disimpan</li>
                    <li>• Data anonim: maksimal 2 tahun</li>
                    <li>• Data dapat dihapus sesuai permintaan</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 p-8 rounded-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">Hak Anda</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Kontrol Data</h3>
                  <ul className="text-gray-300 space-y-1">
                    <li>• Memilih untuk tidak membagikan data anonim</li>
                    <li>• Meminta penghapusan data yang tersimpan</li>
                    <li>• Mengakses data yang tersimpan tentang Anda</li>
                    <li>• Memperbarui atau mengoreksi data</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Kontak</h3>
                  <p className="text-gray-300">
                    Untuk pertanyaan tentang privasi atau untuk menggunakan hak Anda, 
                    silakan hubungi kami melalui email: privacy@raksha-ai.com
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 p-8 rounded-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">Perubahan Kebijakan</h2>
              <p className="text-gray-300">
                Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. 
                Perubahan signifikan akan diberitahukan melalui website atau email. 
                Tanggal terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
