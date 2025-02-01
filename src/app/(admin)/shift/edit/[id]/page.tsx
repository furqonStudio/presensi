'use client'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { useToast } from '@/hooks/use-toast'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { formatClockTimes, parseClockTimes } from '@/lib/dateTimeUtils'

const formSchema = z.object({
  name: z.string().min(2, { message: 'Nama shift minimal 2 karakter.' }),
  clockIn: z.string().refine((val) => /\d{2}:\d{2}/.test(val), {
    message: 'Format waktu mulai tidak valid (gunakan format HH:mm).',
  }),
  clockOut: z.string().refine((val) => /\d{2}:\d{2}/.test(val), {
    message: 'Format waktu selesai tidak valid (gunakan format HH:mm).',
  }),
})

async function fetchShift(id: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/shifts/${id}`,
  )
  if (!response.ok) {
    throw new Error('Error fetching shift data')
  }
  return response.json()
}

async function updateShift(id: string, data: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/shifts/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    },
  )
  if (!response.ok) {
    throw new Error('Error updating shift')
  }
  return response.json()
}

export default function EditShiftForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { id } = useParams()

  const [shift, setShift] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadShift = async () => {
      try {
        const shiftData = await fetchShift(id)
        const formattedShift = parseClockTimes(shiftData)
        setShift(formattedShift)
        setLoading(false)
      } catch (error) {
        setError(error.message)
        setLoading(false)
      }
    }

    loadShift()
  }, [id])

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      clockIn: '',
      clockOut: '',
    },
  })

  useEffect(() => {
    if (shift) {
      form.reset({
        name: shift.name,
        clockIn: shift.clockIn,
        clockOut: shift.clockOut,
      })
    }
  }, [shift, form])

  const onSubmit = (data: any) => {
    const formatedData = formatClockTimes(data)
    updateShift(id, formatedData)
      .then(() => {
        toast({
          title: 'Berhasil!',
          description: 'Shift berhasil diperbarui.',
          variant: 'default',
        })
        router.push('/shift')
      })
      .catch(() => {
        toast({
          title: 'Gagal!',
          description: 'Terjadi kesalahan saat memperbarui shift.',
          variant: 'destructive',
        })
      })
  }

  return (
    <Container>
      <h2 className="text-xl font-bold">Edit Shift</h2>

      {loading ? <p>Loading data...</p> : null}
      {error ? <p>Gagal mengambil data shift.</p> : null}

      {!loading && !error && (
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
              <Link href="/shift" className="w-full">
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
