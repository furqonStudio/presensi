'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { Container } from '@/components/container'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { formatToWIB } from '@/lib/dateTimeUtils'

async function fetchShift(id: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/shifts/${id}`,
  )
  if (!response.ok) {
    throw new Error('Failed to fetch shift')
  }
  return response.json()
}

export default function ShiftDetail() {
  const { id } = useParams()
  console.log('🚀 ~ ShiftDetail ~ id:', id)

  const {
    data: shift,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['shift', id],
    queryFn: () => fetchShift(id),
    enabled: !!id,
  })

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>{`Gagal memuat data shift: ${error.message}`}</p>

  return (
    <Container>
      <h2 className="text-xl font-bold">Detail Shift</h2>
      <div className="space-y-2 rounded-lg border p-4 shadow-md">
        <p>
          <strong>Nama Shift:</strong> {shift.name}
        </p>
        <p>
          <strong>Jam Masuk:</strong> {formatToWIB(shift.clockIn)}
        </p>
        <p>
          <strong>Jam Keluar:</strong> {formatToWIB(shift.clockOut)}
        </p>
      </div>
      <div className="mt-4">
        <Link href="/shift">
          <Button variant="secondary">Kembali</Button>
        </Link>
      </div>
    </Container>
  )
}
