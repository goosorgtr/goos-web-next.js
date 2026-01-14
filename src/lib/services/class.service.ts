import { supabaseApi, QueryOptions } from '@/lib/supabase/api'
import type { TablesInsert, TablesUpdate } from '@/lib/supabase/types'

export const classService = {
  /**
   * Get all classes
   */
  async getAll(options?: QueryOptions) {
    return await supabaseApi.getAll('classes', options)
  },

  /**
   * Get class by ID
   */
  async getById(id: string) {
    return await supabaseApi.getById('classes', id)
  },

  /**
   * Create new class
   */
  async create(data: Partial<TablesInsert<'classes'>>) {
    return await supabaseApi.create('classes', data)
  },

  /**
   * Update class
   */
  async update(id: string, data: Partial<TablesUpdate<'classes'>>) {
    return await supabaseApi.update('classes', id, data)
  },

  /**
   * Delete class (soft delete)
   */
  async delete(id: string) {
    return await supabaseApi.update('classes', id, { isActive: false })
  },

  /**
   * Get students in class
   */
  async getStudents(classId: string) {
    return await supabaseApi.query('students')
      .select(`
        *,
        users (*)
      `)
      .eq('class_id', classId)
  },

  /**
   * Get class schedule
   */
  async getSchedule(classId: string) {
    return await supabaseApi.query('class_schedules')
      .select(`
        *,
        courses (*),
        teachers (
          *,
          users (*)
        )
      `)
      .eq('class_id', classId)
  }
}

export default classService
