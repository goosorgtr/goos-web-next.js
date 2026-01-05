import api from '@/lib/api/client';
import type { Kullanici, CreateKullaniciDto, UpdateKullaniciDto } from '../types';

export const kullanicilarService = {
    async getAll(): Promise<Kullanici[]> {
        // In a real app, this would be an API call
        // For now, we'll return mock data if the API fails or is not ready
        try {
            const { data } = await api.get('/kullanicilar');
            return data;
        } catch (error) {
            console.warn('API error, using mock data for kullanicilar');
            return [
                {
                    id: '1',
                    name: 'Selin Yılmaz',
                    avatar: '/avatars/selin.jpg',
                    lastSeen: 'Son giriş: 2 dk önce',
                    role: 'Admin',
                    roleColor: 'bg-purple-100 text-purple-700',
                    email: 'selin.y@goos.edu',
                    userId: 'BAD-001',
                    department: '-',
                    status: 'Aktif',
                    statusColor: 'text-green-600'
                },
                {
                    id: '2',
                    name: 'Mert Demir',
                    avatar: '/avatars/mert.jpg',
                    lastSeen: 'Son giriş: Dün',
                    role: 'Öğretmen',
                    roleColor: 'bg-orange-100 text-orange-700',
                    email: 'mert.d@goos.edu',
                    userId: 'TC-042',
                    department: 'Matematik',
                    status: 'Aktif',
                    statusColor: 'text-green-600'
                }
            ] as Kullanici[];
        }
    },

    async getByRole(role: string, userId: string): Promise<Kullanici[]> {
        const { data } = await api.get(`/kullanicilar?role=${role}&userId=${userId}`);
        return data;
    },

    async create(dto: CreateKullaniciDto): Promise<Kullanici> {
        const { data } = await api.post('/kullanicilar', dto);
        return data;
    },

    async update(id: string, dto: UpdateKullaniciDto): Promise<Kullanici> {
        const { data } = await api.put(`/kullanicilar/${id}`, dto);
        return data;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/kullanicilar/${id}`);
    }
};
