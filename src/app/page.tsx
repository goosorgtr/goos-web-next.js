import { redirect } from 'next/navigation'

export default function Home() {
  // Ana sayfa otomatik olarak giriş sayfasına yönlendirir
  redirect('/giris') 
}
