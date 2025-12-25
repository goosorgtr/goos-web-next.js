export default function AnasayfaPage() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Anasayfa</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-600">Dersler</h3>
          <p className="mt-2 text-2xl font-bold">5</p>
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-600">Öğrenciler</h3>
          <p className="mt-2 text-2xl font-bold">120</p>
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-600">Ödevler</h3>
          <p className="mt-2 text-2xl font-bold">8</p>
        </div>
      </div>
    </div>
  )
}
