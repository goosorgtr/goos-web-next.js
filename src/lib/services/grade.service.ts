import { supabaseApi } from '@/lib/supabase/api'

export const gradeService = {
  /**
   * Get student grades
   */
  async getByStudent(studentId: string, semesterId?: string) {
    let query = supabaseApi.query('exam_results')
      .select(`
        *,
        exams (
          *,
          courses (*)
        )
      `)
      .eq('student_id', studentId)

    if (semesterId) {
      query = query.eq('exams.semester_id', semesterId)
    }

    return await query.order('exams.exam_date', { ascending: false })
  },

  /**
   * Get class average for exam
   */
  async getClassAverage(examId: string) {
    const results = await supabaseApi.query('exam_results')
      .select('score')
      .eq('exam_id', examId)

    if (!results.data || results.data.length === 0) {
      return { success: true, data: { average: 0, count: 0 } }
    }

    const total = results.data.reduce((sum: number, r: any) => sum + (r.score || 0), 0)
    const average = total / results.data.length

    return {
      success: true,
      data: {
        average: Math.round(average * 100) / 100,
        count: results.data.length
      }
    }
  }
}

export default gradeService
