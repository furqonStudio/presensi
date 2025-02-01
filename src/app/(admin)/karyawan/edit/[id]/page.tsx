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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { useRouter, useParams } from 'next/navigation'

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

async function fetchEmployee(id) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/employees/${id}`,
  )
  if (!response.ok) {
    throw new Error('Failed to fetch employee data')
  }
  return response.json()
}

async function updateEmployee(id, data) {
  console.log('🚀 ~ updateEmployee ~ data:', data)
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
  const { id } = useParams()
  const { toast } = useToast()

  const [offices, setOffices] = useState([])
  const [employee, setEmployee] = useState(null)
  const [loadingOffices, setLoadingOffices] = useState(true)
  const [loadingEmployee, setLoadingEmployee] = useState(true)
  const [errorOffices, setErrorOffices] = useState(null)
  const [errorEmployee, setErrorEmployee] = useState(null)

  useEffect(() => {
    const loadOffices = async () => {
      try {
        const officesData = await fetchOffices()
        setOffices(officesData)
        setLoadingOffices(false)
      } catch (error) {
        setErrorOffices(error.message)
        setLoadingOffices(false)
      }
    }

    loadOffices()
  }, [])

  useEffect(() => {
    const loadEmployee = async () => {
      if (id) {
        try {
          const employeeData = await fetchEmployee(id)
          setEmployee(employeeData)
          setLoadingEmployee(false)
        } catch (error) {
          setErrorEmployee(error.message)
          setLoadingEmployee(false)
        }
      }
    }

    loadEmployee()
  }, [id])

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
        officeId: String(employee.officeId),
      })
    }
  }, [employee, form])

  const onSubmit = async (data) => {
    const updatedData = {
      ...data,
      officeId: Number(data.officeId),
    }
    try {
      await updateEmployee(id, updatedData)
      toast({
        title: 'Berhasil!',
        description: 'Data karyawan berhasil diperbarui.',
        variant: 'default',
      })
      router.push('/karyawan')
    } catch (error) {
      toast({
        title: 'Gagal!',
        description: 'Terjadi kesalahan saat memperbarui karyawan.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Container>
      <h2 className="text-xl font-bold">Edit Karyawan</h2>

      {loadingEmployee || loadingOffices ? <p>Loading data...</p> : null}
      {errorEmployee || errorOffices ? <p>Gagal mengambil data</p> : null}

      {!loadingEmployee &&
        !loadingOffices &&
        !errorEmployee &&
        !errorOffices && (
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
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value}
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
                  <Button
                    variant={'secondary'}
                    className="w-full"
                    type="button"
                  >
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
