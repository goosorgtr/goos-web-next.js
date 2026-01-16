'use client'

interface AdminOdevStatsProps {
  homeworks: any[]
}

export function AdminOdevStats({ homeworks }: AdminOdevStatsProps) {
  const total = homeworks.length
  const active = homeworks.filter((hw: any) => hw.isActive).length
  const upcoming = homeworks.filter((hw: any) => {
    if (!hw.dueDate) return false
    const dueDate = new Date(hw.dueDate)
    const now = new Date()
    return dueDate > now && hw.isActive
  }).length
  const inactive = homeworks.filter((hw: any) => !hw.isActive).length

  const stats = [
    {
      title: 'Toplam Ödev',
      value: total,
      description: 'Tüm ödevler'
    },
    {
      title: 'Aktif Ödevler',
      value: active,
      description: 'Yayında olan ödevler'
    },
    {
      title: 'Yaklaşan Ödevler',
      value: upcoming,
      description: 'Teslim tarihi yaklaşan'
    },
    {
      title: 'Pasif Ödevler',
      value: inactive,
      description: 'Pasif durumda olan ödevler'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex flex-col space-y-1.5">
            <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

