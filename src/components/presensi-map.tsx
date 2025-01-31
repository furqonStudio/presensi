import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'

export const kantorLocations = [
  { lat: -6.2, lng: 106.816, name: 'Kantor Pusat' },
  { lat: -6.202, lng: 106.819, name: 'Cabang A' },
  { lat: -6.96981512720424, lng: 109.520950913429, name: 'Kwigaran' },
]

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
})

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

      {kantorLocations.map((kantor, index) => (
        <>
          <Circle
            key={`circle-${index}`}
            center={[kantor.lat, kantor.lng]}
            radius={30}
            color="blue"
          />
        </>
      ))}

      {userLocation?.lat && userLocation?.lng && (
        <>
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={customIcon}
          />
        </>
      )}
    </MapContainer>
  )
}
