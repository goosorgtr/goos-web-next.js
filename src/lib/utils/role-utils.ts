// Rol renkleri ve isimleri için yardımcı fonksiyonlar
// Genel sayfalar için kullanılan renk temasıyla tutarlılık sağlar

export const ROLE_COLORS = {
  ADMIN: 'bg-blue-100 text-blue-700',
  OGRETMEN: 'bg-green-100 text-green-700',
  TEACHER: 'bg-green-100 text-green-700',
  OGRENCI: 'bg-orange-100 text-orange-700',
  STUDENT: 'bg-orange-100 text-orange-700',
  VELI: 'bg-purple-100 text-purple-700',
  PARENT: 'bg-purple-100 text-purple-700',
  KANTINCI: 'bg-amber-100 text-amber-700',
  CANTEEN: 'bg-amber-100 text-amber-700',
  SERVICI: 'bg-teal-100 text-teal-700',
  DRIVER: 'bg-teal-100 text-teal-700',
  SERVICE: 'bg-teal-100 text-teal-700'
} as const

export const ROLE_DISPLAY_NAMES = {
  ADMIN: 'Admin',
  OGRETMEN: 'Öğretmen',
  TEACHER: 'Öğretmen',
  OGRENCI: 'Öğrenci',
  STUDENT: 'Öğrenci',
  VELI: 'Veli',
  PARENT: 'Veli',
  KANTINCI: 'Kantinci',
  CANTEEN: 'Kantinci',
  SERVICI: 'Servis Şoförü',
  DRIVER: 'Servis Şoförü',
  SERVICE: 'Servis Şoförü'
} as const

/**
 * Rol ID'sine göre renk döndürür
 * @param roleId - Rol ID'si (örn: 'ADMIN', 'OGRETMEN', 'role-uuid')
 * @returns Tailwind CSS renk sınıfları
 */
export function getRoleColor(roleId: string | null | undefined): string {
  if (!roleId) {
    return 'bg-gray-100 text-gray-700'
  }

  const upperRoleId = roleId.toUpperCase()
  
  // Bilinen rollerden birini kontrol et
  if (upperRoleId in ROLE_COLORS) {
    return ROLE_COLORS[upperRoleId as keyof typeof ROLE_COLORS]
  }

  // UUID formatındaki rolleri kontrol et (veritabanından gelen)
  // Bu durumda varsayılan mavi renk döndür
  return 'bg-blue-100 text-blue-700'
}

/**
 * Rol ID'sine göre görüntüleme adı döndürür
 * @param roleId - Rol ID'si (örn: 'ADMIN', 'OGRETMEN', 'role-uuid')
 * @param roleName - Veritabanından gelen rol adı (opsiyonel)
 * @returns Türkçe rol adı
 */
export function getRoleDisplayName(roleId: string | null | undefined, roleName?: string | null): string {
  if (!roleId) {
    return 'Tanımsız'
  }

  // Eğer rol adı veritabanından geldiyse onu kullan
  if (roleName) {
    return roleName
  }

  const upperRoleId = roleId.toUpperCase()
  
  // Bilinen rollerden birini kontrol et
  if (upperRoleId in ROLE_DISPLAY_NAMES) {
    return ROLE_DISPLAY_NAMES[upperRoleId as keyof typeof ROLE_DISPLAY_NAMES]
  }

  // UUID formatındaki roller için ID'yi olduğu gibi döndür
  return roleId
}

/**
 * Rol adına göre renk döndürür (rol adı için)
 * @param roleName - Rol adı (örn: 'Admin', 'Öğretmen')
 * @returns Tailwind CSS renk sınıfları
 */
export function getRoleColorByName(roleName: string | null | undefined): string {
  if (!roleName) {
    return 'bg-gray-100 text-gray-700'
  }

  const lowerRoleName = roleName.toLowerCase()
  
  if (lowerRoleName.includes('admin') || lowerRoleName.includes('yönetici')) {
    return ROLE_COLORS.ADMIN
  } else if (lowerRoleName.includes('öğretmen') || lowerRoleName.includes('teacher')) {
    return ROLE_COLORS.OGRETMEN
  } else if (lowerRoleName.includes('öğrenci') || lowerRoleName.includes('student')) {
    return ROLE_COLORS.OGRENCI
  } else if (lowerRoleName.includes('veli') || lowerRoleName.includes('parent')) {
    return ROLE_COLORS.VELI
  } else if (lowerRoleName.includes('kantin') || lowerRoleName.includes('canteen')) {
    return ROLE_COLORS.KANTINCI
  } else if (lowerRoleName.includes('servis') || lowerRoleName.includes('driver') || lowerRoleName.includes('şoför')) {
    return ROLE_COLORS.SERVICI
  }

  return 'bg-gray-100 text-gray-700'
}
