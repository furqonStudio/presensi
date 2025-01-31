'use client'
import { Container } from '@/components/container'
import { Office, OfficeTable } from '@/components/office-table'
import { Shift, ShiftTable } from '@/components/shift-table'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

async function fetchShifts(): Promise<Shift[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shifts`)
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

const OfficePage = () => {
  const { data, isLoading, isError, error } = useQuery<Shift[], Error>({
    queryKey: ['shifts'],
    queryFn: fetchShifts,
  })

  if (isLoading) return <div>Loading...</div>
  if (isError && error instanceof Error)
    return <div>Error: {error.message}</div>

  return (
    <Container>
      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-bold">Daftar Shift</h2>
        <Button asChild>
          <Link href="/shift/add">
            <Plus /> Tambah
          </Link>
        </Button>
      </div>
      <ShiftTable data={data || []} />
    </Container>
  )
}

export default OfficePage
