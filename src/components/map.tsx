import { useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  Circle, // Impor Circle untuk menggambar radius
} from 'react-leaflet'
import L from 'leaflet'

export function Map({
  initialCoordinates = [-6.2088, 106.8456], // Default ke Jakarta
  onCoordinateSelect,
  mode = 'view', // 'select' atau 'view'
}: {
  initialCoordinates?: [number, number]
  onCoordinateSelect?: (lat: number, lng: number) => void
  mode?: 'select' | 'view' // Mode untuk menentukan apakah memilih koordinat atau hanya melihat
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

  // Menangani event klik peta untuk memilih koordinat baru jika mode 'select'
  function LocationMarker() {
    useMapEvents({
      click(e) {
        if (mode === 'select') {
          const { lat, lng } = e.latlng
          setPosition([lat, lng]) // Memperbarui posisi berdasarkan klik
          if (onCoordinateSelect) onCoordinateSelect(lat, lng) // Memanggil callback jika ada
        }
      },
    })

    return position ? (
      <>
        <Marker position={position} icon={customIcon}>
          <Popup>
            Koordinat: {position[0]}, {position[1]}
          </Popup>
        </Marker>

        <Circle
          center={position} // Pusat lingkaran di posisi marker
          radius={30} // Radius dalam meter
          color="blue" // Warna garis lingkaran
          fillColor="blue" // Warna isi lingkaran
          fillOpacity={0.3} // Opasitas warna isi lingkaran
        />
      </>
    ) : null
  }

  return (
    <MapContainer
      center={position}
      zoom={mode === 'view' ? 30 : 15} // Zoom berbeda antara mode 'view' dan 'select'
      style={{ height: '300px', width: '100%' }}
      scrollWheelZoom={true} // Mengaktifkan zoom scroll
      dragging={mode === 'view'} // Menonaktifkan drag map di mode 'view'
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker />
    </MapContainer>
  )
}
