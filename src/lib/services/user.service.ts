import { supabaseApi, QueryOptions } from '@/lib/supabase/api'
import type { Tables, TablesInsert, TablesUpdate } from '@/lib/supabase/types'

export const userService = {
  /**
   * Get all users
   */
  async getAll(options?: QueryOptions) {
    return await supabaseApi.getAll('users', options)
  },

  /**
   * Get user by ID
   */
  async getById(id: string) {
    return await supabaseApi.getById('users', id)
  },

  /**
   * Create new user
   */
  async create(data: Partial<TablesInsert<'users'>>) {
    return await supabaseApi.create('users', data)
  },

  /**
   * Update user
   */
  async update(id: string, data: Partial<TablesUpdate<'users'>>) {
    return await supabaseApi.update('users', id, data)
  },

  /**
   * Delete user (soft delete - set isActive to false)
   */
  async delete(id: string) {
    return await supabaseApi.update('users', id, { isActive: false })
  },

  /**
   * Get users by role
   */
  async getByRole(roleId: string, options?: QueryOptions) {
    return await supabaseApi.getAll('users', {
      ...options,
      filters: { roleId, isActive: true }
    })
  },

  /**
   * Search users by name or email
   */
  async search(query: string, options?: QueryOptions) {
    const response = await supabaseApi.query('users')
      .select('*')
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)
      .eq('is_active', true)
      .limit(options?.limit || 10)

    return response
  },

  /**
   * Update user profile
   */
  async updateProfile(id: string, data: {
    firstName?: string
    lastName?: string
    phone?: string
    address?: string
    dateOfBirth?: string
    gender?: string
    profileImageUrl?: string
  }) {
    return await supabaseApi.update('users', id, data)
  }
}

export default userService
