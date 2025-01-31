'use client'
import { Container } from '@/components/container'
import { Employee, EmployeeTable } from '@/components/employee-table'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

async function fetchEmployees(): Promise<Employee[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employees`)
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

const EmployeePage = () => {
  const { data, isLoading, isError, error } = useQuery<Employee[], Error>({
    queryKey: ['employees'],
    queryFn: fetchEmployees,
  })

  if (isLoading) return <div>Loading...</div>
  if (isError && error instanceof Error)
    return <div>Error: {error.message}</div>

  return (
    <Container>
      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-bold">Daftar Karyawan</h2>
        <Button asChild>
          <Link href="/karyawan/add">
            <Plus /> Tambah
          </Link>
        </Button>
      </div>
      <EmployeeTable data={data || []} />
    </Container>
  )
}

export default EmployeePage
