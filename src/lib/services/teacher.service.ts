import { supabaseApi, QueryOptions } from '@/lib/supabase/api'
import type { TablesInsert, TablesUpdate } from '@/lib/supabase/types'

export const teacherService = {
  /**
   * Get all teachers
   */
  async getAll(options?: QueryOptions) {
    return await supabaseApi.getAll('teachers', options)
  },

  /**
   * Get teacher by ID with user data
   */
  async getById(id: string) {
    const result = await supabaseApi.query('teachers')
      .select(`
        *,
        users (*),
        teacher_courses (
          *,
          courses (*)
        )
      `)
      .eq('id', id)
      .single()

    return result
  },

  /**
   * Create new teacher
   */
  async create(data: Partial<TablesInsert<'teachers'>>) {
    return await supabaseApi.create('teachers', data)
  },

  /**
   * Update teacher
   */
  async update(id: string, data: Partial<TablesUpdate<'teachers'>>) {
    return await supabaseApi.update('teachers', id, data)
  },

  /**
   * Delete teacher (soft delete)
   */
  async delete(id: string) {
    return await supabaseApi.update('teachers', id, { isActive: false })
  },

  /**
   * Assign course to teacher
   */
  async assignCourse(teacherId: string, courseId: string) {
    return await supabaseApi.create('teacher_courses', {
      teacherId,
      courseId
    })
  },

  /**
   * Get teacher's courses
   */
  async getCourses(teacherId: string) {
    return await supabaseApi.query('teacher_courses')
      .select(`
        *,
        courses (*)
      `)
      .eq('teacher_id', teacherId)
  },

  /**
   * Get teacher's classes
   */
  async getClasses(teacherId: string) {
    return await supabaseApi.query('class_schedules')
      .select(`
        class_id,
        classes (
          id,
          name,
          grade
        )
      `)
      .eq('teacher_id', teacherId)
  }
}

export default teacherService
