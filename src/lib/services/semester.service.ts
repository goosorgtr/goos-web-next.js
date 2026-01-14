import { supabaseApi, QueryOptions } from '@/lib/supabase/api'
import type { TablesInsert, TablesUpdate } from '@/lib/supabase/types'

export const semesterService = {
  /**
   * Get all semesters
   */
  async getAll(options?: QueryOptions) {
    return await supabaseApi.getAll('semesters', options)
  },

  /**
   * Get semester by ID
   */
  async getById(id: string) {
    return await supabaseApi.getById('semesters', id)
  },

  /**
   * Create new semester
   */
  async create(data: Partial<TablesInsert<'semesters'>>) {
    return await supabaseApi.create('semesters', data)
  },

  /**
   * Update semester
   */
  async update(id: string, data: Partial<TablesUpdate<'semesters'>>) {
    return await supabaseApi.update('semesters', id, data)
  },

  /**
   * Delete semester (soft delete)
   */
  async delete(id: string) {
    return await supabaseApi.update('semesters', id, { isActive: false })
  },

  /**
   * Get active semester
   */
  async getActive() {
    const result = await supabaseApi.query('semesters')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single()

    return result
  },

  /**
   * Set semester as active
   */
  async setActive(id: string) {
    // First deactivate all semesters
    const allSemesters = await this.getAll()
    
    if (allSemesters.success && allSemesters.data) {
      await Promise.all(
        allSemesters.data.map(semester =>
          supabaseApi.update('semesters', semester.id, { isActive: false })
        )
      )
    }

    // Then activate the selected semester
    return await supabaseApi.update('semesters', id, { isActive: true })
  }
}

export default semesterService
