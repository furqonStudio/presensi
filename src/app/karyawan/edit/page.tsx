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

const offices = [
  { id: 1, name: 'Kantor A' },
  { id: 2, name: 'Kantor B' },
]

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  position: z
    .string()
    .min(2, { message: 'Position must be at least 2 characters.' }),
  contact: z
    .string()
    .min(10, { message: 'Contact must be at least 10 characters.' }),
  officeId: z.number().min(1, { message: 'Please select a valid office.' }),
})

async function fetchEmployee(id) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/employees/${id}`,
  )
  if (!response.ok) {
    throw new Error('Failed to fetch employee')
  }
  return response.json()
}

async function updateEmployee(id, data) {
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

  const { data: employee, isLoading } = useQuery({
    queryKey: ['employee', employeeId],
    queryFn: () => fetchEmployee(employeeId),
    enabled: !!employeeId,
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
      form.reset({
        name: employee.name,
        position: employee.position,
        contact: employee.contact,
        officeId: employee.officeId ? String(employee.officeId) : '', // Pastikan bukan undefined/null
      })
    }
  }, [employee, form])

  const mutation = useMutation({
    mutationFn: (data) => updateEmployee(employeeId, data),
    onSuccess: () => {
      toast({
        title: 'Berhasil!',
        description: 'Karyawan berhasil diperbarui.',
        variant: 'default',
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

  const onSubmit = (data) => {
    mutation.mutate(data)
  }

  if (isLoading) return <p>Loading...</p>

  return (
    <Container>
      <h2 className="text-xl font-bold">Edit Karyawan</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
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
                <FormLabel>Position</FormLabel>
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
                <FormLabel>Contact</FormLabel>
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
                <FormLabel>Office</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
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
                        {office.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <Button variant={'secondary'} className="w-full">
              <Link href="/karyawan">Batal</Link>
            </Button>
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
