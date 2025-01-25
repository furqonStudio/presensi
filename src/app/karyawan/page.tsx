import { Container } from '@/components/container'
import { KaryawanTable } from '@/components/karyawan-table'
import React from 'react'

const KaryawanPage = () => {
  return (
    <Container>
      <h2 className="text-xl font-bold">Daftar Karyawan</h2>
      <KaryawanTable />
    </Container>
  )
}

export default KaryawanPage
