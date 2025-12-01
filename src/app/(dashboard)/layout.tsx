export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar will be implemented here */}
      <aside className="w-64 border-r bg-card">
        <div className="p-4">
          <h2 className="text-lg font-semibold">Dashboard</h2>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1">
        {/* Header will be implemented here */}
        <header className="border-b bg-card p-4">
          <h1 className="text-xl font-semibold">School Management System</h1>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
