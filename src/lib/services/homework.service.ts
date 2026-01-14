import { supabaseApi, QueryOptions } from '@/lib/supabase/api'
import type { TablesInsert, TablesUpdate } from '@/lib/supabase/types'

export const homeworkService = {
  /**
   * Get all homework
   */
  async getAll(options?: QueryOptions) {
    return await supabaseApi.getAll('homeworks', options)
  },

  /**
   * Get homework by ID
   */
  async getById(id: string) {
    return await supabaseApi.getById('homeworks', id)
  },

  /**
   * Create new homework
   */
  async create(data: Partial<TablesInsert<'homeworks'>>) {
    return await supabaseApi.create('homeworks', data)
  },

  /**
   * Update homework
   */
  async update(id: string, data: Partial<TablesUpdate<'homeworks'>>) {
    return await supabaseApi.update('homeworks', id, data)
  },

  /**
   * Delete homework
   */
  async delete(id: string) {
    return await supabaseApi.delete('homeworks', id)
  },

  /**
   * Get homework by class
   */
  async getByClass(classId: string, options?: QueryOptions) {
    return await supabaseApi.getAll('homeworks', {
      ...options,
      filters: { classId }
    })
  },

  /**
   * Get homework by teacher
   */
  async getByTeacher(teacherId: string, options?: QueryOptions) {
    return await supabaseApi.getAll('homeworks', {
      ...options,
      filters: { teacherId }
    })
  },

  /**
   * Get homework by student
   */
  async getByStudent(studentId: string, options?: QueryOptions) {
    const result = await supabaseApi.query('homeworks')
      .select(`
        *,
        classes (
          id,
          name,
          student_classes!inner (
            student_id
          )
        )
      `)
      .eq('classes.student_classes.student_id', studentId)
      .order('due_date', { ascending: false })

    return result
  },

  /**
   * Submit homework
   */
  async submit(homeworkId: string, studentId: string, submissionData: {
    content?: string
    fileUrl?: string
  }) {
    // Create or update homework status record
    const statusResult = await supabaseApi.query('homework_status_records')
      .select('*')
      .eq('homework_id', homeworkId)
      .eq('student_id', studentId)
      .single()

    if (statusResult.data) {
      // Update existing record
      return await supabaseApi.update('homework_status_records', statusResult.data.id, {
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        ...submissionData
      })
    } else {
      // Create new record
      return await supabaseApi.create('homework_status_records', {
        homeworkId,
        studentId,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        ...submissionData
      })
    }
  },

  /**
   * Grade homework
   */
  async grade(statusRecordId: string, grade: number, feedback?: string) {
    return await supabaseApi.update('homework_status_records', statusRecordId, {
      status: 'graded',
      grade,
      feedback
    })
  },

  /**
   * Get homework statistics
   */
  async getStats(homeworkId: string) {
    const result = await supabaseApi.query('homework_status_records')
      .select('status')
      .eq('homework_id', homeworkId)

    if (!result.data) {
      return {
        success: true,
        data: {
          total: 0,
          pending: 0,
          submitted: 0,
          graded: 0,
          late: 0
        }
      }
    }

    const stats = {
      total: result.data.length,
      pending: result.data.filter((r: any) => r.status === 'pending').length,
      submitted: result.data.filter((r: any) => r.status === 'submitted').length,
      graded: result.data.filter((r: any) => r.status === 'graded').length,
      late: result.data.filter((r: any) => r.status === 'late').length,
    }

    return { success: true, data: stats }
  }
}

export default homeworkService
