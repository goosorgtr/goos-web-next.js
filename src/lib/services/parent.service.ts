import { supabaseApi, QueryOptions } from '@/lib/supabase/api'
import type { TablesInsert, TablesUpdate } from '@/lib/supabase/types'

export const parentService = {
  async getAll(options?: QueryOptions) {
    return await supabaseApi.getAll('parents', options)
  },

  async getById(id: string) {
    return await supabaseApi.query('parents')
      .select(`
        *,
        users (*),
        parent_students (
          *,
          students (
            *,
            users (*),
            classes (*)
          )
        )
      `)
      .eq('id', id)
      .single()
  },

  async create(data: Partial<TablesInsert<'parents'>>) {
    return await supabaseApi.create('parents', data)
  },

  async update(id: string, data: Partial<TablesUpdate<'parents'>>) {
    return await supabaseApi.update('parents', id, data)
  },

  async delete(id: string) {
    return await supabaseApi.update('parents', id, { isActive: false })
  },

  async assignStudent(parentId: string, studentId: string) {
    return await supabaseApi.create('parent_students', {
      parentId,
      studentId,
      isActive: true
    })
  },

  async getChildren(parentId: string) {
    return await supabaseApi.query('parent_students')
      .select(`
        *,
        students (
          *,
          users (*),
          classes (*)
        )
      `)
      .eq('parent_id', parentId)
      .eq('is_active', true)
  }
}

export default parentService
