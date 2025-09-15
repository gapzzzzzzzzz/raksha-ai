'use client'

import Link from 'next/link'
import { useState } from 'react'
import { HeartPulse, Menu, X, Activity } from 'lucide-react'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/triage', label: 'Triage' },
    { href: '/lite', label: 'Lite' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/privacy', label: 'Privacy' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-rk-bg/95 backdrop-blur-sm border-b border-rk-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 rk-focus">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-rk-primary to-rk-primary-600 rounded-xl flex items-center justify-center">
                <HeartPulse className="w-6 h-6 text-white" />
              </div>
            </div>
            <span className="text-2xl font-display font-bold text-rk-text">
              Raksha
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-rk-subtle hover:text-rk-primary transition-colors rk-focus font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/triage"
              className="rk-button rk-button-primary flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              Start Triage
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rk-focus rounded-lg hover:bg-rk-surface transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-rk-text" />
            ) : (
              <Menu className="w-6 h-6 text-rk-text" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-rk-border bg-rk-bg">
            <div className="py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-3 text-rk-subtle hover:text-rk-primary hover:bg-rk-surface rounded-lg transition-colors rk-focus font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="px-4 pt-4">
                <Link
                  href="/triage"
                  className="rk-button rk-button-primary w-full flex items-center justify-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Activity className="w-4 h-4" />
                  Start Triage
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
