import { supabaseApi, QueryOptions } from '@/lib/supabase/api'
import type { TablesInsert, TablesUpdate } from '@/lib/supabase/types'

export const examService = {
  async getAll(options?: QueryOptions) {
    return await supabaseApi.getAll('exams', options)
  },

  async getById(id: string) {
    return await supabaseApi.getById('exams', id)
  },

  async create(data: Partial<TablesInsert<'exams'>>) {
    return await supabaseApi.create('exams', data)
  },

  async update(id: string, data: Partial<TablesUpdate<'exams'>>) {
    return await supabaseApi.update('exams', id, data)
  },

  async delete(id: string) {
    return await supabaseApi.delete('exams', id)
  },

  async getByClass(classId: string, options?: QueryOptions) {
    return await supabaseApi.getAll('exams', {
      ...options,
      filters: { classId }
    })
  },

  async getResults(examId: string) {
    return await supabaseApi.query('exam_results')
      .select(`
        *,
        students (
          *,
          users (*)
        )
      `)
      .eq('exam_id', examId)
  },

  async submitResult(data: Partial<TablesInsert<'exam_results'>>) {
    return await supabaseApi.create('exam_results', data)
  }
}

export default examService
