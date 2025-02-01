'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { Container } from '@/components/container'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Map } from '@/components/map'

async function fetchOffice(id: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/offices/${id}`,
  )
  if (!response.ok) {
    throw new Error('Failed to fetch office')
  }
  return response.json()
}

async function fetchEmployeesByOffice(officeId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/employees?officeId=${officeId}`,
  )
  if (!response.ok) {
    throw new Error('Failed to fetch employees by office')
  }
  return response.json()
}

export default function OfficeDetail() {
  const { id } = useParams()

  const {
    data: office,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['office', id],
    queryFn: () => fetchOffice(id),
    enabled: !!id,
  })

  const {
    data: employees,
    isLoading: isEmployeesLoading,
    isError: isEmployeesError,
    error: employeesError,
  } = useQuery({
    queryKey: ['employees', id],
    queryFn: () => fetchEmployeesByOffice(id),
    enabled: !!id,
  })

  if (isLoading || isEmployeesLoading) return <p>Loading...</p>
  if (isError) return <p>{`Gagal memuat data kantor: ${error.message}`}</p>
  if (isEmployeesError)
    return <p>{`Gagal memuat data karyawan: ${employeesError.message}`}</p>

  return (
    <Container>
      <h2 className="text-xl font-bold">Detail Kantor</h2>
      <div className="space-y-2 rounded-lg border p-4 shadow-md">
        <p>
          <strong>Nama Kantor:</strong> {office.name}
        </p>
        <p>
          <strong>Alamat:</strong> {office.address}
        </p>
        <p>
          <strong>Deskripsi:</strong> {office.description || 'Tidak tersedia'}
        </p>
      </div>

      {office.latitude && office.longitude && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Lokasi Kantor:</h3>
          <Map
            mode="view"
            initialCoordinates={[office.latitude, office.longitude]} // Kirim koordinat awal dari data kantor
          />
        </div>
      )}

      <div className="mt-4">
        <Link href="/kantor">
          <Button variant="secondary">Kembali</Button>
        </Link>
      </div>
    </Container>
  )
}
