// utils/locationUtils.ts
export const getCurrentLocation = (
  onSuccess: (location: { latitude: number; longitude: number }) => void,
  onError: (message: string) => void,
) => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onSuccess({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        })
      },
      () => {
        onError('Pastikan GPS aktif dan beri izin lokasi.')
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )
  } else {
    onError('Browser tidak mendukung fitur lokasi.')
  }
}

export const getDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371000
  const phi1 = (lat1 * Math.PI) / 180
  const phi2 = (lat2 * Math.PI) / 180
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export const findNearestOffice = (
  offices: any[],
  userLocation: { latitude: number; longitude: number },
) => {
  if (!offices || offices.length === 0) return null

  return offices.reduce(
    (nearest, office) => {
      const distance = getDistance(
        userLocation.latitude,
        userLocation.longitude,
        office.latitude,
        office.longitude,
      )
      return distance < nearest.distance ? { office, distance } : nearest
    },
    {
      office: offices[0],
      distance: getDistance(
        userLocation.latitude,
        userLocation.longitude,
        offices[0].latitude,
        offices[0].longitude,
      ),
    },
  ).office
}
