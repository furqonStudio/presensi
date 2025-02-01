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
import { formatClockTimes } from '@/lib/dateTimeUtils'

// Skema validasi dengan Zod untuk Shift
const formSchema = z.object({
  name: z.string().min(2, { message: 'Nama shift minimal 2 karakter.' }),
  clockIn: z.string().refine((val) => /\d{2}:\d{2}/.test(val), {
    message: 'Format waktu mulai tidak valid (gunakan format HH:mm).',
  }),
  clockOut: z.string().refine((val) => /\d{2}:\d{2}/.test(val), {
    message: 'Format waktu selesai tidak valid (gunakan format HH:mm).',
  }),
})

// Fungsi untuk menambahkan shift
async function addShift(data: any) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shifts`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    throw new Error('Error adding shift')
  }

  return response.json()
}

export default function AddShiftForm() {
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      clockIn: '',
      clockOut: '',
    },
  })

  const mutation = useMutation({
    mutationFn: addShift,
    onSuccess: () => {
      toast({
        title: 'Berhasil!',
        description: 'Shift berhasil ditambahkan.',
        variant: 'default',
      })
      router.push('/shift') // Sesuaikan dengan rute daftar shift Anda
    },
    onError: () => {
      toast({
        title: 'Gagal!',
        description: 'Terjadi kesalahan saat menambahkan shift.',
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (data: any) => {
    const shiftData = formatClockTimes(data)

    mutation.mutate(shiftData)
  }

  return (
    <Container>
      <h2 className="text-xl font-bold">Tambah Shift</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Shift</FormLabel>
                <FormControl>
                  <Input placeholder="Nama Shift" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="clockIn"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Waktu Mulai</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} className="flex flex-col" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clockOut"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Waktu Selesai</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} className="flex flex-col" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => router.push('/shift')} // Sesuaikan dengan rute yang diinginkan
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
