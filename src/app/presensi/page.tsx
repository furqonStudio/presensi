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

const formSchema = z.object({
  employeeId: z.string().min(3, { message: 'Employee ID minimal 3 karakter' }),
})

export default function PresensiPage() {
  const [location, setLocation] = useState({ lat: 0, lng: 0 })
  const { toast } = useToast()

  // Ambil lokasi saat pertama kali komponen dimuat
  useEffect(() => {
    getCurrentLocation()
  }, []) // 👈 Dependensi array kosong agar hanya dijalankan sekali

  // Fungsi untuk mengambil lokasi saat tombol ditekan
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

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { employeeId: '' },
  })

  const onSubmit = (data) => {
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
          <PresensiForm
            form={form}
            onSubmit={onSubmit}
            location={location}
            getCurrentLocation={getCurrentLocation}
          />
        </TabsContent>
        <TabsContent value="pulang">
          <PresensiForm
            form={form}
            onSubmit={onSubmit}
            location={location}
            getCurrentLocation={getCurrentLocation}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function PresensiForm({ form, onSubmit, location, getCurrentLocation }) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Input placeholder="Employee ID" {...form.register('employeeId')} />
      <Card>
        <CardContent>
          <PresensiMap userLocation={location} />
          <Button
            type="button"
            onClick={getCurrentLocation}
            className="mt-2 w-full"
          >
            Dapatkan Lokasi Sekarang
          </Button>
        </CardContent>
      </Card>
      <Button type="submit" className="w-full">
        Presensi
      </Button>
    </form>
  )
}
