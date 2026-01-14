import { supabaseApi, QueryOptions } from '@/lib/supabase/api'
import type { TablesInsert, TablesUpdate } from '@/lib/supabase/types'

export const announcementService = {
  /**
   * Get all announcements
   */
  async getAll(options?: QueryOptions) {
    return await supabaseApi.getAll('announcements', options)
  },

  /**
   * Get announcement by ID
   */
  async getById(id: string) {
    return await supabaseApi.query('announcements')
      .select(`
        *,
        announcement_roles (
          role_id,
          roles (*)
        ),
        announcement_classes (
          class_id,
          classes (*)
        )
      `)
      .eq('id', id)
      .single()
  },

  /**
   * Create announcement
   */
  async create(data: Partial<TablesInsert<'announcements'>>) {
    return await supabaseApi.create('announcements', data)
  },

  /**
   * Update announcement
   */
  async update(id: string, data: Partial<TablesUpdate<'announcements'>>) {
    return await supabaseApi.update('announcements', id, data)
  },

  /**
   * Delete announcement
   */
  async delete(id: string) {
    return await supabaseApi.delete('announcements', id)
  },

  /**
   * Get announcements by role
   */
  async getByRole(roleId: string, options?: QueryOptions) {
    return await supabaseApi.query('announcements')
      .select(`
        *,
        announcement_roles!inner (role_id)
      `)
      .eq('announcement_roles.role_id', roleId)
      .eq('is_published', true)
      .order('published_at', { ascending: false })
  },

  /**
   * Assign roles to announcement
   */
  async assignRoles(announcementId: string, roleIds: string[]) {
    const promises = roleIds.map(roleId =>
      supabaseApi.create('announcement_roles', {
        announcementId,
        roleId
      })
    )
    return await Promise.all(promises)
  },

  /**
   * Assign classes to announcement
   */
  async assignClasses(announcementId: string, classIds: string[]) {
    const promises = classIds.map(classId =>
      supabaseApi.create('announcement_classes', {
        announcementId,
        classId
      })
    )
    return await Promise.all(promises)
  }
}

export default announcementService
