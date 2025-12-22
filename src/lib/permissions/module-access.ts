import type { Role, Module } from '@/types/roles'

/**
 * ROL-MODÜL ERİŞİM MATRİSİ
 * 
 * Her rolün hangi modüllere erişebileceğini ve nasıl erişebileceğini tanımlar.
 */

export type ModuleAccessType =
    | 'full'          // Tam yetki (CRUD)
    | 'manage'        // Yönetim yetkisi
    | 'create'        // Oluşturma yetkisi
    | 'view'          // Sadece görüntüleme
    | 'track'         // Takip etme
    | 'payment'       // Ödeme yapma
    | 'none'          // Erişim yok

export interface ModuleAccess {
    type: ModuleAccessType
    description: string
}

/**
 * Rol-Modül Erişim Matrisi
 * Kullanıcı arayüzünde gösterilmek üzere açıklamalarla birlikte
 */
export const MODULE_ACCESS_MATRIX: Record<Role, Record<Module, ModuleAccess>> = {
    ADMIN: {
        konum: { type: 'full', description: 'Tümü' },
        odev: { type: 'full', description: 'Tümü' },
        mesaj: { type: 'full', description: 'Tümü' },
        servis: { type: 'full', description: 'Tümü' },
        odeme: { type: 'full', description: 'Tümü' },
        kantin: { type: 'full', description: 'Tümü' },
        etkinlik: { type: 'full', description: 'Tümü' },
        duyuru: { type: 'full', description: 'Tümü' },
        devamsizlik: { type: 'full', description: 'Tümü' },
        notlar: { type: 'full', description: 'Tümü' },
        'ders-programi': { type: 'full', description: 'Tümü' },
        donem: { type: 'full', description: 'Tümü' },
    },

    OGRETMEN: {
        konum: { type: 'view', description: 'Görüntüle' },
        odev: { type: 'create', description: 'Oluştur/Notla' },
        mesaj: { type: 'create', description: 'İletişim' },
        servis: { type: 'none', description: '-' },
        odeme: { type: 'none', description: '-' },
        kantin: { type: 'none', description: '-' },
        etkinlik: { type: 'create', description: 'Oluştur' },
        duyuru: { type: 'create', description: 'Oluştur' },
        devamsizlik: { type: 'create', description: 'Yoklama Al' },
        notlar: { type: 'create', description: 'Not Gir' },
        'ders-programi': { type: 'view', description: 'Görüntüle' },
        donem: { type: 'view', description: 'Görüntüle' },
    },

    OGRENCI: {
        konum: { type: 'create', description: 'Paylaş' },
        odev: { type: 'view', description: 'Görüntüle/Teslim' },
        mesaj: { type: 'create', description: 'İletişim' },
        servis: { type: 'view', description: 'Görüntüle' },
        odeme: { type: 'view', description: 'Görüntüle' },
        kantin: { type: 'create', description: 'Sipariş' },
        etkinlik: { type: 'view', description: 'Görüntüle' },
        duyuru: { type: 'view', description: 'Görüntüle' },
        devamsizlik: { type: 'view', description: 'Görüntüle' },
        notlar: { type: 'view', description: 'Görüntüle' },
        'ders-programi': { type: 'view', description: 'Görüntüle' },
        donem: { type: 'view', description: 'Görüntüle' },
    },

    VELI: {
        konum: { type: 'track', description: 'Çocuk Takip' },
        odev: { type: 'view', description: 'Görüntüle' },
        mesaj: { type: 'create', description: 'İletişim' },
        servis: { type: 'view', description: 'Görüntüle' },
        odeme: { type: 'payment', description: 'Ödeme Yap' },
        kantin: { type: 'payment', description: 'Bakiye Ekle' },
        etkinlik: { type: 'view', description: 'Görüntüle' },
        duyuru: { type: 'view', description: 'Görüntüle' },
        devamsizlik: { type: 'view', description: 'Görüntüle' },
        notlar: { type: 'view', description: 'Görüntüle' },
        'ders-programi': { type: 'view', description: 'Görüntüle' },
        donem: { type: 'view', description: 'Görüntüle' },
    },

    KANTINCI: {
        konum: { type: 'none', description: '-' },
        odev: { type: 'none', description: '-' },
        mesaj: { type: 'none', description: '-' },
        servis: { type: 'none', description: '-' },
        odeme: { type: 'view', description: 'Kantin' },
        kantin: { type: 'manage', description: 'Yönetim' },
        etkinlik: { type: 'none', description: '-' },
        duyuru: { type: 'none', description: '-' },
        devamsizlik: { type: 'none', description: '-' },
        notlar: { type: 'none', description: '-' },
        'ders-programi': { type: 'none', description: '-' },
        donem: { type: 'none', description: '-' },
    },

    SERVICI: {
        konum: { type: 'create', description: 'Araç Konum' },
        odev: { type: 'none', description: '-' },
        mesaj: { type: 'none', description: '-' },
        servis: { type: 'manage', description: 'Yönetim' },
        odeme: { type: 'none', description: '-' },
        kantin: { type: 'none', description: '-' },
        etkinlik: { type: 'none', description: '-' },
        duyuru: { type: 'none', description: '-' },
        devamsizlik: { type: 'view', description: 'Bilgi' },
        notlar: { type: 'none', description: '-' },
        'ders-programi': { type: 'none', description: '-' },
        donem: { type: 'none', description: '-' },
    },
}

/**
 * Bir rolün belirli bir modüle erişim tipini döndürür
 */
export function getModuleAccessType(role: Role, module: Module): ModuleAccessType {
    return MODULE_ACCESS_MATRIX[role][module].type
}

/**
 * Bir rolün belirli bir modüle erişip erişemeyeceğini kontrol eder
 */
export function canAccessModule(role: Role, module: Module): boolean {
    return MODULE_ACCESS_MATRIX[role][module].type !== 'none'
}

/**
 * Bir rolün erişebildiği tüm modülleri döndürür
 */
export function getAccessibleModulesForRole(role: Role): Module[] {
    return (Object.keys(MODULE_ACCESS_MATRIX[role]) as Module[]).filter(module =>
        canAccessModule(role, module)
    )
}
