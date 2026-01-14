import { supabaseApi } from '@/lib/supabase/api'

export const reportService = {
  /**
   * Generate academic report for student
   */
  async getAcademicReport(studentId: string, semesterId: string) {
    // Get student info
    const student = await supabaseApi.getById('students', studentId)
    
    // Get grades
    const grades = await supabaseApi.query('exam_results')
      .select(`
        *,
        exams (
          *,
          courses (*)
        )
      `)
      .eq('student_id', studentId)
      .eq('exams.semester_id', semesterId)

    // Get attendance
    const attendance = await supabaseApi.query('attendance')
      .select('status')
      .eq('student_id', studentId)
      .eq('semester_id', semesterId)

    return {
      success: true,
      data: {
        student: student.data,
        grades: grades.data,
        attendance: attendance.data
      }
    }
  },

  /**
   * Generate financial report for student
   */
  async getFinancialReport(studentId: string, semesterId?: string) {
    const filters: any = { studentId }
    if (semesterId) {
      filters.semesterId = semesterId
    }

    const payments = await supabaseApi.getAll('payments', { filters })
    const debts = await supabaseApi.getAll('debts', { filters })
    const balance = await supabaseApi.query('student_balances')
      .select('*')
      .eq('student_id', studentId)
      .single()

    return {
      success: true,
      data: {
        payments: payments.data,
        debts: debts.data,
        balance: balance.data
      }
    }
  },

  /**
   * Generate class report
   */
  async getClassReport(classId: string, semesterId: string) {
    const students = await supabaseApi.query('students')
      .select('*')
      .eq('class_id', classId)

    return {
      success: true,
      data: {
        students: students.data,
        classId,
        semesterId
      }
    }
  }
}

export default reportService
