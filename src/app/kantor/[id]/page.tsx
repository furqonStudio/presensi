'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Container } from '@/components/container'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

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
  console.log('🚀 ~ OfficeDetail ~ id:', id)

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
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Karyawan di Kantor Ini:</h3>
        <ul className="list-disc pl-5">
          {employees?.map((employee: any) => (
            <li key={employee.id}>
              <strong>{employee.name}</strong> - {employee.position}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <Link href="/kantor">
          <Button variant="secondary">Kembali</Button>
        </Link>
      </div>
    </Container>
  )
}
