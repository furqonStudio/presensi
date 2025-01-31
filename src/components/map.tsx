import { useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  Circle,
} from 'react-leaflet'
import L from 'leaflet'

export function Map({
  initialCoordinates = [-6.2088, 106.8456],
  onCoordinateSelect,
  mode = 'view',
}: {
  initialCoordinates?: [number, number]
  onCoordinateSelect?: (lat: number, lng: number) => void
  mode?: 'select' | 'view'
}) {
  const [position, setPosition] = useState<[number, number]>(initialCoordinates)

  const customIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
  })

  function LocationMarker() {
    useMapEvents({
      click(e) {
        if (mode === 'select') {
          const { lat, lng } = e.latlng
          setPosition([lat, lng])
          if (onCoordinateSelect) onCoordinateSelect(lat, lng)
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
          center={position}
          radius={30}
          color="blue"
          fillColor="blue"
          fillOpacity={0.3}
        />
      </>
    ) : null
  }

  return (
    <MapContainer
      center={position}
      zoom={mode === 'view' ? 30 : 15}
      className="z-0 h-[300px] w-full rounded-lg"
      scrollWheelZoom={true}
      dragging={mode === 'view'}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker />
    </MapContainer>
  )
}
