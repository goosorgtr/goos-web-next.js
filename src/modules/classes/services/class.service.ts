import { supabaseApi } from '@/lib/supabase/api';
import { supabase } from '@/lib/supabase/client';
import type { Tables } from '@/lib/supabase/types';
import type { ClassItem, CreateClassDto, UpdateClassDto, StudentInClass, StudentForAssignment } from '../types';

export const classService = {
    async getClasses(): Promise<ClassItem[]> {
        const { data, error } = await supabase
            .from('classes')
            .select('*')
            .order('grade', { ascending: true });

        if (error) {
            throw new Error(error.message);
        }

        // Her sınıf için öğrenci sayısını al
        const classesWithCount = await Promise.all(
            (data || []).map(async (cls: any) => {
                const { count } = await supabase
                    .from('students')
                    .select('*', { count: 'exact', head: true })
                    .eq('class_id', cls.id);

                return {
                    id: cls.id,
                    name: cls.name || '',
                    grade: cls.grade || 0,
                    isActive: cls.is_active ?? true,
                    updatedAt: cls.updated_at || '',
                    studentCount: count || 0
                };
            })
        );

        return classesWithCount;
    },

    async getById(id: string): Promise<ClassItem> {
        const response = await supabaseApi.getById('classes', id);

        if (!response.success) {
            throw new Error(response.message);
        }

        const cls = response.data;
        return {
            id: cls.id,
            name: cls.name || '',
            grade: cls.grade || 0,
            isActive: cls.isActive ?? true,
            updatedAt: cls.updatedAt || ''
        };
    },

    async create(dto: CreateClassDto): Promise<ClassItem> {
        const id = crypto.randomUUID();

        const { data: result, error } = await supabase
            .from('classes')
            .insert({
                id,
                name: dto.name,
                grade: dto.grade,
                is_active: dto.isActive ?? true
            } as any)
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        const cls = result as any;
        return {
            id: cls.id,
            name: cls.name || '',
            grade: cls.grade || 0,
            isActive: cls.is_active ?? true,
            updatedAt: cls.updated_at || ''
        };
    },

    async update(id: string, dto: UpdateClassDto): Promise<ClassItem> {
        const updateData: any = {};
        if (dto.name !== undefined) updateData.name = dto.name;
        if (dto.grade !== undefined) updateData.grade = dto.grade;
        if (dto.isActive !== undefined) updateData.isActive = dto.isActive;

        const response = await supabaseApi.update('classes', id, updateData);

        if (!response.success) {
            throw new Error(response.message);
        }

        const cls = response.data;
        return {
            id: cls.id,
            name: cls.name || '',
            grade: cls.grade || 0,
            isActive: cls.isActive ?? true,
            updatedAt: cls.updatedAt || ''
        };
    },

    async delete(id: string): Promise<void> {
        // Önce sınıftaki öğrencileri unassign et
        const { error: unassignStudentsError } = await supabase
            .from('students')
            .update({ class_id: null } as any)
            .eq('class_id', id);

        if (unassignStudentsError) {
            throw new Error(unassignStudentsError.message);
        }

        // Öğretmen-ders ilişkilerini unassign et
        const { error: unassignTeacherCoursesError } = await supabase
            .from('teacher_courses')
            .update({ class_id: null } as any)
            .eq('class_id', id);

        if (unassignTeacherCoursesError) {
            throw new Error(unassignTeacherCoursesError.message);
        }

        // Sonra sınıfı sil
        const response = await supabaseApi.delete('classes', id);

        if (!response.success) {
            throw new Error(response.message);
        }
    },

    // Sınıftaki öğrencileri getir
    async getStudentsByClass(classId: string): Promise<StudentInClass[]> {
        const { data, error } = await supabase
            .from('students')
            .select(`
                id,
                user_id,
                class_id,
                student_no,
                users!inner (
                    first_name,
                    last_name
                )
            `)
            .eq('class_id', classId);

        if (error) {
            throw new Error(error.message);
        }

        return (data || []).map((student: any) => ({
            id: student.id,
            studentId: student.id,
            userId: student.user_id,
            studentNo: student.student_no || '',
            firstName: student.users?.first_name || '',
            lastName: student.users?.last_name || '',
            classId: student.class_id
        }));
    },

    // Sınıfa atanabilecek öğrencileri getir (sınıfı olmayanlar veya farklı sınıftakiler)
    async getAvailableStudents(): Promise<StudentForAssignment[]> {
        const { data, error } = await supabase
            .from('students')
            .select(`
                id,
                user_id,
                class_id,
                student_no,
                users!inner (
                    first_name,
                    last_name
                ),
                classes (
                    name
                )
            `);

        if (error) {
            throw new Error(error.message);
        }

        return (data || []).map((student: any) => ({
            id: student.id,
            userId: student.user_id,
            studentNo: student.student_no || '',
            firstName: student.users?.first_name || '',
            lastName: student.users?.last_name || '',
            currentClassId: student.class_id || undefined,
            currentClassName: student.classes?.name || undefined
        }));
    },

    // Öğrenciyi sınıfa ekle
    async addStudentToClass(studentId: string, classId: string): Promise<void> {
        const response = await supabaseApi.update('students', studentId, {
            classId: classId
        });

        if (!response.success) {
            throw new Error(response.message);
        }
    },

    // Öğrenciyi sınıftan çıkar
    async removeStudentFromClass(studentId: string): Promise<void> {
        const response = await supabaseApi.update('students', studentId, {
            classId: null
        } as any);

        if (!response.success) {
            throw new Error(response.message);
        }
    },

    // Sınıf öğrenci sayısını getir
    async getStudentCount(classId: string): Promise<number> {
        const { count, error } = await supabase
            .from('students')
            .select('*', { count: 'exact', head: true })
            .eq('class_id', classId);

        if (error) {
            throw new Error(error.message);
        }

        return count || 0;
    }
};

