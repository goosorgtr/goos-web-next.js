import { supabaseApi } from '@/lib/supabase/api';
import { supabase } from '@/lib/supabase/client';
import type { Tables } from '@/lib/supabase/types';
import type { Kullanici, CreateKullaniciDto, UpdateKullaniciDto } from '../types';

export const kullanicilarService = {
    async getAll(): Promise<Kullanici[]> {
        const response = await supabaseApi.getAll('users', {
            filters: { isActive: true },
            sortBy: 'createdAt',
            sortOrder: 'desc'
        });

        if (!response.success) {
            throw new Error(response.message);
        }

        // Transform database users to Kullanici format
        return response.data.map((user: Tables<'users'>) => ({
            id: user.id,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            avatar: user.profileImageUrl || '/avatars/default.jpg',
            lastSeen: user.updatedAt ? `Son giriş: ${new Date(user.updatedAt).toLocaleDateString('tr-TR')}` : '-',
            role: user.roleId || '-',
            roleColor: 'bg-blue-100 text-blue-700',
            email: user.email || '-',
            userId: user.id,
            department: '-',
            status: user.isActive ? 'Aktif' : 'Pasif',
            statusColor: user.isActive ? 'text-green-600' : 'text-red-600'
        }));
    },

    async getByRole(role: string, userId: string): Promise<Kullanici[]> {
        const response = await supabaseApi.getAll('users', {
            filters: { roleId: role, isActive: true }
        });

        if (!response.success) {
            throw new Error(response.message);
        }

        return response.data.map((user: Tables<'users'>) => ({
            id: user.id,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            avatar: user.profileImageUrl || '/avatars/default.jpg',
            lastSeen: user.updatedAt ? `Son giriş: ${new Date(user.updatedAt).toLocaleDateString('tr-TR')}` : '-',
            role: user.roleId || '-',
            roleColor: 'bg-blue-100 text-blue-700',
            email: user.email || '-',
            userId: user.id,
            department: '-',
            status: user.isActive ? 'Aktif' : 'Pasif',
            statusColor: user.isActive ? 'text-green-600' : 'text-red-600'
        }));
    },

    async create(dto: CreateKullaniciDto): Promise<Kullanici> {
        const response = await supabaseApi.create('users', {
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            roleId: dto.roleId,
            isActive: true
        });

        if (!response.success) {
            throw new Error(response.message);
        }

        const user = response.data;
        return {
            id: user.id,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            avatar: user.profileImageUrl || '/avatars/default.jpg',
            lastSeen: '-',
            role: user.roleId || '-',
            roleColor: 'bg-blue-100 text-blue-700',
            email: user.email || '-',
            userId: user.id,
            department: '-',
            status: 'Aktif',
            statusColor: 'text-green-600'
        };
    },

    async update(id: string, dto: UpdateKullaniciDto): Promise<Kullanici> {
        const response = await supabaseApi.update('users', id, {
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            roleId: dto.roleId
        });

        if (!response.success) {
            throw new Error(response.message);
        }

        const user = response.data;
        return {
            id: user.id,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            avatar: user.profileImageUrl || '/avatars/default.jpg',
            lastSeen: user.updatedAt ? `Son giriş: ${new Date(user.updatedAt).toLocaleDateString('tr-TR')}` : '-',
            role: user.roleId || '-',
            roleColor: 'bg-blue-100 text-blue-700',
            email: user.email || '-',
            userId: user.id,
            department: '-',
            status: user.isActive ? 'Aktif' : 'Pasif',
            statusColor: user.isActive ? 'text-green-600' : 'text-red-600'
        };
    },

    async delete(id: string): Promise<void> {
        const response = await supabaseApi.delete('users', id);

        if (!response.success) {
            throw new Error(response.message);
        }
    }
};
