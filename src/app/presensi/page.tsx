'use client'
import { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { PresensiMap } from '@/components/presensi-map'

const kantorLocation = {
  lat: -6.96981512720424,
  lng: 109.520950913429,
  name: 'Kwigaran',
}

const formSchema = z.object({
  employeeId: z.string().min(3, { message: 'Employee ID minimal 3 karakter' }),
})

export default function PresensiPage() {
  const [location, setLocation] = useState({ lat: 0, lng: 0 })
  const { toast } = useToast()

  useEffect(() => {
    getCurrentLocation()
  }, [])

  const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
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
    const distance = R * c

    return distance
  }

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { employeeId: '' },
  })

  const onSubmit = (data) => {
    // Cek apakah jarak lebih dari 30 meter
    const distance = getDistance(
      location.lat,
      location.lng,
      kantorLocation.lat,
      kantorLocation.lng,
    )

    if (distance > 30) {
      toast({
        title: 'Lokasi terlalu jauh',
        description: `Anda berada ${distance.toFixed(2)} meter dari kantor. Pastikan Anda berada dalam radius 30 meter.`,
        variant: 'destructive',
      })
      return
    }

    console.log('Presensi:', { ...data, location })
    toast({
      title: 'Presensi Berhasil!',
      description: `Lokasi: ${location.lat}, ${location.lng}`,
    })
  }

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
