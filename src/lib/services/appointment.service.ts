import { supabaseApi, QueryOptions } from '@/lib/supabase/api'
import type { TablesInsert, TablesUpdate } from '@/lib/supabase/types'

export const appointmentService = {
  async getAll(options?: QueryOptions) {
    return await supabaseApi.getAll('appointments', options)
  },

  async getById(id: string) {
    return await supabaseApi.query('appointments')
      .select(`
        *,
        teacher:users!appointments_teacher_id_fkey (*),
        parent:users!appointments_parent_id_fkey (*)
      `)
      .eq('id', id)
      .single()
  },

  async create(data: Partial<TablesInsert<'appointments'>>) {
    return await supabaseApi.create('appointments', data)
  },

  async update(id: string, data: Partial<TablesUpdate<'appointments'>>) {
    return await supabaseApi.update('appointments', id, data)
  },

  async delete(id: string) {
    return await supabaseApi.delete('appointments', id)
  },

  async getByTeacher(teacherId: string, options?: QueryOptions) {
    return await supabaseApi.getAll('appointments', {
      ...options,
      filters: { teacherId }
    })
  },

  async getByParent(parentId: string, options?: QueryOptions) {
    return await supabaseApi.getAll('appointments', {
      ...options,
      filters: { parentId }
    })
  },

  async updateStatus(id: string, status: string) {
    return await supabaseApi.update('appointments', id, { status })
  }
}

export default appointmentService
