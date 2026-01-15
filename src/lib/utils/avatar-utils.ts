// Avatar renkleri için yardımcı fonksiyonlar
// Rollere göre avatar arka plan rengi döndürür

export const ROLE_AVATAR_COLORS = {
  ADMIN: 'bg-blue-600',
  OGRETMEN: 'bg-green-600',
  TEACHER: 'bg-green-600',
  OGRENCI: 'bg-orange-600',
  STUDENT: 'bg-orange-600',
  VELI: 'bg-purple-600',
  PARENT: 'bg-purple-600',
  KANTINCI: 'bg-amber-600',
  CANTEEN: 'bg-amber-600',
  SERVICI: 'bg-teal-600',
  DRIVER: 'bg-teal-600',
  SERVICE: 'bg-teal-600'
} as const

/**
 * Rol adına göre avatar rengi döndürür
 * @param roleName - Rol adı (örn: 'Admin', 'Öğretmen', 'Öğrenci')
 * @returns Tailwind CSS arka plan rengi sınıfı
 */
export function getAvatarColorByRole(roleName: string | null | undefined): string {
  if (!roleName) {
    return 'bg-gray-600'
  }

  const lowerRoleName = roleName.toLowerCase()
  
  if (lowerRoleName.includes('admin') || lowerRoleName.includes('yönetici')) {
    return ROLE_AVATAR_COLORS.ADMIN
  } else if (lowerRoleName.includes('öğretmen') || lowerRoleName.includes('teacher')) {
    return ROLE_AVATAR_COLORS.OGRETMEN
  } else if (lowerRoleName.includes('öğrenci') || lowerRoleName.includes('student')) {
    return ROLE_AVATAR_COLORS.OGRENCI
  } else if (lowerRoleName.includes('veli') || lowerRoleName.includes('parent')) {
    return ROLE_AVATAR_COLORS.VELI
  } else if (lowerRoleName.includes('kantin') || lowerRoleName.includes('canteen')) {
    return ROLE_AVATAR_COLORS.KANTINCI
  } else if (lowerRoleName.includes('servis') || lowerRoleName.includes('driver') || lowerRoleName.includes('şoför')) {
    return ROLE_AVATAR_COLORS.SERVICI
  }

  return 'bg-gray-600'
}
