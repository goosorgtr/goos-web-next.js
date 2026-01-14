import { supabaseApi } from '@/lib/supabase/api';
import { supabase } from '@/lib/supabase/client';
import type { Tables } from '@/lib/supabase/types';
import type { Donem, CreateDonemDto, UpdateDonemDto } from '../types';

export const semesterService = {
    async getAll(): Promise<Donem[]> {
        const response = await supabaseApi.getAll('semesters', {
            sortBy: 'startDate',
            sortOrder: 'desc'
        });

        if (!response.success) {
            throw new Error(response.message);
        }

        // Transform database semesters to Donem format
        return response.data.map((semester: Tables<'semesters'>) => ({
            id: semester.id,
            name: semester.name || '',
            startDate: semester.startDate || '',
            endDate: semester.endDate || '',
            isActive: semester.isActive || false
        }));
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

    async create(dto: CreateDonemDto): Promise<Donem> {
        const response = await supabaseApi.create('semesters', {
            name: dto.name,
            startDate: dto.startDate,
            endDate: dto.endDate,
            isActive: dto.isActive ?? false
        });

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
        const response = await supabaseApi.update('semesters', id, {
            name: dto.name,
            startDate: dto.startDate,
            endDate: dto.endDate,
            isActive: dto.isActive
        });

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

    async delete(id: string): Promise<void> {
        const response = await supabaseApi.delete('semesters', id);

        if (!response.success) {
            throw new Error(response.message);
        }
    },

    async toggleActive(id: string): Promise<Donem> {
        // First get the current semester
        const current = await this.getById(id);

        // Then update it
        const response = await supabaseApi.update('semesters', id, {
            isActive: !current.isActive
        });

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
    }
};
