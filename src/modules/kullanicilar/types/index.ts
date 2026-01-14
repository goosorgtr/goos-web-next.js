export type UserRole = 'Admin' | 'Öğretmen' | 'Öğrenci' | 'Veli' | 'Servici' | 'Kantinci' | 'Veli Uzman';

export interface Kullanici {
    id: string;
    name: string;
    avatar: string;
    lastSeen: string;
    role: UserRole | string; // Allow string for roleId from database
    roleColor: string;
    email: string;
    userId: string;
    department: string;
    status: 'Aktif' | 'Pasif';
    statusColor: string;
}

export interface CreateKullaniciDto {
    firstName?: string;
    lastName?: string;
    name?: string; // For backward compatibility
    email: string;
    role?: UserRole; // For backward compatibility
    roleId?: string; // Database field
    department?: string;
    password?: string;
}

export interface UpdateKullaniciDto extends Partial<CreateKullaniciDto> {
    status?: 'Aktif' | 'Pasif';
}
