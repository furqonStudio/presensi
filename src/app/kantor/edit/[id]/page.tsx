'use client'

import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Container } from '@/components/container'
import { useMutation } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { useRouter, useParams } from 'next/navigation'
import { Map } from '@/components/map'
import Link from 'next/link'

// Skema validasi dengan Zod
const formSchema = z.object({
  name: z.string().min(2, { message: 'Nama kantor minimal 2 karakter.' }),
  address: z.string().min(5, { message: 'Alamat minimal 5 karakter.' }),
  description: z
    .string()
    .min(5, { message: 'Deskripsi kantor minimal 5 karakter.' }),
  latitude: z
    .number()
    .refine((val) => !isNaN(val), { message: 'Latitude harus berupa angka.' }),
  longitude: z
    .number()
    .refine((val) => !isNaN(val), { message: 'Longitude harus berupa angka.' }),
})

// Fungsi mengambil data kantor
async function fetchOffice(id: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/offices/${id}`,
  )
  if (!response.ok) {
    throw new Error('Error fetching office data')
  }
  return response.json()
}

// Fungsi memperbarui kantor
async function updateOffice(id: string, data: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/offices/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    },
  )
  if (!response.ok) {
    throw new Error('Error updating office')
  }
  return response.json()
}

export default function EditOfficeForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { id } = useParams()

  const [office, setOffice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [initialCoordinates, setInitialCoordinates] = useState<
    [number, number]
  >([
    0,
    0, // Koordinat default
  ])

  useEffect(() => {
    const loadOffice = async () => {
      try {
        const officeData = await fetchOffice(id)
        setOffice(officeData)
        setInitialCoordinates([officeData.latitude, officeData.longitude])
        setLoading(false)
      } catch (error) {
        setError(error.message)
        setLoading(false)
      }
    }

    loadOffice()
  }, [id])

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      address: '',
      description: '',
      latitude: 0,
      longitude: 0,
    },
  })

  useEffect(() => {
    if (office) {
      form.reset({
        name: office.name,
        address: office.address,
        description: office.description,
        latitude: office.latitude,
        longitude: office.longitude,
      })
    }
  }, [office, form])

  const onSubmit = (data: any) => {
    const transformedData = {
      ...data,
      latitude: parseFloat(data.latitude) || 0,
      longitude: parseFloat(data.longitude) || 0,
    }

    updateOffice(id, transformedData)
      .then(() => {
        toast({
          title: 'Berhasil!',
          description: 'Kantor berhasil diperbarui.',
          variant: 'success',
        })
        router.push('/kantor')
      })
      .catch(() => {
        toast({
          title: 'Gagal!',
          description: 'Terjadi kesalahan saat memperbarui kantor.',
          variant: 'destructive',
        })
      })
  }

  const handleCoordinateSelect = (lat: number, lng: number) => {
    form.setValue('latitude', lat)
    form.setValue('longitude', lng)
  }

  return (
    <Container>
      <h2 className="text-xl font-bold">Edit Kantor</h2>

      {loading ? <p>Loading data...</p> : null}
      {error ? <p>Gagal mengambil data kantor.</p> : null}

      {!loading && !error && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Kantor</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama Kantor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat</FormLabel>
                  <FormControl>
                    <Input placeholder="Alamat kantor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Input placeholder="Deskripsi kantor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Latitude</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Latitude"
                      type="number"
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => {
                        const value = e.target.value
                        field.onChange(value ? parseFloat(value) || 0 : 0)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Longitude"
                      type="number"
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => {
                        const value = e.target.value
                        field.onChange(value ? parseFloat(value) || 0 : 0)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Map
              mode="select"
              onCoordinateSelect={handleCoordinateSelect}
              initialCoordinates={initialCoordinates}
            />

            <div className="flex gap-2">
              <Link href="/kantor" className="w-full">
                <Button variant={'secondary'} className="w-full" type="button">
                  Batal
                </Button>
              </Link>
              <Button type="submit" className="w-full">
                Simpan
              </Button>
            </div>
          </form>
        </Form>
      )}
    </Container>
  )
}
