import { Container } from '@/components/container'
import StatCard from '@/components/stat-card'
import { Briefcase, Users } from 'lucide-react'
import Image from 'next/image'

export default function Home() {
  return (
    <Container>
      <div className="text-2xl font-bold">
        <h1>Selamat Datang, lorem</h1>
      </div>
      <div className="flex flex-1 flex-col gap-4 pt-0">
        <div className="grid grid-cols-1 gap-2">
          <StatCard
            icon={<Users className="size-8" />}
            bgColor="bg-blue-500"
            count={20}
            label="Karyawan"
          />
          <StatCard
            icon={<Briefcase className="size-8" />}
            bgColor="bg-green-500"
            count={2}
            label="Kantor"
          />
        </div>
      </div>
    </Container>
  )
}
