import { supabaseApi } from '@/lib/supabase/api';
import { supabase } from '@/lib/supabase/client';
import type { Tables } from '@/lib/supabase/types';
import type { Donem, CreateDonemDto, UpdateDonemDto } from '../types';

export const semesterService = {
    async getSemesters(): Promise<Donem[]> {
        const response = await supabaseApi.getAll('semesters', {
            sortBy: 'startDate',
            sortOrder: 'desc'
        });

        if (!response.success) {
            throw new Error(response.message);
        }

        // Transform database semesters to Donem format
        // NOT: Artık otomatik tarih kontrolü yapmıyoruz, sadece veritabanındaki değeri döndürüyoruz
        // Kullanıcı manuel olarak aktif/pasif yapabiliyor
        const semesters = response.data.map((semester: Tables<'semesters'>) => ({
            id: semester.id,
            name: semester.name || '',
            startDate: semester.startDate || '',
            endDate: semester.endDate || '',
            isActive: semester.isActive ?? false
        }));

        return semesters;
    },

    async getById(id: string): Promise<Donem> {
        const response = await supabaseApi.getById('semesters', id);

        if (!response.success) {
            throw new Error(response.message);
        }

        const semester = response.data;
        return {
            id: semester.id,
            name: semester.name || '',
            startDate: semester.startDate || '',
            endDate: semester.endDate || '',
            isActive: semester.isActive || false
        };
    },

    async update(id: string, dto: UpdateDonemDto): Promise<Donem> {
        // Get current semester to check if dates are changing
        const current = await this.getById(id);
        const datesChanged = dto.startDate !== undefined || dto.endDate !== undefined;
        const isActiveManuallySet = dto.isActive !== undefined;

        // If isActive is being manually set to true, deactivate all other semesters first
        if (isActiveManuallySet && dto.isActive === true) {
            // Tüm diğer aktif dönemleri pasif yap
            const response = await supabaseApi.getAll('semesters');
            if (response.success && response.data) {
                for (const semester of response.data) {
                    if (semester.id !== id && semester.isActive) {
                        await supabaseApi.update('semesters', semester.id, {
                            isActive: false
                        });
                    }
                }
            }
        }

        // Update the semester - sadece tanımlı alanları gönder
        const updateData: any = {};
        if (dto.name !== undefined) updateData.name = dto.name;
        if (dto.startDate !== undefined) updateData.startDate = dto.startDate;
        if (dto.endDate !== undefined) updateData.endDate = dto.endDate;
        
        // isActive değeri manuel olarak set edilmişse (undefined değilse) gönder
        // false olsa bile gönder (kullanıcı pasif yapmak istiyor)
        if (isActiveManuallySet) {
            updateData.isActive = Boolean(dto.isActive)
        }

        const response = await supabaseApi.update('semesters', id, updateData);

        if (!response.success) {
            throw new Error(response.message);
        }

        // If dates changed but isActive was not manually set, recalculate active status
        // (Bitiş tarihi geçen dönemler otomatik pasif olacak)
        if (datesChanged && !isActiveManuallySet) {
            await this.updateActiveStatus();
            // Get updated semester
            const updated = await this.getById(id);
            return updated;
        }

        // Eğer isActive manuel olarak false yapıldıysa, sadece bu dönem pasif olur
        // (Diğer dönemlerin durumu değişmez, kullanıcı tüm dönemleri pasif yapabilir)

        // Return updated semester
        const semester = response.data;
        return {
            id: semester.id,
            name: semester.name || '',
            startDate: semester.startDate || '',
            endDate: semester.endDate || '',
            isActive: semester.isActive || false
        };
    },

    async delete(id: string): Promise<void> {
        const response = await supabaseApi.delete('semesters', id);

        if (!response.success) {
            throw new Error(response.message);
        }
    },

    async getActiveSemester(): Promise<Donem | null> {
        // Get all semesters and find the one that is marked as active
        // NOT: Artık otomatik tarih kontrolü yapmıyoruz, sadece isActive: true olan dönemi döndürüyoruz
        const allSemesters = await this.getSemesters();
        
        const activeSemester = allSemesters.find(semester => semester.isActive);

        return activeSemester || null;
    },

    async create(dto: CreateDonemDto): Promise<Donem> {
        // Generate UUID for the new semester
        const id = crypto.randomUUID();

        // Check if this semester should be active (if today's date is within the range)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(dto.startDate);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(dto.endDate);
        endDate.setHours(23, 59, 59, 999);

        const shouldBeActive = today >= startDate && today <= endDate;

        // If this should be active, deactivate all others first
        if (shouldBeActive) {
            const allSemesters = await this.getSemesters();
            for (const semester of allSemesters) {
                if (semester.isActive) {
                    await supabaseApi.update('semesters', semester.id, {
                        isActive: false
                    });
                }
            }
        }

        // Use direct Supabase client to insert with id
        const { data: result, error } = await supabase
            .from('semesters')
            .insert({
                id,
                name: dto.name,
                start_date: dto.startDate,
                end_date: dto.endDate,
                is_active: shouldBeActive
            } as any)
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        // Transform database semester to Donem format
        const semester = result as any;
        return {
            id: semester.id,
            name: semester.name || '',
            startDate: semester.start_date || '',
            endDate: semester.end_date || '',
            isActive: semester.is_active || false
        };
    },

    /**
     * Updates active status based on current date
     * Only the semester that contains today's date can be active
     * Bitiş tarihi geçen dönemler otomatik olarak pasif yapılır
     * 
     * NOT: Bu fonksiyon doğrudan veritabanından veri çeker, getSemesters() kullanmaz
     * çünkü getSemesters() bu fonksiyonu çağırabilir ve sonsuz döngü oluşabilir
     */
    async updateActiveStatus(): Promise<void> {
        // Doğrudan veritabanından veri çek (getSemesters() kullanma)
        const response = await supabaseApi.getAll('semesters', {
            sortBy: 'startDate',
            sortOrder: 'desc'
        });

        if (!response.success) {
            throw new Error(response.message);
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find the semester that should be active (contains today's date)
        const shouldBeActive = response.data.find((semester: Tables<'semesters'>) => {
            const startDate = new Date(semester.startDate || '');
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(semester.endDate || '');
            endDate.setHours(23, 59, 59, 999);

            return today >= startDate && today <= endDate;
        });

        // Update all semesters: bitiş tarihi geçenler pasif, sadece bugünün tarihine uygun olan aktif
        for (const semester of response.data) {
            const semesterId = semester.id;
            const shouldBeActiveForThis = semesterId === shouldBeActive?.id;
            const currentIsActive = semester.isActive || false;

            // Eğer durum değiştiyse güncelle
            if (currentIsActive !== shouldBeActiveForThis) {
                await supabaseApi.update('semesters', semesterId, {
                    isActive: shouldBeActiveForThis
                });
            }
        }
    }
};
