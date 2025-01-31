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
import {
  getCurrentLocation,
  getDistance,
  findNearestOffice,
} from '@/lib/locationUtils'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

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
    getCurrentLocation(setLocation, (errorMessage) => {
      toast({
        title: 'Gagal mendapatkan lokasi',
        description: errorMessage,
        variant: 'destructive',
      })
    })
  }, [])

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { employeeId: '' },
  })

  const onSubmit = (data) => {
    const nearestOffice = findNearestOffice(offices ?? [], location)
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="employeeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID Karyawan</FormLabel>
              <Input placeholder="Masukkan ID Karyawan" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />

        <Card>
          <PresensiMap userLocation={location} />
        </Card>

        <Button type="submit" className="w-full">
          Presensi
        </Button>
      </form>
    </Form>
  )
}
