'use client'

import { useState } from 'react'
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
import { useRouter } from 'next/navigation'

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

// Fungsi menambahkan kantor
async function addOffice(data: any) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/offices`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    throw new Error('Error adding office')
  }

  return response.json()
}

export default function AddOfficeForm() {
  const router = useRouter()
  const { toast } = useToast()

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

  const mutation = useMutation({
    mutationFn: addOffice,
    onSuccess: () => {
      toast({
        title: 'Berhasil!',
        description: 'Kantor berhasil ditambahkan.',
        variant: 'success',
      })
      router.push('/offices') // Sesuaikan dengan rute daftar kantor Anda
    },
    onError: () => {
      toast({
        title: 'Gagal!',
        description: 'Terjadi kesalahan saat menambahkan kantor.',
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (data: any) => {
    mutation.mutate(data)
  }

  return (
    <Container>
      <h2 className="text-xl font-bold">Tambah Kantor</h2>

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
                  <Input placeholder="Latitude" type="number" {...field} />
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
                  <Input placeholder="Longitude" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => router.push('/offices')} // Sesuaikan dengan rute yang diinginkan
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Loading...' : 'Tambah'}
            </Button>
          </div>
        </form>
      </Form>
    </Container>
  )
}
