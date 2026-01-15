import { supabaseApi } from '@/lib/supabase/api';
import { supabase } from '@/lib/supabase/client';
import type { User, Role } from '@/lib/supabase/types';
import type { Kullanici, CreateKullaniciDto, UpdateKullaniciDto } from '../types';
import { getRoleColor, getRoleDisplayName, getRoleColorByName } from '@/lib/utils/role-utils';

export const kullanicilarService = {
    async getAll(): Promise<Kullanici[]> {
        try {
            // Kullanıcıları çek (isActive kontrolü olmadan tüm kullanıcıları çek)
            const { data: usersData, error: usersError } = await supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });

            if (usersError) {
                console.error('Kullanıcılar çekilemedi:', usersError);
                throw new Error(usersError.message);
            }

            if (!usersData || usersData.length === 0) {
                console.log('Hiç kullanıcı bulunamadı');
                return [];
            }

            // Tüm benzersiz rol ID'lerini topla (snake_case)
            const roleIds = Array.from(new Set(usersData.map((u: User) => u.role_id).filter(Boolean))) as string[];

            if (roleIds.length === 0) {
                console.warn('Kullanıcılarda rol ID bulunamadı');
                return usersData.map((user: User) => ({
                    id: user.id,
                    name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'İsimsiz',
                    avatar: user.profile_image_url || '/avatars/default.jpg',
                    lastSeen: user.updated_at ? `Son giriş: ${new Date(user.updated_at).toLocaleDateString('tr-TR')}` : '-',
                    role: 'Tanımsız',
                    roleColor: 'bg-gray-100 text-gray-700',
                    email: user.email || '-',
                    userId: user.id,
                    department: '-',
                    status: user.is_active ? 'Aktif' : 'Pasif',
                    statusColor: user.is_active ? 'text-green-600' : 'text-red-600'
                }));
            }

            // Rol bilgilerini çek
            const { data: rolesData, error: rolesError } = await supabase
                .from('roles')
                .select('id, name')
                .in('id', roleIds);

            if (rolesError) {
                console.error('Roller çekilemedi:', rolesError);
            }

            const rolesMap = new Map<string, string>(
                (rolesData as Role[] | null)?.map((r: Role) => [r.id, r.name || '']) || []
            );

            console.log('Kullanıcılar:', usersData.length);
            console.log('Roller:', rolesData?.length || 0);
            console.log('Rol Map:', Array.from(rolesMap.entries()));

            // Transform database users to Kullanici format
            return usersData.map((user: User) => {
                const roleName = user.role_id ? rolesMap.get(user.role_id) : null;
                const roleId = user.role_id;

                return {
                    id: user.id,
                    name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'İsimsiz',
                    tcNo: user.tc_no || undefined,
                    avatar: user.profile_image_url || '/avatars/default.jpg',
                    lastSeen: user.updated_at ? `Son giriş: ${new Date(user.updated_at).toLocaleDateString('tr-TR')}` : '-',
                    role: roleName || getRoleDisplayName(roleId || '') || 'Tanımsız',
                    roleColor: roleName ? getRoleColorByName(roleName) : getRoleColor(roleId || ''),
                    email: user.email || '-',
                    userId: user.id,
                    department: user.address || '-',
                    status: user.is_active ? 'Aktif' : 'Pasif',
                    statusColor: user.is_active ? 'text-green-600' : 'text-red-600'
                };
            });
        } catch (error) {
            console.error('getAll hatası:', error);
            throw error;
        }
    },

    async getByRole(role: string, userId: string): Promise<Kullanici[]> {
        // Kullanıcıları çek
        const { data: usersData, error } = await supabase
            .from('users')
            .select('*')
            .eq('role_id', role)
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error || !usersData) {
            throw new Error(error?.message || 'Kullanıcılar yüklenemedi');
        }

        // Rol bilgisini çek
        const { data: roleData } = await supabase
            .from('roles')
            .select('id, name')
            .eq('id', role)
            .single();

        const roleName = (roleData as Role | null)?.name || null;

        return usersData.map((user: User) => {
            const roleId = user.role_id;

            return {
                id: user.id,
                name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
                tcNo: user.tc_no || undefined,
                avatar: user.profile_image_url || '/avatars/default.jpg',
                lastSeen: user.updated_at ? `Son giriş: ${new Date(user.updated_at).toLocaleDateString('tr-TR')}` : '-',
                role: roleName || getRoleDisplayName(roleId || ''),
                roleColor: roleName ? getRoleColorByName(roleName) : getRoleColor(roleId || ''),
                email: user.email || '-',
                userId: user.id,
                department: '-',
                status: user.is_active ? 'Aktif' : 'Pasif',
                statusColor: user.is_active ? 'text-green-600' : 'text-red-600'
            };
        });
    },

    async create(dto: CreateKullaniciDto): Promise<Kullanici> {
        // 1. Create auth user in Supabase Auth
        if (!dto.password) {
            throw new Error('Şifre gereklidir');
        }

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: dto.email,
            password: dto.password,
            options: {
                data: {
                    first_name: dto.firstName,
                    last_name: dto.lastName
                }
            }
        });

        if (authError || !authData.user) {
            throw new Error(authError?.message || 'Kullanıcı oluşturulamadı');
        }

        // 2. Create user profile in users table
        const response = await supabaseApi.create('users', {
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            tcNo: dto.tcNo,
            roleId: dto.roleId,
            phone: dto.phone,
            gender: dto.gender,
            dateOfBirth: dto.dateOfBirth,
            address: dto.address,
            isActive: true
        } as any); // Type assertion needed because Insert type omits 'id', but we need it for auth linking

        if (!response.success) {
            // Rollback: Delete auth user if profile creation fails
            await supabase.auth.admin.deleteUser(authData.user.id);
            throw new Error('message' in response ? response.message : 'Profil oluşturulamadı');
        }

        const user = response.data as User;

        // Rol bilgisini çek
        const { data: roleData } = await supabase
            .from('roles')
            .select('id, name')
            .eq('id', user.role_id || '')
            .single();

        const roleName = (roleData as Role | null)?.name || null;
        const roleId = user.role_id || null;

        return {
            id: user.id,
            name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
            avatar: user.profile_image_url || '/avatars/default.jpg',
            lastSeen: '-',
            role: roleName || getRoleDisplayName(roleId || ''),
            roleColor: roleName ? getRoleColorByName(roleName) : getRoleColor(roleId || ''),
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
            tcNo: dto.tcNo,
            roleId: dto.roleId
        });

        if (!response.success) {
            throw new Error(response.message);
        }

        const user = response.data as User;

        // Rol bilgisini çek
        const { data: roleData } = await supabase
            .from('roles')
            .select('id, name')
            .eq('id', user.role_id || '')
            .single();

        const roleName = (roleData as Role | null)?.name || null;
        const roleId = user.role_id || null;

        return {
            id: user.id,
            name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
            avatar: user.profile_image_url || '/avatars/default.jpg',
            lastSeen: user.updated_at ? `Son giriş: ${new Date(user.updated_at).toLocaleDateString('tr-TR')}` : '-',
            role: roleName || getRoleDisplayName(roleId || ''),
            roleColor: roleName ? getRoleColorByName(roleName) : getRoleColor(roleId || ''),
            email: user.email || '-',
            userId: user.id,
            department: '-',
            status: user.is_active ? 'Aktif' : 'Pasif',
            statusColor: user.is_active ? 'text-green-600' : 'text-red-600'
        };
    },

    async delete(id: string): Promise<void> {
        const response = await supabaseApi.delete('users', id);

        if (!response.success) {
            throw new Error(response.message);
        }
    }
};
