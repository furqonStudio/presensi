'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIconShadow from 'leaflet/dist/images/marker-shadow.png'

interface MapProps {
  onCoordinateSelect: (lat: number, lng: number) => void
}

const MapPicker = ({ onCoordinateSelect }: MapProps) => {
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)

  // Fix default icon issue
  const DefaultIcon = L.icon({
    iconUrl: markerIcon.src,
    shadowUrl: markerIconShadow.src,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    shadowSize: [41, 41],
  })

  L.Marker.prototype.options.icon = DefaultIcon

  useEffect(() => {
    // Inisialisasi peta
    const leafletMap = L.map('map').setView([-6.2088, 106.8456], 13) // Set view ke Jakarta

    // Tambahkan tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(leafletMap)

    // Tambahkan event listener untuk klik peta
    leafletMap.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng

      // Hapus marker sebelumnya (jika ada)
      if (markerRef.current) {
        leafletMap.removeLayer(markerRef.current)
      }

      // Tambahkan marker baru
      markerRef.current = L.marker([lat, lng]).addTo(leafletMap)

      // Panggil callback untuk mengirim koordinat ke form
      onCoordinateSelect(lat, lng)
    })

    mapRef.current = leafletMap

    // Bersihkan peta saat komponen di-unmount
    return () => {
      leafletMap.remove()
    }
  }, [onCoordinateSelect])

  return <div id="map" style={{ height: '400px', width: '100%' }} />
}

export default MapPicker
