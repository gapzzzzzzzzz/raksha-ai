import Link from 'next/link'
import { Activity, Smartphone, Wifi, MessageSquare, MapPin, HeartPulse } from 'lucide-react'

export function Hero() {
  const trustFeatures = [
    { icon: Wifi, label: 'PWA/Offline', description: 'Bekerja tanpa internet' },
    { icon: Smartphone, label: 'Low-Bandwidth', description: 'Akses cepat di jaringan lemah' },
    { icon: MessageSquare, label: 'WA/SMS Bot', description: 'Triage via pesan teks' },
  ]

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-rk-bg via-rk-surface to-rk-bg">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%231F2937%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
      
      <div className="container mx-auto px-4 py-24 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-rk-text leading-tight">
                AI Health Triage{' '}
                <span className="bg-gradient-to-r from-rk-primary to-rk-accent bg-clip-text text-transparent">
                  24/7
                </span>
              </h1>
              <p className="text-xl text-rk-subtle leading-relaxed">
                Triage kesehatan berbasis AI yang inklusif dan kontekstual untuk Indonesia.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/triage"
                className="rk-button-primary text-lg px-8 py-4 flex items-center justify-center gap-2 group"
              >
                <Activity className="w-5 h-5 group-hover:animate-pulse" />
                Mulai Triage
              </Link>
              <Link
                href="/lite"
                className="rk-button-secondary text-lg px-8 py-4 flex items-center justify-center gap-2"
              >
                <Smartphone className="w-5 h-5" />
                Coba Mode Lite
              </Link>
            </div>

            {/* Trust Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
              {trustFeatures.map((feature) => (
                <div
                  key={feature.label}
                  className="rk-card p-4 text-center group hover:border-rk-primary/50 transition-colors"
                >
                  <div className="w-12 h-12 mx-auto mb-3 bg-rk-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-rk-primary/20 transition-colors">
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
              {/* Indonesia Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-rk-primary/20 to-rk-accent/20 rounded-3xl" />
              
              {/* Shield with Heart Pulse */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Shield */}
                  <div className="w-48 h-56 bg-gradient-to-b from-rk-primary to-rk-primary-600 rounded-t-3xl rounded-b-xl shadow-2xl flex items-center justify-center">
                    <HeartPulse className="w-16 h-16 text-white animate-pulse-slow" />
                  </div>
                  
                  {/* Pulse Rings */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 border-2 border-rk-primary/30 rounded-full animate-ping" />
                    <div className="absolute w-80 h-80 border border-rk-accent/20 rounded-full animate-pulse-slow" />
                  </div>
                  
                  {/* Map Pins */}
                  <div className="absolute top-8 left-8 w-3 h-3 bg-rk-accent rounded-full animate-pulse" />
                  <div className="absolute top-16 right-12 w-2 h-2 bg-rk-warn rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <div className="absolute bottom-20 left-16 w-2 h-2 bg-rk-danger rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute top-4 right-4 rk-card p-3">
                <MapPin className="w-5 h-5 text-rk-primary" />
              </div>
              <div className="absolute bottom-4 left-4 rk-card p-3">
                <Activity className="w-5 h-5 text-rk-accent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
