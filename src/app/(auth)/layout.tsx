export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Sol Taraf - Form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Sağ Taraf - Görsel */}
      <div className="relative hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
          {/* Dekoratif Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          <div className="relative flex h-full flex-col items-center justify-center p-12 text-white">
            <div className="max-w-xl space-y-6 text-center">
              <h1 className="text-4xl font-bold leading-tight">
                Eğitimin Geleceğini
                <br />
                Birlikte
                <br />
                Şekillendiriyoruz.
              </h1>
              <p className="text-lg text-white/90">
                GOOS ile okul yönetimini dijitalleştirin. Anne-babalar, öğrenciler ve okul yönetimi için güçlü araçlar sunuyoruz.
              </p>
              
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium">Ailə Təhsili</div>
                      <div className="text-xs text-white/70">Anne ve babalar için</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium">Performans İzleme</div>
                      <div className="text-xs text-white/70">Gerçek zamanlı takip</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
