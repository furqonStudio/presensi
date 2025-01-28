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
import { useMutation } from '@tanstack/react-query'

// Contoh data kantor (office)
const offices = [
  { id: 1, name: 'Kantor A' },
  { id: 2, name: 'Kantor B' },
]

// Define the form schema with Zod validation
const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  position: z.string().min(2, {
    message: 'Position must be at least 2 characters.',
  }),
  contact: z.string().min(10, {
    message: 'Contact must be at least 10 characters.',
  }),
  officeId: z.number().min(1, {
    message: 'Please select a valid office.',
  }),
})

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
  const [selectedOfficeId, setSelectedOfficeId] = useState<number | null>(null)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      position: '',
      contact: '',
      officeId: selectedOfficeId,
    },
  })

  const mutation = useMutation({
    mutationFn: addEmployee,
    onSuccess: (data) => {
      console.log('Employee added successfully', data)
      // You can navigate or show a success message here
    },
    onError: (error) => {
      console.error('Error:', error)
      // You can show an error message here
    },
  })

  const onSubmit = async (data: any) => {
    mutation.mutate(data)
  }

  useEffect(() => {
    form.setValue('officeId', selectedOfficeId as number)
  }, [selectedOfficeId, form])

  return (
    <Container>
      <h2 className="text-xl font-bold">Daftar Karyawan</h2>
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
                <FormDescription>
                  The full name of the employee.
                </FormDescription>
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
                <FormDescription>
                  The job position of the employee.
                </FormDescription>
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
                <FormDescription>
                  The contact number of the employee.
                </FormDescription>
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
                  value={String(selectedOfficeId ?? '')}
                  onValueChange={(value) => {
                    setSelectedOfficeId(Number(value))
                  }}
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
                <FormDescription>The office of the employee.</FormDescription>
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
              {mutation.isPending ? 'Loading...' : 'Tambah'}
            </Button>
          </div>
        </form>
      </Form>
    </Container>
  )
}
