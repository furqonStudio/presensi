import { AttendanceChart } from '@/components/attendance-chart'
import { Container } from '@/components/container'
import StatCard from '@/components/stat-card'
import { Briefcase, Users } from 'lucide-react'

export default function Home() {
  return (
    <Container>
      <div className="text-2xl font-bold">
        <h1>Selamat Datang, lorem</h1>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-1">
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
        <AttendanceChart />
      </div>
    </Container>
  )
}
