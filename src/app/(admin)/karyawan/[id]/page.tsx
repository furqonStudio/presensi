'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Container } from '@/components/container'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

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
    throw new Error('Failed to fetch employee')
  }
  return response.json()
}

export default function EmployeeDetail() {
  const { id } = useParams()
  console.log('🚀 ~ EmployeeDetail ~ id:', id)

  const {
    data: employee,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => fetchEmployee(id),
    enabled: !!id,
  })

  const {
    data: offices,
    isLoading: isOfficesLoading,
    isError: isOfficesError,
    error: officesError,
  } = useQuery({
    queryKey: ['offices'],
    queryFn: fetchOffices,
  })

  if (isLoading || isOfficesLoading) return <p>Loading...</p>
  if (isError) return <p>{`Gagal memuat data karyawan: ${error.message}`}</p>
  if (isOfficesError)
    return <p>{`Gagal memuat data kantor: ${officesError.message}`}</p>

  const officeDescription =
    offices?.find((office) => office.id === employee.officeId)?.description ||
    'Tidak tersedia'

  return (
    <Container>
      <h2 className="text-xl font-bold">Detail Karyawan</h2>
      <div className="space-y-2 rounded-lg border p-4 shadow-md">
        <p>
          <strong>Nama:</strong> {employee.name}
        </p>
        <p>
          <strong>Jabatan:</strong> {employee.position}
        </p>
        <p>
          <strong>Kontak:</strong> {employee.contact}
        </p>
        <p>
          <strong>Kantor:</strong> {officeDescription}
        </p>
      </div>
      <div className="mt-4">
        <Link href="/karyawan">
          <Button variant="secondary">Kembali</Button>
        </Link>
      </div>
    </Container>
  )
}
