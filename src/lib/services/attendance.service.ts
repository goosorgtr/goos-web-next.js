import { supabaseApi, QueryOptions } from '@/lib/supabase/api'
import type { TablesInsert, TablesUpdate } from '@/lib/supabase/types'

export const attendanceService = {
  /**
   * Get all attendance records
   */
  async getAll(options?: QueryOptions) {
    return await supabaseApi.getAll('attendance', options)
  },

  /**
   * Get attendance by ID
   */
  async getById(id: string) {
    return await supabaseApi.getById('attendance', id)
  },

  /**
   * Create attendance record
   */
  async create(data: Partial<TablesInsert<'attendance'>>) {
    return await supabaseApi.create('attendance', data)
  },

  /**
   * Update attendance
   */
  async update(id: string, data: Partial<TablesUpdate<'attendance'>>) {
    return await supabaseApi.update('attendance', id, data)
  },

  /**
   * Delete attendance
   */
  async delete(id: string) {
    return await supabaseApi.delete('attendance', id)
  },

  /**
   * Get attendance by student
   */
  async getByStudent(studentId: string, options?: QueryOptions) {
    return await supabaseApi.getAll('attendance', {
      ...options,
      filters: { studentId },
      sortBy: 'date',
      sortOrder: 'desc'
    })
  },

  /**
   * Get attendance by class and date
   */
  async getByClassAndDate(classId: string, date: string) {
    return await supabaseApi.query('attendance')
      .select(`
        *,
        students (
          *,
          users (*)
        )
      `)
      .eq('class_id', classId)
      .eq('date', date)
  },

  /**
   * Bulk create attendance (for taking attendance)
   */
  async bulkCreate(records: Array<Partial<TablesInsert<'attendance'>>>) {
    const promises = records.map(record => 
      supabaseApi.create('attendance', record)
    )
    return await Promise.all(promises)
  },

  /**
   * Get attendance statistics for student
   */
  async getStudentStats(studentId: string, semesterId?: string) {
    const filters: any = { studentId }
    if (semesterId) {
      filters.semesterId = semesterId
    }

    const result = await supabaseApi.query('attendance')
      .select('status')
      .match(filters)

    if (!result.data) {
      return {
        success: true,
        data: {
          total: 0,
          present: 0,
          absent: 0,
          late: 0,
          excused: 0,
          rate: 0
        }
      }
    }

    const stats = {
      total: result.data.length,
      present: result.data.filter((r: any) => r.status === 'present').length,
      absent: result.data.filter((r: any) => r.status === 'absent').length,
      late: result.data.filter((r: any) => r.status === 'late').length,
      excused: result.data.filter((r: any) => r.status === 'excused').length,
      rate: 0
    }

    if (stats.total > 0) {
      stats.rate = (stats.present / stats.total) * 100
    }

    return { success: true, data: stats }
  }
}

export default attendanceService
