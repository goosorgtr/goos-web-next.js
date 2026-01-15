import { supabaseApi } from '@/lib/supabase/api';
import { supabase } from '@/lib/supabase/client';
import type { Tables } from '@/lib/supabase/types';
import type { Course, CreateCourseDto, UpdateCourseDto, TeacherCourse, CreateTeacherCourseDto, UpdateTeacherCourseDto } from '../types';

export const courseService = {
    async getCourses(): Promise<Course[]> {
        const response = await supabaseApi.getAll('courses', {
            sortBy: 'name',
            sortOrder: 'asc'
        });

        if (!response.success) {
            throw new Error(response.message);
        }

        const courses = response.data.map((course: any) => ({
            id: course.id,
            name: course.name || '',
            isActive: course.isActive ?? course.is_active ?? true,
            updatedAt: (course.updatedAt ?? course.updated_at) || ''
        }));

        return courses;
    },

    async getById(id: string): Promise<Course> {
        const response = await supabaseApi.getById('courses', id);

        if (!response.success) {
            throw new Error(response.message);
        }

        const course = response.data as any;
        return {
            id: course.id,
            name: course.name || '',
            isActive: course.isActive ?? course.is_active ?? true,
            updatedAt: (course.updatedAt ?? course.updated_at) || ''
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
            isActive: course.isActive ?? course.is_active ?? true,
            updatedAt: (course.updatedAt ?? course.updated_at) || ''
        };
    },

    async update(id: string, dto: UpdateCourseDto): Promise<Course> {
        const updateData: any = {};
        if (dto.name !== undefined) updateData.name = dto.name;
        if (dto.isActive !== undefined) updateData.is_active = dto.isActive;

        const response = await supabaseApi.update('courses', id, updateData);

        if (!response.success) {
            throw new Error(response.message);
        }

        const course = response.data as any;
        return {
            id: course.id,
            name: course.name || '',
            isActive: course.isActive ?? course.is_active ?? true,
            updatedAt: (course.updatedAt ?? course.updated_at) || ''
        };
    },

    async delete(id: string): Promise<void> {
        const response = await supabaseApi.delete('courses', id);

        if (!response.success) {
            throw new Error(response.message);
        }
    },

    // Teacher Courses (Öğretmen-Ders Atamaları)
    async getTeacherCourses(filters?: { courseId?: string; semesterId?: string }): Promise<TeacherCourse[]> {
        let query = supabase
            .from('teacher_courses' as any)
            .select('*');

        if (filters?.courseId) {
            query = query.eq('course_id', filters.courseId);
        }
        if (filters?.semesterId) {
            query = query.eq('semester_id', filters.semesterId);
        }

        const { data, error } = await query;

        if (error) {
            throw new Error(error.message);
        }

        // İlişkili verileri ayrı ayrı çek
        const items = data || [];
        const teacherIds = items
            .map((i: any) => i.teacher_id)
            .filter(Boolean)
            .filter((v: any, idx: number, arr: any[]) => arr.indexOf(v) === idx);
        const courseIds = items
            .map((i: any) => i.course_id)
            .filter(Boolean)
            .filter((v: any, idx: number, arr: any[]) => arr.indexOf(v) === idx);
        const classIds = items
            .map((i: any) => i.class_id)
            .filter(Boolean)
            .filter((v: any, idx: number, arr: any[]) => arr.indexOf(v) === idx);
        const semesterIds = items
            .map((i: any) => i.semester_id)
            .filter(Boolean)
            .filter((v: any, idx: number, arr: any[]) => arr.indexOf(v) === idx);

        const [teachersRes, coursesRes, classesRes, semestersRes] = await Promise.all([
            teacherIds.length > 0 
                ? supabase.from('teachers').select('id, user_id, users(id, first_name, last_name)').in('id', teacherIds)
                : { data: [] },
            courseIds.length > 0
                ? supabase.from('courses').select('id, name').in('id', courseIds)
                : { data: [] },
            classIds.length > 0
                ? supabase.from('classes').select('id, name, grade').in('id', classIds)
                : { data: [] },
            semesterIds.length > 0
                ? supabase.from('semesters').select('id, name').in('id', semesterIds)
                : { data: [] }
        ]);

        const teachersMap = new Map((teachersRes.data || []).map((t: any) => [t.id, {
            id: t.id,
            first_name: t.users?.first_name,
            last_name: t.users?.last_name
        }]));
        const coursesMap = new Map((coursesRes.data || []).map((c: any) => [c.id, c]));
        const classesMap = new Map((classesRes.data || []).map((c: any) => [c.id, c]));
        const semestersMap = new Map((semestersRes.data || []).map((s: any) => [s.id, s]));

        const mapped = items.map((item: any) => {
            const teacher = teachersMap.get(item.teacher_id);
            const course = coursesMap.get(item.course_id);
            const cls = classesMap.get(item.class_id);
            const semester = semestersMap.get(item.semester_id);

            return {
                id: item.id,
                teacherId: item.teacher_id,
                courseId: item.course_id,
                classId: item.class_id,
                semesterId: item.semester_id,
                isActive: item.is_active ?? true,
                teacher: teacher ? {
                    id: teacher.id,
                    firstName: teacher.first_name,
                    lastName: teacher.last_name
                } : undefined,
                course: course ? {
                    id: course.id,
                    name: course.name
                } : undefined,
                class: cls ? {
                    id: cls.id,
                    name: cls.name,
                    grade: cls.grade
                } : undefined,
                semester: semester ? {
                    id: semester.id,
                    name: semester.name
                } : undefined
            };
        });

        return mapped.sort((a, b) => {
            const aTeacher = `${a.teacher?.lastName ?? ''} ${a.teacher?.firstName ?? ''}`.trim().toLowerCase();
            const bTeacher = `${b.teacher?.lastName ?? ''} ${b.teacher?.firstName ?? ''}`.trim().toLowerCase();
            if (aTeacher !== bTeacher) return aTeacher.localeCompare(bTeacher);

            const aCourse = (a.course?.name ?? '').trim().toLowerCase();
            const bCourse = (b.course?.name ?? '').trim().toLowerCase();
            if (aCourse !== bCourse) return aCourse.localeCompare(bCourse);

            const aClass = (a.class?.name ?? '').trim().toLowerCase();
            const bClass = (b.class?.name ?? '').trim().toLowerCase();
            if (aClass !== bClass) return aClass.localeCompare(bClass);

            return a.id.localeCompare(b.id);
        });
    },

    async createTeacherCourse(dto: CreateTeacherCourseDto): Promise<TeacherCourse> {
        const id = crypto.randomUUID();

        const { data, error } = await supabase
            .from('teacher_courses' as any)
            .insert({
                id,
                teacher_id: dto.teacherId,
                course_id: dto.courseId,
                class_id: dto.classId || null,
                semester_id: dto.semesterId || null,
                is_active: dto.isActive ?? true
            } as any)
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        const item = data as any;
        return {
            id: item.id,
            teacherId: item.teacher_id,
            courseId: item.course_id,
            classId: item.class_id,
            semesterId: item.semester_id,
            isActive: item.is_active ?? true
        };
    },

    async updateTeacherCourse(id: string, dto: UpdateTeacherCourseDto): Promise<TeacherCourse> {
        const updateData: any = {};
        if (dto.teacherId !== undefined) updateData.teacher_id = dto.teacherId;
        if (dto.courseId !== undefined) updateData.course_id = dto.courseId;
        if (dto.classId !== undefined) updateData.class_id = dto.classId;
        if (dto.semesterId !== undefined) updateData.semester_id = dto.semesterId;
        if (dto.isActive !== undefined) updateData.is_active = dto.isActive;

        const teacherCoursesTable: any = supabase.from('teacher_courses' as any)
        const { data, error } = await teacherCoursesTable
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        const item = data as any;
        return {
            id: item.id,
            teacherId: item.teacher_id,
            courseId: item.course_id,
            classId: item.class_id,
            semesterId: item.semester_id,
            isActive: item.is_active ?? true
        };
    },

    async deleteTeacherCourse(id: string): Promise<void> {
        const { error } = await supabase
            .from('teacher_courses' as any)
            .delete()
            .eq('id', id);

        if (error) {
            throw new Error(error.message);
        }
    }
};

