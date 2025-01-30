import { useState, useEffect } from 'react'
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
  mode = 'view', // 'select', 'view', atau 'presensi'
}: {
  initialCoordinates?: [number, number]
  onCoordinateSelect?: (lat: number, lng: number) => void
  mode?: 'select' | 'view' | 'presensi' // Menambahkan mode presensi
}) {
  const [position, setPosition] = useState<[number, number]>(initialCoordinates)
  const [userPosition, setUserPosition] = useState<[number, number] | null>(
    null,
  )

  // Menambahkan lokasi kantor untuk radius presensi
  const officeCoordinates = [-6.2088, 106.8456] // Misalnya lokasi kantor

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

    return (
      <>
        {position && (
          <Marker position={position} icon={customIcon}>
            <Popup>
              Koordinat: {position[0]}, {position[1]}
            </Popup>
          </Marker>
        )}

        {userPosition && (
          <Marker position={userPosition} icon={customIcon}>
            <Popup>
              Lokasi Pengguna: {userPosition[0]}, {userPosition[1]}
            </Popup>
          </Marker>
        )}

        {mode === 'presensi' && userPosition && (
          <Circle
            center={officeCoordinates} // Pusat lingkaran di lokasi kantor
            radius={50} // Radius dalam meter
            color="green" // Warna garis lingkaran
            fillColor="green" // Warna isi lingkaran
            fillOpacity={0.3} // Opasitas warna isi lingkaran
          />
        )}
      </>
    )
  }

  // Mengambil lokasi pengguna jika mode 'presensi'
  useEffect(() => {
    if (mode === 'presensi' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          console.error('Error getting user location:', error)
        },
      )
    }
  }, [mode])

  return (
    <MapContainer
      center={position}
      zoom={mode === 'view' || 'presensi' ? 30 : 15} // Zoom berbeda antara mode 'view' dan 'select'
      style={{ height: '300px', width: '100%' }}
      scrollWheelZoom={true} // Mengaktifkan zoom scroll
      dragging={mode === 'view'} // Menonaktifkan drag map di mode 'view'
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker />
    </MapContainer>
  )
}
