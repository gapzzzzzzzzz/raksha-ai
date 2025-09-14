import Link from 'next/link'
import { HeartPulse, Wifi, Smartphone, MessageSquare } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    { href: '/privacy', label: 'Kebijakan Privasi' },
    { href: '/disclaimer', label: 'Disclaimer Medis' },
    { href: '/bot', label: 'Bot WhatsApp/SMS' },
  ]

  const features = [
    { icon: Wifi, label: 'PWA/Offline' },
    { icon: Smartphone, label: 'Low-Bandwidth' },
    { icon: MessageSquare, label: 'WA/SMS Stub' },
  ]

  return (
    <footer className="bg-rk-surface border-t border-rk-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-6 h-6 text-rk-primary" />
              <span className="text-lg font-display font-bold text-rk-text">
                Raksha
              </span>
            </div>
            <p className="text-rk-subtle text-sm">
              AI Health Triage 24/7 yang inklusif dan kontekstual untuk Indonesia.
            </p>
            <div className="flex flex-wrap gap-2">
              {features.map((feature) => (
                <div
                  key={feature.label}
                  className="rk-badge bg-rk-card text-rk-subtle flex items-center gap-1"
                >
                  <feature.icon className="w-3 h-3" />
                  {feature.label}
                </div>
              ))}
            </div>
          </div>

          {/* Links Section */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-rk-text">
              Informasi
            </h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-rk-subtle hover:text-rk-text transition-colors text-sm rk-focus"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer Section */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-rk-text">
              Penting
            </h3>
            <div className="text-rk-subtle text-sm space-y-2">
              <p>
                Raksha bukan perangkat medis. Hasil triage hanya sebagai panduan awal.
              </p>
              <p>
                Dalam keadaan darurat, segera hubungi 118/119 atau ke IGD terdekat.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-rk-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-rk-subtle text-sm">
              &copy; {currentYear} Raksha. Bukan perangkat medis. Konsultasikan dengan dokter untuk penanganan yang tepat.
            </p>
            <div className="flex items-center gap-4 text-rk-subtle text-sm">
              <span>Made with ❤️ for Indonesia</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
