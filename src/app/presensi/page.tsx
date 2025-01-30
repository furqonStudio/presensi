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
import { Map } from '@/components/map'

const formSchema = z.object({
  employeeId: z.string().min(3, { message: 'Employee ID minimal 3 karakter' }),
})

export default function PresensiPage() {
  const [location, setLocation] = useState({ lat: 0, lng: 0 })
  const { toast } = useToast()

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
      },
      () => {
        toast({
          title: 'Gagal mendapatkan lokasi',
          description: 'Pastikan GPS aktif dan beri izin lokasi.',
          variant: 'destructive',
        })
      },
    )
  }, [])

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
        <CardContent>
          <Map mode="presensi" initialCoordinates={location} />
        </CardContent>
      </Card>
      <Button type="submit" className="w-full">
        Presensi
      </Button>
    </form>
  )
}
