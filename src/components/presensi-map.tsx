import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet'
import { useQuery } from '@tanstack/react-query'
import { Office } from '@/types/office'
import { fetchOffices } from '@/services/officeServices'
import { UserLocation } from '@/types/location'
import { customIcon } from '@/lib/mapUtils'

export function PresensiMap({ userLocation }: { userLocation: UserLocation }) {
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
