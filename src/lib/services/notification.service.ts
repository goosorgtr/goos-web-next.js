import { supabaseApi, QueryOptions } from '@/lib/supabase/api'
import type { TablesInsert, TablesUpdate } from '@/lib/supabase/types'

export const notificationService = {
  /**
   * Get all notifications
   */
  async getAll(options?: QueryOptions) {
    return await supabaseApi.getAll('notifications', options)
  },

  /**
   * Get notifications by user
   */
  async getByUser(userId: string, options?: QueryOptions) {
    return await supabaseApi.getAll('notifications', {
      ...options,
      filters: { userId },
      sortBy: 'createdAt',
      sortOrder: 'desc'
    })
  },

  /**
   * Get unread notifications
   */
  async getUnread(userId: string) {
    return await supabaseApi.query('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('is_read', false)
      .order('created_at', { ascending: false })
  },

  /**
   * Create notification
   */
  async create(data: Partial<TablesInsert<'notifications'>>) {
    return await supabaseApi.create('notifications', data)
  },

  /**
   * Mark as read
   */
  async markAsRead(id: string) {
    return await supabaseApi.update('notifications', id, {
      isRead: true
    })
  },

  /**
   * Mark all as read for user
   */
  async markAllAsRead(userId: string) {
    const unreadResult = await this.getUnread(userId)
    
    if (unreadResult.data) {
      const promises = unreadResult.data.map((notif: any) =>
        this.markAsRead(notif.id)
      )
      await Promise.all(promises)
    }

    return { success: true }
  },

  /**
   * Delete notification
   */
  async delete(id: string) {
    return await supabaseApi.delete('notifications', id)
  }
}

export default notificationService
