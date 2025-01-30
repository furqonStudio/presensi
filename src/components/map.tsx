'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIconShadow from 'leaflet/dist/images/marker-shadow.png'

interface MapProps {
  latitude?: number
  longitude?: number
  onCoordinateSelect?: (lat: number, lng: number) => void // Opsional, untuk kasus klik peta
}

const Map = ({ latitude = 0, longitude = 0, onCoordinateSelect }: MapProps) => {
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    // Fix default icon issue
    const DefaultIcon = L.icon({
      iconUrl: markerIcon.src,
      shadowUrl: markerIconShadow.src,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      shadowSize: [41, 41],
    })

    L.Marker.prototype.options.icon = DefaultIcon

    // Inisialisasi peta
    const leafletMap = L.map('map').setView([latitude, longitude], 13)

    // Tambahkan tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(leafletMap)

    // Tambahkan marker jika koordinat tersedia
    if (latitude !== 0 || longitude !== 0) {
      markerRef.current = L.marker([latitude, longitude]).addTo(leafletMap)
    }

    // Jika ada callback untuk klik peta
    if (onCoordinateSelect) {
      leafletMap.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng

        // Hapus marker sebelumnya (jika ada)
        if (markerRef.current) {
          leafletMap.removeLayer(markerRef.current)
        }

        // Tambahkan marker baru
        markerRef.current = L.marker([lat, lng]).addTo(leafletMap)

        // Panggil callback
        onCoordinateSelect(lat, lng)
      })
    }

    mapRef.current = leafletMap

    // Bersihkan peta saat komponen di-unmount
    return () => {
      leafletMap.remove()
    }
  }, [latitude, longitude, onCoordinateSelect])

  return <div id="map" style={{ height: '400px', width: '100%' }} />
}

export default Map
