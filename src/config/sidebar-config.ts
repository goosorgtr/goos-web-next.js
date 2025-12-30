import {
    LayoutDashboard,
    Users,
    Calendar,
    BookOpen,
    MessageSquare,
    FileText,
    UserX,
    ClipboardList,
    Megaphone,
    Wallet,
    BarChart3,
    UtensilsCrossed,
    Bus,
    ListChecks,
    Bell,
    Settings,
    Home,
    GraduationCap,
    MapPin,
    CreditCard,
    ShoppingCart,
    CheckSquare,
    FileEdit,
    Upload,
    type LucideIcon,
} from 'lucide-react'
import type { Role } from '@/types/roles'

export interface SidebarItem {
    id: string
    label: string
    href: string
    icon: LucideIcon
    badge?: number
    children?: SidebarItem[]
}

export interface SidebarConfig {
    title: string
    subtitle?: string
    items: SidebarItem[]
}

// Admin Sidebar Configuration
const adminSidebarConfig: SidebarConfig = {
    title: 'GOOS Yönetim',
    subtitle: 'Okul Yönetimi',
    items: [
        {
            id: 'kontrol-paneli',
            label: 'Kontrol Paneli',
            href: '/admin',
            icon: LayoutDashboard,
        },
        {
            id: 'kullanicilar-roller',
            label: 'Kullanıcılar & Roller',
            href: '/admin/kullanicilar-roller',
            icon: Users,
        },
        {
            id: 'donem',
            label: 'Dönem',
            href: '/admin/donem',
            icon: Calendar,
        },
        {
            id: 'ders-programi',
            label: 'Ders Programı',
            href: '/admin/ders-programi',
            icon: BookOpen,
            children: [
                {
                    id: 'sinif-ders-programi',
                    label: 'Sınıf Ders Programı',
                    href: '/admin/ders-programi/sinif',
                    icon: BookOpen,
                },
                {
                    id: 'ogretmen-ders-programi',
                    label: 'Öğretmen Ders Programı',
                    href: '/admin/ders-programi/ogretmen',
                    icon: BookOpen,
                },
            ],
        },
        {
            id: 'mesajlar',
            label: 'Mesajlar',
            href: '/admin/mesajlar',
            icon: MessageSquare,
        },
        {
            id: 'ders-notlari',
            label: 'Ders Notları',
            href: '/admin/ders-notlari',
            icon: FileText,
        },
        {
            id: 'devamsizlik',
            label: 'Devamsızlık',
            href: '/admin/devamsizlik',
            icon: UserX,
        },
        {
            id: 'sinavlar',
            label: 'Sınavlar',
            href: '/admin/sinavlar',
            icon: ClipboardList,
        },
        {
            id: 'etkinlik-duyuru',
            label: 'Etkinlik ve Duyuru',
            href: '/admin/etkinlik-duyuru',
            icon: Megaphone,
        },
        {
            id: 'bakiye-yonetimi',
            label: 'Bakiye Yönetimi',
            href: '/admin/bakiye-yonetimi',
            icon: Wallet,
        },
        {
            id: 'dinamik-rapor',
            label: 'Dinamik Rapor',
            href: '/admin/dinamik-rapor',
            icon: BarChart3,
        },
        {
            id: 'yemek-listesi',
            label: 'Yemek Listesi',
            href: '/admin/yemek-listesi',
            icon: UtensilsCrossed,
        },
        {
            id: 'okul-araclari',
            label: 'Okul Araçları',
            href: '/admin/okul-araclari',
            icon: Bus,
        },
        {
            id: 'servis-ogrenci-listesi',
            label: 'Servis Öğrenci Listesi',
            href: '/admin/servis-ogrenci-listesi',
            icon: ListChecks,
        },
        {
            id: 'bildirimler',
            label: 'Bildirimler',
            href: '/admin/bildirimler',
            icon: Bell,
        },
        {
            id: 'ayarlar',
            label: 'Ayarlar',
            href: '/admin/ayarlar',
            icon: Settings,
        },
    ],
}

// Veli Sidebar Configuration
const veliSidebarConfig: SidebarConfig = {
    title: 'GOOS',
    subtitle: 'Veli Portalı',
    items: [
        {
            id: 'kontrol-paneli',
            label: 'Kontrol Paneli',
            href: '/veli',
            icon: LayoutDashboard,
        },
        {
            id: 'donem',
            label: 'Dönem',
            href: '/veli/donem',
            icon: Calendar,
        },
        {
            id: 'ders-programi',
            label: 'Ders Programı',
            href: '/veli/ders-programi',
            icon: BookOpen,
        },
        {
            id: 'odevler',
            label: 'Ödevler',
            href: '/veli/odevler',
            icon: FileText,
        },
        {
            id: 'mesajlar',
            label: 'Mesajlar',
            href: '/veli/mesajlar',
            icon: MessageSquare,
            badge: 3,
        },
        {
            id: 'ders-notlari',
            label: 'Ders Notları',
            href: '/veli/ders-notlari',
            icon: FileText,
        },
        {
            id: 'devamsizlik',
            label: 'Devamsızlık',
            href: '/veli/devamsizlik',
            icon: UserX,
        },
        {
            id: 'sinavlar',
            label: 'Sınavlar',
            href: '/veli/sinavlar',
            icon: ClipboardList,
        },
        {
            id: 'etkinlik-duyuru',
            label: 'Etkinlik ve Duyuru',
            href: '/veli/etkinlik-duyuru',
            icon: Megaphone,
        },
        {
            id: 'konum',
            label: 'Konum',
            href: '/veli/konum',
            icon: MapPin,
        },
        {
            id: 'bakiye-bilgisi',
            label: 'Bakiye Bilgisi',
            href: '/veli/bakiye-bilgisi',
            icon: CreditCard,
        },
        {
            id: 'kantin',
            label: 'Kantin',
            href: '/veli/kantin',
            icon: ShoppingCart,
        },
    ],
}

// Öğrenci Sidebar Configuration
const ogrenciSidebarConfig: SidebarConfig = {
    title: 'GOOS',
    subtitle: '',
    items: [
        {
            id: 'anasayfa',
            label: 'Anasayfa',
            href: '/ogrenci',
            icon: Home,
        },
        {
            id: 'ders',
            label: 'Ders',
            href: '/ogrenci/ders',
            icon: BookOpen,
            children: [
                {
                    id: 'program',
                    label: 'Program',
                    href: '/ogrenci/ders/program',
                    icon: Calendar,
                },
                {
                    id: 'not',
                    label: 'Not',
                    href: '/ogrenci/ders/not',
                    icon: FileEdit,
                },
            ],
        },
        {
            id: 'devamsizlik',
            label: 'Devamsızlık',
            href: '/ogrenci/devamsizlik',
            icon: UserX,
        },
        {
            id: 'etkinlik-duyuru',
            label: 'Etkinlik Duyuru',
            href: '/ogrenci/etkinlik-duyuru',
            icon: Megaphone,
        },
        {
            id: 'bakiye-harcama',
            label: 'Bakiye ve Harcama',
            href: '/ogrenci/bakiye-harcama',
            icon: CreditCard,
        },
        {
            id: 'yemek-listesi',
            label: 'Yemek Listesi',
            href: '/ogrenci/yemek-listesi',
            icon: UtensilsCrossed,
        },
        {
            id: 'servis',
            label: 'Servis',
            href: '/ogrenci/servis',
            icon: Bus,
        },
        {
            id: 'bildirimler',
            label: 'Bildirimler',
            href: '/ogrenci/bildirimler',
            icon: Bell,
        },
        {
            id: 'sinav-bilgileri',
            label: 'Sınav Bilgileri',
            href: '/ogrenci/sinav-bilgileri',
            icon: ClipboardList,
        },
        {
            id: 'ayarlar',
            label: 'Ayarlar',
            href: '/ogrenci/ayarlar',
            icon: Settings,
        },
    ],
}

// Öğretmen Sidebar Configuration
const ogretmenSidebarConfig: SidebarConfig = {
    title: 'GOOS',
    subtitle: 'Teacher Panel',
    items: [
        {
            id: 'anasayfa',
            label: 'Anasayfa',
            href: '/ogretmen',
            icon: Home,
        },
        {
            id: 'ders',
            label: 'Ders',
            href: '/ogretmen/ders',
            icon: BookOpen,
            children: [
                {
                    id: 'program',
                    label: 'Program',
                    href: '/ogretmen/ders/program',
                    icon: Calendar,
                },
                {
                    id: 'not-girisi',
                    label: 'Not Girişi',
                    href: '/ogretmen/ders/not-girisi',
                    icon: FileEdit,
                },
            ],
        },
        {
            id: 'yoklama',
            label: 'Yoklama',
            href: '/ogretmen/yoklama',
            icon: CheckSquare,
        },
        {
            id: 'sinav',
            label: 'Sınav',
            href: '/ogretmen/sinav',
            icon: ClipboardList,
        },
        {
            id: 'odev',
            label: 'Ödev',
            href: '/ogretmen/odev',
            icon: FileText,
            children: [
                {
                    id: 'yukleme',
                    label: 'Yükleme',
                    href: '/ogretmen/odev/yukleme',
                    icon: Upload,
                },
                {
                    id: 'kontrol',
                    label: 'Kontrol',
                    href: '/ogretmen/odev/kontrol',
                    icon: ListChecks,
                },
            ],
        },
        {
            id: 'mesajlar',
            label: 'Mesajlar',
            href: '/ogretmen/mesajlar',
            icon: MessageSquare,
            badge: 5,
        },
        {
            id: 'etkinlik-duyuru',
            label: 'Etkinlik ve Duyuru',
            href: '/ogretmen/etkinlik-duyuru',
            icon: Megaphone,
        },
        {
            id: 'bildirim',
            label: 'Bildirim',
            href: '/ogretmen/bildirim',
            icon: Bell,
        },
        {
            id: 'ayarlar',
            label: 'Ayarlar',
            href: '/ogretmen/ayarlar',
            icon: Settings,
        },
    ],
}

// Kantinci Sidebar Configuration
const kantinciSidebarConfig: SidebarConfig = {
    title: 'GOOS',
    subtitle: 'Kantin Paneli',
    items: [
        {
            id: 'anasayfa',
            label: 'Anasayfa',
            href: '/kantinci',
            icon: Home,
        },
        {
            id: 'urunler',
            label: 'Ürünler',
            href: '/kantinci/urunler',
            icon: ShoppingCart,
        },
        {
            id: 'siparisler',
            label: 'Siparişler',
            href: '/kantinci/siparisler',
            icon: ListChecks,
        },
        {
            id: 'ayarlar',
            label: 'Ayarlar',
            href: '/kantinci/ayarlar',
            icon: Settings,
        },
    ],
}

// Servici Sidebar Configuration
const serviciSidebarConfig: SidebarConfig = {
    title: 'GOOS',
    subtitle: 'Servis Paneli',
    items: [
        {
            id: 'anasayfa',
            label: 'Anasayfa',
            href: '/servici',
            icon: Home,
        },
        {
            id: 'ogrenci-listesi',
            label: 'Öğrenci Listesi',
            href: '/servici/ogrenci-listesi',
            icon: Users,
        },
        {
            id: 'guzergah',
            label: 'Güzergah',
            href: '/servici/guzergah',
            icon: MapPin,
        },
        {
            id: 'ayarlar',
            label: 'Ayarlar',
            href: '/servici/ayarlar',
            icon: Settings,
        },
    ],
}

export const SIDEBAR_CONFIGS: Record<Role, SidebarConfig> = {
    ADMIN: adminSidebarConfig,
    VELI: veliSidebarConfig,
    OGRENCI: ogrenciSidebarConfig,
    OGRETMEN: ogretmenSidebarConfig,
    KANTINCI: kantinciSidebarConfig,
    SERVICI: serviciSidebarConfig,
}

export function getSidebarConfig(role: Role): SidebarConfig {
    return SIDEBAR_CONFIGS[role]
}
