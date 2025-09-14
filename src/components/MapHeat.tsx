'use client'

import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

interface MapHeatProps {
  data: Array<{
    region: string
    count: number
    lat?: number
    lng?: number
  }>
}

export function MapHeat({ data }: MapHeatProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm': {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm'
          }
        ]
      },
      center: [106.8456, -6.2088], // Jakarta
      zoom: 5
    })

    // Add markers for each region
    data.forEach((item) => {
      if (item.lat && item.lng) {
        const el = document.createElement('div')
        el.className = 'marker'
        el.style.width = '20px'
        el.style.height = '20px'
        el.style.borderRadius = '50%'
        el.style.backgroundColor = getColorByCount(item.count)
        el.style.border = '2px solid white'
        el.style.cursor = 'pointer'

        new maplibregl.Marker(el)
          .setLngLat([item.lng, item.lat])
          .setPopup(
            new maplibregl.Popup({ offset: 25 })
              .setHTML(`
                <div class="p-2">
                  <h3 class="font-semibold">${item.region}</h3>
                  <p class="text-sm">Laporan: ${item.count}</p>
                </div>
              `)
          )
          .addTo(map.current!)
      }
    })

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [data])

  const getColorByCount = (count: number) => {
    if (count >= 10) return '#ef4444' // red
    if (count >= 5) return '#f59e0b' // amber
    if (count >= 2) return '#eab308' // yellow
    return '#22c55e' // green
  }

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  )
}
