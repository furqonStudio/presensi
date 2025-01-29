'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Container } from '@/components/container'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Link from 'next/link'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

// Skema validasi dengan Zod
const formSchema = z.object({
  name: z.string().min(2, { message: 'Nama minimal 2 karakter.' }),
  position: z.string().min(2, { message: 'Jabatan minimal 2 karakter.' }),
  contact: z.string().min(10, { message: 'Kontak minimal 10 karakter.' }),
  officeId: z.string().min(1, { message: 'Harap pilih kantor yang valid.' }),
})

// Fungsi fetch data kantor
async function fetchOffices() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/offices`)
  if (!response.ok) {
    throw new Error('Failed to fetch offices')
  }
  return response.json()
}

// Fungsi menambahkan karyawan
async function addEmployee(data: any) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employees`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    throw new Error('Error adding employee')
  }

  return response.json()
}

export default function AddEmployeeForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedOfficeId, setSelectedOfficeId] = useState<string>('')

  // Fetch data kantor menggunakan React Query
  const {
    data: offices,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['offices'],
    queryFn: fetchOffices,
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      position: '',
      contact: '',
      officeId: '',
    },
  })

  const mutation = useMutation({
    mutationFn: addEmployee,
    onSuccess: () => {
      toast({
        title: 'Berhasil!',
        description: 'Karyawan berhasil ditambahkan.',
        variant: 'success',
      })
      router.push('/karyawan')
    },
    onError: () => {
      toast({
        title: 'Gagal!',
        description: 'Terjadi kesalahan saat menambahkan karyawan.',
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (data: any) => {
    console.log('🚀 ~ onSubmit ~ data:', data)
    mutation.mutate({
      ...data,
      officeId: Number(data.officeId),
    })
  }

  return (
    <Container>
      <h2 className="text-xl font-bold">Daftar Karyawan</h2>

      {isLoading && <p>Loading data kantor...</p>}
      {isError && <p>Gagal mengambil data kantor</p>}

      {!isLoading && !isError && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jabatan</FormLabel>
                  <FormControl>
                    <Input placeholder="Manager" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kontak</FormLabel>
                  <FormControl>
                    <Input placeholder="08123456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="officeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kantor</FormLabel>
                  <Select
                    value={selectedOfficeId}
                    onValueChange={(value) => {
                      setSelectedOfficeId(value)
                      form.setValue('officeId', value)
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kantor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {offices.map((office: any) => (
                        <SelectItem key={office.id} value={String(office.id)}>
                          {office.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <Button variant="secondary" className="w-full">
                <Link href="/karyawan">Batal</Link>
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
      )}
    </Container>
  )
}
