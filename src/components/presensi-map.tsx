import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet'

export const kantorLocations = [
  { lat: -6.2, lng: 106.816, name: 'Kantor Pusat' },
  { lat: -6.202, lng: 106.819, name: 'Cabang A' },
  { lat: -6.96981512720424, lng: 109.520950913429, name: 'Kwigaran' },
]

// Komponen untuk memperbarui posisi peta ke lokasi pengguna
function RecenterMap({ location }) {
  const map = useMap()
  useEffect(() => {
    if (location?.lat && location?.lng) {
      map.setView([location.lat, location.lng], 16) // Zoom level 16
    }
  }, [location, map])
  return null
}

export function PresensiMap({ userLocation }) {
  return (
    <MapContainer
      center={[userLocation.lat, userLocation.lng]}
      zoom={16}
      className="h-[300px] w-full rounded-lg"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <RecenterMap location={userLocation} />

      {/* Tampilkan lokasi kantor dengan radius 30m */}
      {kantorLocations.map((kantor, index) => (
        <>
          <Marker key={`marker-${index}`} position={[kantor.lat, kantor.lng]} />
          <Circle
            key={`circle-${index}`}
            center={[kantor.lat, kantor.lng]}
            radius={30}
            color="blue"
          />
        </>
      ))}

      {/* Tampilkan lokasi pengguna */}
      {userLocation?.lat && userLocation?.lng && (
        <>
          <Marker position={[userLocation.lat, userLocation.lng]} />
          <Circle
            center={[userLocation.lat, userLocation.lng]}
            radius={10}
            color="red"
          />
        </>
      )}
    </MapContainer>
  )
}
