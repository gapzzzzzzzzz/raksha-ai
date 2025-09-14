import { HeartPulse, MessageSquare, Phone, Send } from 'lucide-react'

export default function BotPage() {
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
              Bot WhatsApp & SMS
            </h1>
            <p className="text-gray-300 text-lg">
              Akses triage kesehatan melalui pesan teks yang sederhana
            </p>
          </div>

          {/* How it works */}
          <div className="bg-gray-900 p-8 rounded-2xl mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Cara Kerja</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-sky-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">1. Kirim Pesan</h3>
                <p className="text-gray-300 text-sm">
                  Kirim gejala yang dialami melalui WhatsApp atau SMS
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HeartPulse className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">2. AI Menganalisis</h3>
                <p className="text-gray-300 text-sm">
                  AI menganalisis gejala dan memberikan triage
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">3. Dapatkan Panduan</h3>
                <p className="text-gray-300 text-sm">
                  Terima panduan perawatan yang disesuaikan
                </p>
              </div>
            </div>
          </div>

          {/* Demo */}
          <div className="bg-gray-900 p-8 rounded-2xl mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Demo API</h2>
            <p className="text-gray-300 mb-6">
              Coba API bot dengan mengirim pesan simulasi:
            </p>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Contoh Request:</h3>
              <pre className="bg-gray-950 p-4 rounded text-sm text-gray-300 overflow-x-auto">
{`POST /api/bot/mock
Content-Type: application/json

{
  "phone": "+6281234567890",
  "message": "Demam tinggi, sakit kepala, mual"
}`}
              </pre>
              
              <h3 className="text-lg font-semibold text-white mb-4 mt-6">Contoh Response:</h3>
              <pre className="bg-gray-950 p-4 rounded text-sm text-gray-300 overflow-x-auto">
{`{
  "success": true,
  "response": "🏥 *Raksha AI - Hasil Triage*\\n\\n📊 *Tingkat Risiko:* CONSULT\\n📈 *Skor:* 65/100\\n\\n🔍 *Alasan:*\\n• Gejala perlu konsultasi: demam tinggi\\n\\n💡 *Saran:*\\n• Kunjungi Puskesmas atau dokter dalam 24 jam\\n• Minum air putih yang cukup (8-10 gelas/hari)\\n• Catat suhu tubuh 2 kali sehari\\n• Istirahat yang cukup\\n• Jika gejala memburuk, segera ke IGD\\n\\n⚠️ *PENTING:* Ini bukan diagnosis medis...",
  "riskLevel": "CONSULT",
  "score": 65
}`}
              </pre>
            </div>
          </div>

          {/* Integration Guide */}
          <div className="bg-gray-900 p-8 rounded-2xl mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Panduan Integrasi</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">1. Setup Twilio</h3>
                <p className="text-gray-300 mb-3">
                  Daftar di Twilio dan dapatkan credentials:
                </p>
                <ul className="text-gray-300 text-sm space-y-1 ml-4">
                  <li>• Account SID</li>
                  <li>• Auth Token</li>
                  <li>• Phone Number</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">2. Environment Variables</h3>
                <pre className="bg-gray-950 p-4 rounded text-sm text-gray-300 overflow-x-auto">
{`TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_phone_number`}
                </pre>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">3. Webhook Setup</h3>
                <p className="text-gray-300 text-sm">
                  Set webhook URL di Twilio console untuk menerima pesan masuk dan 
                  mengirim response menggunakan API /api/bot/mock
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-gray-900 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Fitur Bot</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-sky-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-white">Multi-Platform</h3>
                    <p className="text-gray-300 text-sm">
                      Mendukung WhatsApp dan SMS melalui Twilio
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-white">Bahasa Indonesia</h3>
                    <p className="text-gray-300 text-sm">
                      Memahami gejala dalam bahasa Indonesia
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <HeartPulse className="w-5 h-5 text-amber-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-white">Triage Akurat</h3>
                    <p className="text-gray-300 text-sm">
                      Menggunakan engine triage yang sama dengan web app
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Send className="w-5 h-5 text-purple-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-white">Response Cepat</h3>
                    <p className="text-gray-300 text-sm">
                      Memberikan hasil triage dalam hitungan detik
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
