import { useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export function Map({
  initialCoordinates = [-6.2088, 106.8456], // Default ke Jakarta
  onCoordinateSelect,
}: {
  initialCoordinates?: [number, number]
  onCoordinateSelect?: (lat: number, lng: number) => void
}) {
  const [position, setPosition] = useState<[number, number]>(initialCoordinates)

  // Membuat ikon marker kustom
  const customIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
  })

  // Menangani event klik peta untuk memilih koordinat baru
  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng
        setPosition([lat, lng]) // Memperbarui posisi berdasarkan klik
        if (onCoordinateSelect) onCoordinateSelect(lat, lng) // Memanggil callback jika ada
      },
    })

    return position ? (
      <Marker position={position} icon={customIcon}>
        <Popup>
          Koordinat: {position[0]}, {position[1]}
        </Popup>
      </Marker>
    ) : null
  }

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: '300px', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker />
    </MapContainer>
  )
}
