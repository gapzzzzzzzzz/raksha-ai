'use client'

import { useEffect } from 'react'
import { registerServiceWorker, installPWA } from '@/lib/pwa'

interface PWAProviderProps {
  children: React.ReactNode
}

export function PWAProvider({ children }: PWAProviderProps) {
  useEffect(() => {
    // Register service worker
    registerServiceWorker()
    
    // Setup PWA install prompt
    installPWA()
  }, [])

  return <>{children}</>
}
