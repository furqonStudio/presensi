'use client'

import { useState, useEffect } from 'react'
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
import { useRouter, useSearchParams } from 'next/navigation'

const formSchema = z.object({
  name: z.string().min(2, { message: 'Nama minimal 2 karakter.' }),
  position: z.string().min(2, { message: 'Jabatan minimal 2 karakter.' }),
  contact: z.string().min(10, { message: 'Kontak minimal 10 karakter.' }),
  officeId: z.string().min(1, { message: 'Harap pilih kantor yang valid.' }),
})

async function fetchOffices() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/offices`)
  if (!response.ok) {
    throw new Error('Failed to fetch offices')
  }
  return response.json()
}

async function fetchEmployee(id: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/employees/${id}`,
  )
  if (!response.ok) {
    throw new Error('Failed to fetch employee')
  }
  return response.json()
}

async function updateEmployee(id: string, data: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/employees/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    },
  )

  if (!response.ok) {
    throw new Error('Error updating employee')
  }
  return response.json()
}

export default function EditEmployeeForm() {
  const router = useRouter()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const employeeId = searchParams.get('id')

  const { data: employee, isLoading: isEmployeeLoading } = useQuery({
    queryKey: ['employee', employeeId],
    queryFn: () => fetchEmployee(employeeId!),
    enabled: !!employeeId,
  })

  // Fetch the offices
  const {
    data: offices,
    isLoading: isOfficesLoading,
    isError: isOfficesError,
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

  useEffect(() => {
    if (employee) {
      console.log('🚀 ~ useEffect ~ employee:', employee)
      form.reset({
        name: employee.name,
        position: employee.position,
        contact: employee.contact,
        officeId: employee.officeId ? String(employee.officeId) : '',
      })
    }
  }, [employee, form])

  const mutation = useMutation({
    mutationFn: (data: any) => updateEmployee(employeeId!, data),
    onSuccess: () => {
      toast({
        title: 'Berhasil!',
        description: 'Karyawan berhasil diperbarui.',
        variant: 'success',
      })
      router.push('/karyawan')
    },
    onError: () => {
      toast({
        title: 'Gagal!',
        description: 'Terjadi kesalahan saat memperbarui karyawan.',
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (data: any) => {
    mutation.mutate({
      ...data,
      officeId: Number(data.officeId),
    })
  }

  if (isEmployeeLoading || isOfficesLoading) return <p>Loading...</p>
  if (isOfficesError) return <p>Failed to load offices</p>

  return (
    <Container>
      <h2 className="text-xl font-bold">Edit Karyawan</h2>
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
                  onValueChange={(value) => field.onChange(value)} // Tetap kirim nilai string
                  value={field.value ? String(field.value) : ''}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kantor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {offices.map((office) => (
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
            <Link href="/karyawan" className="w-full">
              <Button variant={'secondary'} className="w-full" type="button">
                Batal
              </Button>
            </Link>
            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Loading...' : 'Simpan Perubahan'}
            </Button>
          </div>
        </form>
      </Form>
    </Container>
  )
}
