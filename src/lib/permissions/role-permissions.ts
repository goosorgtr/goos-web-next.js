import type { Role, Module, Permission } from './roles'

/**
 * ROL VE MODÜL İZİN MATRİSİ
 * 
 * Her rolün her modül için sahip olduğu izinleri tanımlar.
 * 
 * İzinler:
 * - create: Yeni kayıt oluşturma
 * - read: Kayıtları görüntüleme
 * - update: Kayıtları güncelleme
 * - delete: Kayıtları silme
 */
export const ROLE_PERMISSIONS: Record<Role, Record<Module, Permission[]>> = {
    /**
     * ADMIN - Tüm modüllerde tam yetki
     */
    ADMIN: {
        konum: ['create', 'read', 'update', 'delete'],
        odev: ['create', 'read', 'update', 'delete'],
        mesaj: ['create', 'read', 'update', 'delete'],
        servis: ['create', 'read', 'update', 'delete'],
        odeme: ['create', 'read', 'update', 'delete'],
        kantin: ['create', 'read', 'update', 'delete'],
        etkinlik: ['create', 'read', 'update', 'delete'],
        duyuru: ['create', 'read', 'update', 'delete'],
        devamsizlik: ['create', 'read', 'update', 'delete'],
        notlar: ['create', 'read', 'update', 'delete'],
        'ders-programi': ['create', 'read', 'update', 'delete'],
        donem: ['create', 'read', 'update', 'delete'],
    },

    /**
     * OGRETMEN - Eğitim modüllerinde yetki
     */
    OGRETMEN: {
        konum: ['read'],                          // Öğrenci konumunu görüntüle
        odev: ['create', 'read', 'update'],       // Ödev oluştur, notla
        mesaj: ['create', 'read'],                // Öğrenci/Veli iletişim
        servis: [],                               // Erişim yok
        odeme: [],                                // Erişim yok
        kantin: [],                               // Erişim yok
        etkinlik: ['create', 'read'],             // Etkinlik oluştur
        duyuru: ['create', 'read'],               // Duyuru yayınla
        devamsizlik: ['create', 'read'],          // Yoklama al
        notlar: ['create', 'read', 'update'],     // Not gir
        'ders-programi': ['read'],                // Kendi derslerini görüntüle
        donem: ['read'],                          // Dönem bilgisi görüntüle
    },

    /**
     * OGRENCI - Görüntüleme ve kendi işlemleri
     */
    OGRENCI: {
        konum: ['create', 'read'],                // Konum paylaş (RFID/NFC)
        odev: ['read', 'update'],                 // Ödev görüntüle, teslim et
        mesaj: ['create', 'read'],                // Mesajlaşma
        servis: ['read'],                         // Servis durumu görüntüle
        odeme: ['read'],                          // Bakiye görüntüle
        kantin: ['create', 'read'],               // Sipariş ver
        etkinlik: ['read'],                       // Etkinlikleri görüntüle
        duyuru: ['read'],                         // Duyuruları görüntüle
        devamsizlik: ['read'],                    // Devamsızlık durumu
        notlar: ['read'],                         // Notları görüntüle
        'ders-programi': ['read'],                // Ders programı
        donem: ['read'],                          // Dönem bilgisi
    },

    /**
     * VELI - Çocuk takibi ve ödeme
     */
    VELI: {
        konum: ['read'],                          // Çocuk takibi (realtime)
        odev: ['read'],                           // Çocuğun ödevleri
        mesaj: ['create', 'read'],                // Öğretmen iletişim
        servis: ['read'],                         // Servis durumu
        odeme: ['create', 'read'],                // Ödeme yap
        kantin: ['create', 'read'],               // Bakiye ekle
        etkinlik: ['read'],                       // Etkinlikler
        duyuru: ['read'],                         // Duyurular
        devamsizlik: ['read'],                    // Devamsızlık raporu
        notlar: ['read'],                         // Not raporu
        'ders-programi': ['read'],                // Çocuğun programı
        donem: ['read'],                          // Dönem bilgisi
    },

    /**
     * KANTINCI - Kantin ve ödeme yönetimi
     */
    KANTINCI: {
        konum: [],                                // Erişim yok
        odev: [],                                 // Erişim yok
        mesaj: [],                                // Erişim yok
        servis: [],                               // Erişim yok
        odeme: ['read'],                          // Ödeme işlemleri
        kantin: ['create', 'read', 'update', 'delete'], // Tam yetki
        etkinlik: [],                             // Erişim yok
        duyuru: [],                               // Erişim yok
        devamsizlik: [],                          // Erişim yok
        notlar: [],                               // Erişim yok
        'ders-programi': [],                      // Erişim yok
        donem: [],                                // Erişim yok
    },

    /**
     * SERVICI - Servis ve konum yönetimi
     */
    SERVICI: {
        konum: ['create', 'read', 'update'],      // Araç konumu (GPS)
        odev: [],                                 // Erişim yok
        mesaj: [],                                // Erişim yok
        servis: ['create', 'read', 'update', 'delete'], // Rota yönetimi
        odeme: [],                                // Erişim yok
        kantin: [],                               // Erişim yok
        etkinlik: [],                             // Erişim yok
        duyuru: [],                               // Erişim yok
        devamsizlik: ['read'],                    // Servise binmeyenler
        notlar: [],                               // Erişim yok
        'ders-programi': [],                      // Erişim yok
        donem: [],                                // Erişim yok
    },
}

/**
 * Bir rolün belirli bir modüle erişimi olup olmadığını kontrol eder
 */
export function hasModuleAccess(role: Role, module: Module): boolean {
    const permissions = ROLE_PERMISSIONS[role][module]
    return permissions.length > 0
}

/**
 * Bir rolün belirli bir modülde belirli bir izni olup olmadığını kontrol eder
 */
export function hasPermission(
    role: Role,
    module: Module,
    permission: Permission
): boolean {
    const permissions = ROLE_PERMISSIONS[role][module]
    return permissions.includes(permission)
}

/**
 * Bir rolün erişebildiği tüm modülleri döndürür
 */
export function getAccessibleModules(role: Role): Module[] {
    return (Object.keys(ROLE_PERMISSIONS[role]) as Module[]).filter(module =>
        hasModuleAccess(role, module)
    )
}

/**
 * Bir rolün belirli bir modüldeki tüm izinlerini döndürür
 */
export function getModulePermissions(role: Role, module: Module): Permission[] {
    return ROLE_PERMISSIONS[role][module] || []
}
