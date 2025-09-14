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
    <nav className="sticky top-0 z-50 bg-rk-bg/95 backdrop-blur-sm border-b border-rk-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 rk-focus">
            <div className="relative">
              <HeartPulse className="w-8 h-8 text-rk-primary" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-rk-accent rounded-full animate-pulse-slow" />
            </div>
            <span className="text-xl font-display font-bold text-rk-text">
              Raksha
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-rk-subtle hover:text-rk-text transition-colors rk-focus"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/triage"
              className="rk-button-primary flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              Mulai Triage
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rk-focus"
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
          <div className="md:hidden border-t border-rk-border">
            <div className="py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-2 text-rk-subtle hover:text-rk-text hover:bg-rk-surface rounded-lg transition-colors rk-focus"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="px-4 pt-2">
                <Link
                  href="/triage"
                  className="rk-button-primary w-full flex items-center justify-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Activity className="w-4 h-4" />
                  Mulai Triage
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
