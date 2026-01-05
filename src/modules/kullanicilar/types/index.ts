export type UserRole = 'Admin' | 'Öğretmen' | 'Öğrenci' | 'Veli' | 'Servici' | 'Kantinci' | 'Veli Uzman';

export interface Kullanici {
    id: string;
    name: string;
    avatar: string;
    lastSeen: string;
    role: UserRole;
    roleColor: string;
    email: string;
    userId: string;
    department: string;
    status: 'Aktif' | 'Pasif';
    statusColor: string;
}

export interface CreateKullaniciDto {
    name: string;
    email: string;
    role: UserRole;
    department?: string;
    password?: string;
}

export interface UpdateKullaniciDto extends Partial<CreateKullaniciDto> {
    status?: 'Aktif' | 'Pasif';
}
