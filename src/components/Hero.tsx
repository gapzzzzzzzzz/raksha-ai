import Link from 'next/link'
import { Activity, Smartphone, Wifi, MessageSquare, Shield, HeartPulse, CheckCircle, Clock, Users } from 'lucide-react'

export function Hero() {
  const trustFeatures = [
    { icon: Wifi, label: 'PWA/Offline', description: 'Bekerja tanpa internet' },
    { icon: Smartphone, label: 'Low-Bandwidth', description: 'Akses cepat di jaringan lemah' },
    { icon: MessageSquare, label: 'WA/SMS Bot', description: 'Triage via pesan teks' },
  ]

  const stats = [
    { icon: Users, value: '24/7', label: 'Tersedia' },
    { icon: Clock, value: '< 30s', label: 'Hasil Triage' },
    { icon: CheckCircle, value: '100%', label: 'Gratis' },
  ]

  return (
    <section className="relative bg-white">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-rk-primary-50/30 via-white to-rk-accent-50/30" />
      
      <div className="container mx-auto px-4 py-20 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-rk-primary-50 text-rk-primary px-4 py-2 rounded-full text-sm font-medium">
              <Shield className="w-4 h-4" />
              Triage Kesehatan AI Terpercaya
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-rk-text leading-tight">
                AI Health Triage{' '}
                <span className="text-rk-primary">
                  24/7
                </span>
              </h1>
              <p className="text-xl text-rk-subtle leading-relaxed max-w-2xl">
                Triage kesehatan berbasis AI yang inklusif dan kontekstual untuk Indonesia. 
                Dapatkan panduan kesehatan yang akurat dan dapat diandalkan.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 py-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 bg-rk-primary-50 rounded-xl flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-rk-primary" />
                  </div>
                  <div className="text-2xl font-bold text-rk-text">{stat.value}</div>
                  <div className="text-sm text-rk-subtle">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/triage"
                className="rk-button rk-button-primary rk-button-lg flex items-center justify-center gap-2 group"
              >
                <Activity className="w-5 h-5" />
                Mulai Triage Sekarang
              </Link>
              <Link
                href="/lite"
                className="rk-button rk-button-secondary rk-button-lg flex items-center justify-center gap-2"
              >
                <Smartphone className="w-5 h-5" />
                Mode Lite
              </Link>
            </div>

            {/* Trust Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
              {trustFeatures.map((feature) => (
                <div
                  key={feature.label}
                  className="rk-card p-4 text-center group hover:border-rk-primary/50 transition-all duration-200"
                >
                  <div className="w-12 h-12 mx-auto mb-3 bg-rk-primary-50 rounded-xl flex items-center justify-center group-hover:bg-rk-primary-50 transition-colors">
                    <feature.icon className="w-6 h-6 text-rk-primary" />
                  </div>
                  <h3 className="font-semibold text-rk-text text-sm mb-1">
                    {feature.label}
                  </h3>
                  <p className="text-rk-subtle text-xs">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Illustration */}
          <div className="relative">
            <div className="relative w-full h-96 lg:h-[500px]">
              {/* Main Card */}
              <div className="absolute inset-0 rk-card-elevated">
                <div className="h-full flex flex-col items-center justify-center p-8">
                  {/* Heart Icon */}
                  <div className="w-24 h-24 bg-gradient-to-br from-rk-primary to-rk-primary-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <HeartPulse className="w-12 h-12 text-white" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-rk-text mb-4 text-center">
                    Triage AI
                  </h3>
                  
                  {/* Features List */}
                  <div className="space-y-3 w-full max-w-xs">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-rk-accent rounded-full"></div>
                      <span className="text-rk-text">Analisis gejala real-time</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-rk-warn rounded-full"></div>
                      <span className="text-rk-text">Konteks musiman Indonesia</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-rk-primary rounded-full"></div>
                      <span className="text-rk-text">Penjelasan yang jelas</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 rk-card p-3 shadow-lg">
                <Shield className="w-6 h-6 text-rk-accent" />
              </div>
              <div className="absolute -bottom-4 -left-4 rk-card p-3 shadow-lg">
                <Activity className="w-6 h-6 text-rk-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
