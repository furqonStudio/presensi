'use client'
import { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { PresensiMap } from '@/components/presensi-map'
import { useQuery } from '@tanstack/react-query'
import { Office } from '@/types/office'
import { fetchOffices } from '@/services/officeServices'

const formSchema = z.object({
  employeeId: z.string().min(3, { message: 'Employee ID minimal 3 karakter' }),
})

export default function PresensiPage() {
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 })
  const { toast } = useToast()

  const {
    data: offices,
    isLoading,
    isError,
    error,
  } = useQuery<Office[], Error>({
    queryKey: ['offices'],
    queryFn: fetchOffices,
  })

  useEffect(() => {
    getCurrentLocation()
  }, [])

  const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          })
          toast({
            title: 'Lokasi berhasil diperbarui!',
            description: `Lokasi sekarang: ${pos.coords.latitude}, ${pos.coords.longitude}`,
          })
        },
        (error) => {
          toast({
            title: 'Gagal mendapatkan lokasi',
            description: 'Pastikan GPS aktif dan beri izin lokasi.',
            variant: 'destructive',
          })
          console.error('Error mendapatkan lokasi:', error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      )
    } else {
      toast({
        title: 'Geolocation tidak tersedia',
        description: 'Browser tidak mendukung fitur lokasi.',
        variant: 'destructive',
      })
    }
  }

  const getDistance = (lat1, lon1, lat2, lon2) => {
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

  const findNearestOffice = () => {
    if (!offices || offices.length === 0) return null

    return offices.reduce(
      (nearest, office) => {
        const distance = getDistance(
          location.latitude,
          location.longitude,
          office.latitude,
          office.longitude,
        )
        return distance < nearest.distance ? { office, distance } : nearest
      },
      {
        office: offices[0],
        distance: getDistance(
          location.latitude,
          location.longitude,
          offices[0].latitude,
          offices[0].longitude,
        ),
      },
    ).office
  }

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { employeeId: '' },
  })

  const onSubmit = (data) => {
    const nearestOffice = findNearestOffice()
    if (!nearestOffice) {
      toast({
        title: 'Gagal menemukan kantor',
        description: 'Pastikan data kantor tersedia.',
        variant: 'destructive',
      })
      return
    }

    const distance = getDistance(
      location.latitude,
      location.longitude,
      nearestOffice.latitude,
      nearestOffice.longitude,
    )

    if (distance > 30) {
      toast({
        title: 'Lokasi terlalu jauh',
        description: `Anda berada ${distance.toFixed(2)} meter dari kantor terdekat (${nearestOffice.name}).`,
        variant: 'destructive',
      })
      return
    }

    console.log('Presensi:', { ...data, location })
    toast({
      title: 'Presensi Berhasil!',
      description: `Lokasi: ${location.latitude}, ${location.longitude}`,
    })
  }

  if (isLoading) return <div>Loading...</div>
  if (isError && error instanceof Error)
    return <div>Error: {error.message}</div>

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="masuk" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="masuk">Masuk</TabsTrigger>
          <TabsTrigger value="pulang">Pulang</TabsTrigger>
        </TabsList>
        <TabsContent value="masuk">
          <PresensiForm form={form} onSubmit={onSubmit} location={location} />
        </TabsContent>
        <TabsContent value="pulang">
          <PresensiForm form={form} onSubmit={onSubmit} location={location} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function PresensiForm({ form, onSubmit, location }) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Input placeholder="Employee ID" {...form.register('employeeId')} />
      <Card>
        <PresensiMap userLocation={location} />
      </Card>
      <Button type="submit" className="w-full">
        Presensi
      </Button>
    </form>
  )
}
