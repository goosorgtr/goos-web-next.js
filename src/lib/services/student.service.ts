import { supabaseApi, QueryOptions } from '@/lib/supabase/api'
import type { TablesInsert, TablesUpdate } from '@/lib/supabase/types'

export const studentService = {
  /**
   * Get all students
   */
  async getAll(options?: QueryOptions) {
    return await supabaseApi.getAll('students', options)
  },

  /**
   * Get student by ID
   */
  async getById(id: string) {
    const result = await supabaseApi.getById('students', id)
    
    if (result.success && result.data) {
      // Fetch related user data
      const userResult = await supabaseApi.getById('users', result.data.userId || '')
      
      return {
        success: true,
        data: {
          ...result.data,
          user: userResult.success ? userResult.data : null
        }
      }
    }
    
    return result
  },

  /**
   * Create new student
   */
  async create(data: Partial<TablesInsert<'students'>>) {
    return await supabaseApi.create('students', data)
  },

  /**
   * Update student
   */
  async update(id: string, data: Partial<TablesUpdate<'students'>>) {
    return await supabaseApi.update('students', id, data)
  },

  /**
   * Delete student
   */
  async delete(id: string) {
    return await supabaseApi.delete('students', id)
  },

  /**
   * Get students by class
   */
  async getByClass(classId: string, options?: QueryOptions) {
    return await supabaseApi.getAll('students', {
      ...options,
      filters: { classId }
    })
  },

  /**
   * Get student balance
   */
  async getBalance(studentId: string, semesterId?: string) {
    const filters: any = { studentId }
    if (semesterId) {
      filters.semesterId = semesterId
    }
    
    return await supabaseApi.getAll('student_balances', {
      filters,
      limit: 1
    })
  },

  /**
   * Update student balance
   */
  async updateBalance(studentId: string, semesterId: string, amount: number) {
    const balanceResult = await this.getBalance(studentId, semesterId)
    
    if (balanceResult.success && balanceResult.data && balanceResult.data.length > 0) {
      // Update existing balance
      const currentBalance = balanceResult.data[0].balance || 0
      return await supabaseApi.update('student_balances', studentId, {
        balance: currentBalance + amount
      })
    } else {
      // Create new balance record
      return await supabaseApi.create('student_balances', {
        studentId,
        semesterId,
        balance: amount
      })
    }
  },

  /**
   * Get student's parents
   */
  async getParents(studentId: string) {
    const result = await supabaseApi.query('parent_students')
      .select(`
        *,
        parents (
          *,
          users (*)
        )
      `)
      .eq('student_id', studentId)
      .eq('is_active', true)

    return result
  }
}

export default studentService
