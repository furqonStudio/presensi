import { Card, CardDescription, CardTitle } from './ui/card'

type StatCardProps = {
  icon: React.ReactNode
  bgColor?: string
  count: number | string
  label: string
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  bgColor = 'bg-blue-500',
  count,
  label,
}) => {
  return (
    <Card className={`p-6 ${bgColor} h-full content-center`}>
      <div className="flex items-center justify-between text-white">
        <div>{icon}</div>
        <div className="flex flex-col items-end">
          <CardTitle className="text-4xl font-bold">{count}</CardTitle>
          <CardDescription>{label}</CardDescription>
        </div>
      </div>
    </Card>
  )
}

export default StatCard
