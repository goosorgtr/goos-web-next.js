import { supabaseApi } from '@/lib/supabase/api';
import { supabase } from '@/lib/supabase/client';
import type { Tables } from '@/lib/supabase/types';
import type { Course, CreateCourseDto, UpdateCourseDto } from '../types';

export const courseService = {
    async getCourses(): Promise<Course[]> {
        const response = await supabaseApi.getAll('courses', {
            sortBy: 'name',
            sortOrder: 'asc'
        });

        if (!response.success) {
            throw new Error(response.message);
        }

        const courses = response.data.map((course: Tables<'courses'>) => ({
            id: course.id,
            name: course.name || '',
            isActive: course.isActive ?? true,
            updatedAt: course.updatedAt || ''
        }));

        return courses;
    },

    async getById(id: string): Promise<Course> {
        const response = await supabaseApi.getById('courses', id);

        if (!response.success) {
            throw new Error(response.message);
        }

        const course = response.data;
        return {
            id: course.id,
            name: course.name || '',
            isActive: course.isActive ?? true,
            updatedAt: course.updatedAt || ''
        };
    },

    async create(dto: CreateCourseDto): Promise<Course> {
        const id = crypto.randomUUID();

        const { data: result, error } = await supabase
            .from('courses')
            .insert({
                id,
                name: dto.name,
                is_active: dto.isActive ?? true
            } as any)
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        const course = result as any;
        return {
            id: course.id,
            name: course.name || '',
            isActive: course.is_active ?? true,
            updatedAt: course.updated_at || ''
        };
    },

    async update(id: string, dto: UpdateCourseDto): Promise<Course> {
        const updateData: any = {};
        if (dto.name !== undefined) updateData.name = dto.name;
        if (dto.isActive !== undefined) updateData.isActive = dto.isActive;

        const response = await supabaseApi.update('courses', id, updateData);

        if (!response.success) {
            throw new Error(response.message);
        }

        const course = response.data;
        return {
            id: course.id,
            name: course.name || '',
            isActive: course.isActive ?? true,
            updatedAt: course.updatedAt || ''
        };
    },

    async delete(id: string): Promise<void> {
        const response = await supabaseApi.delete('courses', id);

        if (!response.success) {
            throw new Error(response.message);
        }
    }
};

