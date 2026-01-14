import { supabaseApi, QueryOptions } from '@/lib/supabase/api'
import type { TablesInsert, TablesUpdate } from '@/lib/supabase/types'

export const courseService = {
  async getAll(options?: QueryOptions) {
    return await supabaseApi.getAll('courses', options)
  },

  async getById(id: string) {
    return await supabaseApi.getById('courses', id)
  },

  async create(data: Partial<TablesInsert<'courses'>>) {
    return await supabaseApi.create('courses', data)
  },

  async update(id: string, data: Partial<TablesUpdate<'courses'>>) {
    return await supabaseApi.update('courses', id, data)
  },

  async delete(id: string) {
    return await supabaseApi.update('courses', id, { isActive: false })
  }
}

export default courseService
