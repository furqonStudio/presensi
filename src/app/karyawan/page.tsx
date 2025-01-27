import { Container } from '@/components/container'
import { EmployeeTable } from '@/components/employee-table'
import React from 'react'

const EmployeePage = () => {
  return (
    <Container>
      <h2 className="text-xl font-bold">Daftar Karyawan</h2>
      <EmployeeTable />
    </Container>
  )
}

export default EmployeePage
