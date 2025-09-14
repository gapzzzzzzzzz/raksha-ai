import { HeartPulse, AlertTriangle, Shield, FileText, Phone } from 'lucide-react'
import Link from 'next/link'

export default function DisclaimerPage() {
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
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/triage" className="text-gray-300 hover:text-white transition-colors">
              Triage
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Disclaimer Medis
            </h1>
            <p className="text-gray-300 text-lg">
              Informasi penting tentang penggunaan Raksha AI
            </p>
          </div>

          {/* Emergency Notice */}
          <div className="bg-red-900/50 border-2 border-red-500 p-8 rounded-2xl mb-8">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-red-400" />
              <h2 className="text-2xl font-bold text-red-400">PEMBERITAHUAN DARURAT</h2>
            </div>
            <div className="text-red-200 space-y-2">
              <p className="text-lg font-semibold">
                Jika Anda mengalami gejala darurat seperti:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Nyeri dada yang parah</li>
                <li>Sesak napas yang berat</li>
                <li>Pendarahan yang tidak terkontrol</li>
                <li>Kehilangan kesadaran</li>
                <li>Gejala stroke atau serangan jantung</li>
              </ul>
              <p className="text-lg font-bold mt-4">
                🚨 SEGERA HUBUNGI 118/119 ATAU DATANG KE IGD TERDEKAT! 🚨
              </p>
            </div>
          </div>

          {/* Main Disclaimer */}
          <div className="space-y-8">
            <div className="bg-gray-900 p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-6 h-6 text-amber-500" />
                <h2 className="text-2xl font-bold text-white">Disclaimer Utama</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Bukan Perangkat Medis</h3>
                  <p className="text-gray-300">
                    Raksha AI adalah alat bantu triage yang menggunakan kecerdasan buatan. 
                    <strong className="text-white"> Ini BUKAN perangkat medis</strong> dan tidak dimaksudkan 
                    untuk menggantikan konsultasi medis profesional, diagnosis, atau pengobatan.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Bukan Diagnosis Medis</h3>
                  <p className="text-gray-300">
                    Hasil triage yang diberikan oleh Raksha AI adalah <strong className="text-white">panduan awal</strong> 
                    berdasarkan gejala yang dijelaskan. Ini bukan diagnosis medis yang definitif. 
                    Selalu konsultasikan dengan dokter atau tenaga medis profesional untuk diagnosis dan pengobatan yang tepat.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Akurasi Terbatas</h3>
                  <p className="text-gray-300">
                    Meskipun kami berusaha memberikan triage yang akurat, algoritma AI memiliki keterbatasan. 
                    Hasil dapat bervariasi tergantung pada kelengkapan dan keakuratan informasi yang diberikan. 
                    Gejala yang tidak dijelaskan atau salah dijelaskan dapat mempengaruhi hasil triage.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-green-500" />
                <h2 className="text-2xl font-bold text-white">Tanggung Jawab Pengguna</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Informasi yang Akurat</h3>
                  <p className="text-gray-300">
                    Pengguna bertanggung jawab untuk memberikan informasi gejala yang akurat dan lengkap. 
                    Informasi yang tidak akurat dapat menyebabkan triage yang salah.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Keputusan Medis</h3>
                  <p className="text-gray-300">
                    Keputusan akhir tentang perawatan medis tetap berada di tangan pengguna dan dokter. 
                    Raksha AI hanya memberikan panduan dan tidak bertanggung jawab atas keputusan medis yang diambil.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Kondisi Darurat</h3>
                  <p className="text-gray-300">
                    Dalam situasi darurat, jangan bergantung pada Raksha AI. 
                    Segera cari pertolongan medis profesional atau hubungi layanan darurat.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                <h2 className="text-2xl font-bold text-white">Pembatasan Tanggung Jawab</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Tidak Ada Jaminan</h3>
                  <p className="text-gray-300">
                    Raksha AI disediakan &quot;sebagaimana adanya&quot; tanpa jaminan apapun. 
                    Kami tidak menjamin keakuratan, kelengkapan, atau kesesuaian hasil triage untuk kebutuhan spesifik Anda.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Kerugian</h3>
                  <p className="text-gray-300">
                    Raksha AI dan pengembangnya tidak bertanggung jawab atas kerugian langsung, tidak langsung, 
                    insidental, atau konsekuensial yang timbul dari penggunaan aplikasi ini.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Perubahan Gejala</h3>
                  <p className="text-gray-300">
                    Jika gejala memburuk atau muncul gejala baru setelah menggunakan Raksha AI, 
                    segera konsultasikan dengan dokter atau cari pertolongan medis.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Phone className="w-6 h-6 text-blue-500" />
                <h2 className="text-2xl font-bold text-white">Kapan Harus Mencari Bantuan Medis</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Segera ke Dokter Jika:</h3>
                  <ul className="text-gray-300 space-y-1 list-disc list-inside">
                    <li>Gejala memburuk atau tidak membaik dalam 2-3 hari</li>
                    <li>Muncul gejala baru yang mengkhawatirkan</li>
                    <li>Demam tinggi (≥39°C) yang tidak turun dengan obat</li>
                    <li>Kesulitan bernapas atau nyeri dada</li>
                    <li>Muntah atau diare yang parah</li>
                    <li>Ruam yang menyebar atau memburuk</li>
                    <li>Gejala pada bayi, anak-anak, atau lansia</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Hubungi Layanan Darurat (118/119) Jika:</h3>
                  <ul className="text-gray-300 space-y-1 list-disc list-inside">
                    <li>Nyeri dada yang parah</li>
                    <li>Sesak napas yang berat</li>
                    <li>Kehilangan kesadaran</li>
                    <li>Pendarahan yang tidak terkontrol</li>
                    <li>Gejala stroke atau serangan jantung</li>
                    <li>Reaksi alergi yang parah</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 p-8 rounded-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">Kontak Darurat</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-900/30 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-red-400 mb-2">Layanan Darurat</h3>
                  <p className="text-red-200 text-2xl font-bold">118 / 119</p>
                  <p className="text-red-300 text-sm">24 jam, 7 hari seminggu</p>
                </div>
                
                <div className="bg-blue-900/30 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">Hotline Kesehatan</h3>
                  <p className="text-blue-200 text-2xl font-bold">119</p>
                  <p className="text-blue-300 text-sm">Konsultasi kesehatan darurat</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 p-8 rounded-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">Persetujuan</h2>
              <p className="text-gray-300">
                Dengan menggunakan Raksha AI, Anda menyatakan bahwa Anda telah membaca, memahami, 
                dan menyetujui disclaimer medis ini. Anda memahami bahwa Raksha AI adalah alat bantu 
                dan bukan pengganti konsultasi medis profesional.
              </p>
              <p className="text-gray-300 mt-4">
                <strong className="text-white">Tanggal terakhir diperbarui:</strong> {new Date().toLocaleDateString('id-ID')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
