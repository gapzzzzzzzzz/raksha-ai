const CACHE_NAME = 'raksha-v1'
const STATIC_CACHE = 'raksha-static-v1'
const DYNAMIC_CACHE = 'raksha-dynamic-v1'

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/lite',
  '/triage',
  '/privacy',
  '/disclaimer',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
]

// Install event - cache static files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(STATIC_FILES)
      })
      .then(() => {
        return self.skipWaiting()
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        return self.clients.claim()
      })
  )
})

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses
          if (response.ok) {
            const responseClone = response.clone()
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseClone)
              })
          }
          return response
        })
        .catch(() => {
          // Return cached response if available
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse
              }
              // Return offline response for triage API
              if (url.pathname === '/api/triage') {
                return new Response(
                  JSON.stringify({
                    level: 'CONSULT',
                    score: 60,
                    reasons: ['Mode offline - konsultasi dengan dokter disarankan'],
                    microEducation: [
                      'Konsultasikan dengan dokter untuk penanganan yang tepat',
                      'Jika gejala memburuk, segera ke IGD',
                      'Minum air putih yang cukup',
                      'Istirahat yang cukup'
                    ],
                    seasonalContext: 'Mode offline - konteks musiman tidak tersedia'
                  }),
                  {
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  }
                )
              }
              return new Response('Offline', { status: 503 })
            })
        })
    )
    return
  }

  // Handle page requests
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse
        }

        return fetch(request)
          .then((response) => {
            // Cache successful responses
            if (response.ok) {
              const responseClone = response.clone()
              caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                  cache.put(request, responseClone)
                })
            }
            return response
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (request.headers.get('accept').includes('text/html')) {
              return caches.match('/lite')
            }
            return new Response('Offline', { status: 503 })
          })
      })
  )
})

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'triage-submission') {
    event.waitUntil(
      // Handle offline form submissions when back online
      handleOfflineSubmissions()
    )
  }
})

async function handleOfflineSubmissions() {
  // This would handle queued form submissions when back online
  // For now, we'll just log that sync occurred
  console.log('Background sync: handling offline submissions')
}
