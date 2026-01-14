import { supabaseApi, QueryOptions } from '@/lib/supabase/api'
import type { TablesInsert, TablesUpdate } from '@/lib/supabase/types'

export const paymentService = {
  // ============ PAYMENTS ============

  /**
   * Get all payments
   */
  async getAll(options?: QueryOptions) {
    return await supabaseApi.getAll('payments', options)
  },

  /**
   * Get payment by ID
   */
  async getById(id: string) {
    return await supabaseApi.getById('payments', id)
  },

  /**
   * Create payment
   */
  async create(data: Partial<TablesInsert<'payments'>>) {
    return await supabaseApi.create('payments', data)
  },

  /**
   * Update payment
   */
  async update(id: string, data: Partial<TablesUpdate<'payments'>>) {
    return await supabaseApi.update('payments', id, data)
  },

  /**
   * Delete payment
   */
  async delete(id: string) {
    return await supabaseApi.delete('payments', id)
  },

  /**
   * Get payments by student
   */
  async getByStudent(studentId: string, options?: QueryOptions) {
    return await supabaseApi.getAll('payments', {
      ...options,
      filters: { studentId }
    })
  },

  /**
   * Mark payment as paid
   */
  async markAsPaid(paymentId: string) {
    return await supabaseApi.update('payments', paymentId, {
      status: 'paid',
      paidDate: new Date().toISOString()
    })
  },

  // ============ DEBTS ============

  /**
   * Get all debts
   */
  async getAllDebts(options?: QueryOptions) {
    return await supabaseApi.getAll('debts', options)
  },

  /**
   * Get debts by student
   */
  async getDebtsByStudent(studentId: string, options?: QueryOptions) {
    return await supabaseApi.getAll('debts', {
      ...options,
      filters: { studentId, status: 'pending' }
    })
  },

  /**
   * Create debt
   */
  async createDebt(data: Partial<TablesInsert<'debts'>>) {
    return await supabaseApi.create('debts', data)
  },

  /**
   * Pay debt
   */
  async payDebt(debtId: string) {
    return await supabaseApi.update('debts', debtId, {
      status: 'paid'
    })
  },

  // ============ PAYMENT PLANS ============

  /**
   * Get all payment plans
   */
  async getAllPlans(options?: QueryOptions) {
    return await supabaseApi.getAll('payment_plans', options)
  },

  /**
   * Get payment plans by student
   */
  async getPlansByStudent(studentId: string) {
    return await supabaseApi.getAll('payment_plans', {
      filters: { studentId }
    })
  },

  /**
   * Create payment plan
   */
  async createPlan(data: Partial<TablesInsert<'payment_plans'>>) {
    return await supabaseApi.create('payment_plans', data)
  },

  /**
   * Update payment plan
   */
  async updatePlan(id: string, data: Partial<TablesUpdate<'payment_plans'>>) {
    return await supabaseApi.update('payment_plans', id, data)
  },

  // ============ CATEGORIES ============

  /**
   * Get all payment categories
   */
  async getAllCategories(options?: QueryOptions) {
    return await supabaseApi.getAll('payment_categories', options)
  },

  /**
   * Create category
   */
  async createCategory(data: Partial<TablesInsert<'payment_categories'>>) {
    return await supabaseApi.create('payment_categories', data)
  }
}

export default paymentService
