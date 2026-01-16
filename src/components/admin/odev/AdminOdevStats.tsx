'use client'

interface AdminOdevStatsProps {
  homeworks: any[]
}

export function AdminOdevStats({ homeworks }: AdminOdevStatsProps) {
  const total = homeworks.length
  const published = homeworks.filter((hw: any) => hw.is_active).length
  const upcoming = homeworks.filter((hw: any) => {
    if (!hw.due_date) return false
    const dueDate = new Date(hw.due_date)
    const now = new Date()
    return dueDate > now
  }).length
  const overdue = homeworks.filter((hw: any) => {
    if (!hw.due_date) return false
    const dueDate = new Date(hw.due_date)
    const now = new Date()
    return dueDate < now && hw.is_active
  }).length

  const stats = [
    {
      title: 'Toplam Ödev',
      value: total,
      description: 'Tüm ödevler'
    },
    {
      title: 'Aktif Ödevler',
      value: published,
      description: 'Yayında olan ödevler'
    },
    {
      title: 'Yaklaşan Ödevler',
      value: upcoming,
      description: 'Teslim tarihi yaklaşan'
    },
    {
      title: 'Süresi Geçen',
      value: overdue,
      description: 'Teslim tarihi geçmiş'
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

