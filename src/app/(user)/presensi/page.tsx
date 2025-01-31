'use client'

import { PresensiMap } from '@/components/presensi-map'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { getCurrentLocation } from '@/lib/locationUtils'
import { createAttendance } from '@/services/attendanceServices'
import { updateClockOut } from '@/services/attendanceServices'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  employeeId: z.string().min(3, { message: 'Employee ID minimal 3 karakter' }),
})

export default function PresensiPage() {
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 })
  const { toast } = useToast()

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

  const clockInMutation = useMutation({
    mutationFn: ({ employeeId, latitude, longitude }) =>
      createAttendance({ employeeId, latitude, longitude }),
    onSuccess: () => {
      toast({
        title: 'Presensi Berhasil!',
        description: 'Anda berhasil melakukan presensi masuk.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Gagal melakukan presensi',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const clockOutMutation = useMutation({
    mutationFn: ({ employeeId, latitude, longitude }) =>
      updateClockOut({ employeeId, latitude, longitude }),
    onSuccess: () => {
      toast({
        title: 'Presensi Pulang Berhasil!',
        description: 'Anda berhasil melakukan presensi pulang.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Gagal melakukan presensi pulang',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (data, type: 'masuk' | 'pulang') => {
    const mutation = type === 'masuk' ? clockInMutation : clockOutMutation

    mutation.mutate({
      ...data,
      latitude: location.latitude,
      longitude: location.longitude,
    })
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 p-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-center text-3xl font-bold">Presensi App</h1>
        <p className="max-w-sm text-center text-sm text-muted-foreground">
          Silahkan masukkan ID karyawan dan pastikan berada di radius kantor
          maks. 30 meter.
        </p>
      </div>
      <Tabs defaultValue="masuk" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="masuk">Masuk</TabsTrigger>
          <TabsTrigger value="pulang">Pulang</TabsTrigger>
        </TabsList>
        <TabsContent value="masuk">
          <PresensiForm
            form={form}
            onSubmit={(data) => onSubmit(data, 'masuk')}
            location={location}
            mutation={clockInMutation}
          />
        </TabsContent>
        <TabsContent value="pulang">
          <PresensiForm
            form={form}
            onSubmit={(data) => onSubmit(data, 'pulang')}
            location={location}
            mutation={clockOutMutation}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function PresensiForm({ form, onSubmit, location, mutation }) {
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

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? 'Loading...' : 'Presensi'}
        </Button>
      </form>
    </Form>
  )
}
