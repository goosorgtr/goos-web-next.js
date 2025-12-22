// Rol tipleri
export type Role =
    | 'ADMIN'
    | 'OGRETMEN'
    | 'OGRENCI'
    | 'VELI'
    | 'KANTINCI'
    | 'SERVICI'

// Modül tipleri
export type Module =
    | 'konum'
    | 'odev'
    | 'mesaj'
    | 'servis'
    | 'odeme'
    | 'kantin'
    | 'etkinlik'
    | 'duyuru'
    | 'devamsizlik'
    | 'notlar'
    | 'ders-programi'
    | 'donem'

// İzin tipleri
export type Permission = 'create' | 'read' | 'update' | 'delete'

// Rol etiketleri (Türkçe)
export const ROLE_LABELS: Record<Role, string> = {
    ADMIN: 'Yönetici',
    OGRETMEN: 'Öğretmen',
    OGRENCI: 'Öğrenci',
    VELI: 'Veli',
    KANTINCI: 'Kantinci',
    SERVICI: 'Servis Şoförü'
}

// Modül etiketleri (Türkçe)
export const MODULE_LABELS: Record<Module, string> = {
    konum: 'Konum Takibi',
    odev: 'Ödevler',
    mesaj: 'Mesajlaşma',
    servis: 'Servis Yönetimi',
    odeme: 'Ödemeler',
    kantin: 'Kantin',
    etkinlik: 'Etkinlikler',
    duyuru: 'Duyurular',
    devamsizlik: 'Devamsızlık',
    notlar: 'Notlar',
    'ders-programi': 'Ders Programı',
    donem: 'Dönem'
}

// İzin etiketleri (Türkçe)
export const PERMISSION_LABELS: Record<Permission, string> = {
    create: 'Oluştur',
    read: 'Görüntüle',
    update: 'Güncelle',
    delete: 'Sil'
}
