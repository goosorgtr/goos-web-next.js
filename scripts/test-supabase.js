// Test Supabase connection and check tables
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials bulunamadı!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🔍 Supabase bağlantısı test ediliyor...\n')

  // Test 1: Check users table
  console.log('1️⃣ Users tablosunu kontrol ediliyor...')
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('*')
    .limit(5)

  if (usersError) {
    console.error('❌ Users tablosu hatası:', usersError.message)
  } else {
    console.log(`✅ Users tablosu bulundu! ${users.length} kullanıcı var\n`)
    if (users.length > 0) {
      console.log('İlk kullanıcı:', users[0])
    }
  }

  // Test 2: Check roles table
  console.log('\n2️⃣ Roles tablosunu kontrol ediliyor...')
  const { data: roles, error: rolesError } = await supabase
    .from('roles')
    .select('*')

  if (rolesError) {
    console.error('❌ Roles tablosu hatası:', rolesError.message)
  } else {
    console.log(`✅ Roles tablosu bulundu! ${roles.length} rol var`)
    if (roles.length > 0) {
      console.log('Roller:', roles.map(r => r.name).join(', '))
    }
  }

  console.log('\n✅ Test tamamlandı!')
}

testConnection().catch(console.error)
