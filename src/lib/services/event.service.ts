import { supabaseApi, QueryOptions } from '@/lib/supabase/api'
import type { TablesInsert, TablesUpdate } from '@/lib/supabase/types'

export const eventService = {
  async getAll(options?: QueryOptions) {
    return await supabaseApi.getAll('events', options)
  },

  async getById(id: string) {
    return await supabaseApi.query('events')
      .select(`
        *,
        event_roles (
          role_id,
          roles (*)
        ),
        event_classes (
          class_id,
          classes (*)
        )
      `)
      .eq('id', id)
      .single()
  },

  async create(data: Partial<TablesInsert<'events'>>) {
    return await supabaseApi.create('events', data)
  },

  async update(id: string, data: Partial<TablesUpdate<'events'>>) {
    return await supabaseApi.update('events', id, data)
  },

  async delete(id: string) {
    return await supabaseApi.delete('events', id)
  },

  async getByRole(roleId: string) {
    return await supabaseApi.query('events')
      .select(`
        *,
        event_roles!inner (role_id)
      `)
      .eq('event_roles.role_id', roleId)
      .eq('is_cancelled', false)
      .order('start_time', { ascending: true })
  }
}

export default eventService
