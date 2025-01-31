import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useQuery } from '@tanstack/react-query'
import { Office } from '@/types/office'
import { fetchOffices } from '@/services/officeServices'

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
})

export function PresensiMap({ userLocation }) {
  const {
    data: offices,
    isLoading,
    isError,
    error,
  } = useQuery<Office[], Error>({
    queryKey: ['offices'],
    queryFn: fetchOffices,
  })

  if (isLoading) return <div>Loading...</div>
  if (isError && error instanceof Error)
    return <div>Error: {error.message}</div>

  return (
    <MapContainer
      center={[userLocation.lat, userLocation.lng]}
      zoom={16}
      className="h-[300px] w-full rounded-lg"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {offices?.map((office, index) => (
        <>
          <Circle
            key={`circle-${index}`}
            center={[office.latitude, office.longitude]}
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
