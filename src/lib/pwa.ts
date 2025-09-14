'use client'

export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })
    })
  }
}

export function installPWA() {
  if (typeof window !== 'undefined') {
    let deferredPrompt: Event | null = null

    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later
      deferredPrompt = e
      // Show install button or notification
      showInstallPrompt()
    })

    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed')
      deferredPrompt = null
    })

    function showInstallPrompt() {
      // You can show a custom install button here
      // For now, we'll just log that the prompt is available
      console.log('PWA install prompt available')
    }

    return {
      install: () => {
        if (deferredPrompt) {
          ;(deferredPrompt as any).prompt()
          ;(deferredPrompt as any).userChoice.then((choiceResult: { outcome: string }) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('User accepted the install prompt')
            } else {
              console.log('User dismissed the install prompt')
            }
            deferredPrompt = null
          })
        }
      }
    }
  }
}

export function checkOnlineStatus() {
  if (typeof window !== 'undefined') {
    return {
      isOnline: navigator.onLine,
      addOnlineListener: (callback: () => void) => {
        window.addEventListener('online', callback)
      },
      addOfflineListener: (callback: () => void) => {
        window.addEventListener('offline', callback)
      }
    }
  }
  return { isOnline: true, addOnlineListener: () => {}, addOfflineListener: () => {} }
}
