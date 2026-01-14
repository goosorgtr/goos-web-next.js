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
        const semesters = response.data.map((semester: Tables<'semesters'>) => ({
            id: semester.id,
            name: semester.name || '',
            startDate: semester.startDate || '',
            endDate: semester.endDate || '',
            isActive: semester.isActive || false
        }));

        // Update active status based on current date
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find which semester should be active
        const shouldBeActive = semesters.find(semester => {
            const startDate = new Date(semester.startDate);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(semester.endDate);
            endDate.setHours(23, 59, 59, 999);

            return today >= startDate && today <= endDate;
        });

        // Update isActive property in memory (async update in background)
        if (shouldBeActive) {
            this.updateActiveStatus().catch(console.error);
            // Update in-memory data
            semesters.forEach(semester => {
                semester.isActive = semester.id === shouldBeActive.id;
            });
        } else {
            // No active semester, update all to inactive
            this.updateActiveStatus().catch(console.error);
            semesters.forEach(semester => {
                semester.isActive = false;
            });
        }

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
        const isActiveChanged = dto.isActive !== undefined && dto.isActive !== current.isActive;

        // If isActive is being set to true, deactivate all other semesters first
        if (isActiveChanged && dto.isActive === true) {
            const allSemesters = await this.getSemesters();
            for (const semester of allSemesters) {
                if (semester.id !== id && semester.isActive) {
                    await supabaseApi.update('semesters', semester.id, {
                        isActive: false
                    });
                }
            }
        }

        // Update the semester - sadece tanımlı alanları gönder
        const updateData: any = {};
        if (dto.name !== undefined) updateData.name = dto.name;
        if (dto.startDate !== undefined) updateData.startDate = dto.startDate;
        if (dto.endDate !== undefined) updateData.endDate = dto.endDate;
        if (dto.isActive !== undefined) updateData.isActive = dto.isActive;

        const response = await supabaseApi.update('semesters', id, updateData);

        if (!response.success) {
            throw new Error(response.message);
        }

        // If dates changed (but not isActive), recalculate active status for all semesters
        if (datesChanged && !isActiveChanged) {
            await this.updateActiveStatus();
            // Get updated semester
            const updated = await this.getById(id);
            return updated;
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

    async delete(id: string): Promise<void> {
        const response = await supabaseApi.delete('semesters', id);

        if (!response.success) {
            throw new Error(response.message);
        }
    },

    async getActiveSemester(): Promise<Donem | null> {
        // Get all semesters and find the one that contains today's date
        const allSemesters = await this.getSemesters();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const activeSemester = allSemesters.find(semester => {
            const startDate = new Date(semester.startDate);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(semester.endDate);
            endDate.setHours(23, 59, 59, 999);

            return today >= startDate && today <= endDate;
        });

        if (!activeSemester) {
            return null;
        }

        // Update isActive status in database if needed
        const currentActive = allSemesters.find(s => s.isActive);
        if (currentActive?.id !== activeSemester.id) {
            // Update all semesters: set the one in date range as active, others as inactive
            for (const semester of allSemesters) {
                const shouldBeActive = semester.id === activeSemester.id;
                if (semester.isActive !== shouldBeActive) {
                    await supabaseApi.update('semesters', semester.id, {
                        isActive: shouldBeActive
                    });
                }
            }
            activeSemester.isActive = true;
        }

        return activeSemester;
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
     */
    async updateActiveStatus(): Promise<void> {
        const allSemesters = await this.getSemesters();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find the semester that should be active (contains today's date)
        const shouldBeActive = allSemesters.find(semester => {
            const startDate = new Date(semester.startDate);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(semester.endDate);
            endDate.setHours(23, 59, 59, 999);

            return today >= startDate && today <= endDate;
        });

        // Update all semesters
        for (const semester of allSemesters) {
            const isActive = semester.id === shouldBeActive?.id;
            if (semester.isActive !== isActive) {
                await supabaseApi.update('semesters', semester.id, {
                    isActive
                });
            }
        }
    }
};
