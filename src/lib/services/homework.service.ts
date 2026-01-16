// Bu dosya backward compatibility için tutuluyor
// Yeni kod için modules/odev/services/homework.service.ts kullanılmalı
import { supabaseApi, QueryOptions } from '@/lib/supabase/api'
import { supabase } from '@/lib/supabase/client'
import type { TablesInsert, TablesUpdate } from '@/lib/supabase/types'
import { isValidUUID } from '@/lib/supabase/helpers'

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
    // Generate UUID for the new homework
    const id = crypto.randomUUID()
    
    // Boş string değerlerini ve geçersiz UUID'leri null'a çevir (UUID alanları için)
    const cleanData: any = { ...data }
    const uuidFields = ['classId', 'courseId', 'teacherId']
    uuidFields.forEach(field => {
      const value = cleanData[field]
      // Boş string, 'none' veya geçersiz UUID değerlerini null'a çevir
      if (value === '' || value === 'none' || (typeof value === 'string' && !isValidUUID(value))) {
        cleanData[field] = null
      }
    })
    
    // CreatedBy: Eğer verilmemişse veya geçersizse, mevcut kullanıcıyı al
    let cleanCreatedBy = cleanData.createdBy && isValidUUID(cleanData.createdBy) ? cleanData.createdBy : null
    if (!cleanCreatedBy) {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (authUser && authUser.id && isValidUUID(authUser.id)) {
          cleanCreatedBy = authUser.id
          console.log('✅ CreatedBy otomatik atandı:', cleanCreatedBy)
        }
      } catch (error) {
        console.error('Kullanıcı bilgisi alınırken hata:', error)
      }
    }
    cleanData.createdBy = cleanCreatedBy
    
    // Semester ID: Eğer verilmemişse veya geçersizse, aktif semester'ı al
    let cleanSemesterId = cleanData.semesterId && isValidUUID(cleanData.semesterId) ? cleanData.semesterId : null
    if (!cleanSemesterId) {
      try {
        // Supabase client'ı direkt kullan (daha güvenilir)
        const { data: activeSemester, error } = await supabase
          .from('semesters')
          .select('id')
          .eq('is_active', true)
          .limit(1)
          .single()
        
        if (!error && activeSemester && activeSemester.id && isValidUUID(activeSemester.id)) {
          cleanSemesterId = activeSemester.id
          console.log('✅ Aktif semester otomatik atandı:', cleanSemesterId)
        } else {
          console.warn('⚠️ Aktif semester bulunamadı:', error)
        }
      } catch (error) {
        console.error('Aktif semester alınırken hata:', error)
      }
    }
    cleanData.semesterId = cleanSemesterId
    
    // generalStatus ekle (eğer yoksa teslim tarihine göre belirle)
    const dueDateObj = cleanData.dueDate ? new Date(cleanData.dueDate) : null
    const now = new Date()
    const defaultGeneralStatus = dueDateObj && dueDateObj > now ? 'active' : 'waiting_for_grading'
    
    const homeworkData = {
      ...cleanData,
      id,
      generalStatus: cleanData.generalStatus || defaultGeneralStatus
    }
    
    const createResult = await supabaseApi.create('homeworks', homeworkData as any)
    
    if (!createResult.success || !cleanData.classId) {
      return createResult
    }

    // Sınıftaki TÜM öğrenciler için homework_status kayıtları oluştur (default: pending)
    const { data: allStudents, error: studentsError } = await supabaseApi.query('students')
      .select('id')
      .eq('class_id', cleanData.classId)
    
    if (studentsError) {
      console.error('Öğrenciler getirilirken hata:', studentsError)
      return createResult
    }
    
    if (allStudents && allStudents.length > 0) {
      // homework_status tablosuna toplu ekleme (id alanı yok, sadece homework_id, student_id, status, feedback, updated_at)
      const statusRecords = allStudents.map((student: any) => ({
        homework_id: id,
        student_id: student.id,
        status: 'pending' as const,
        feedback: null,
        updated_at: new Date().toISOString()
      }))
      
      // Supabase batch insert - tüm kayıtları tek seferde ekle
      const { error: insertError } = await supabaseApi.query('homework_status')
        .insert(statusRecords)
      
      if (insertError) {
        console.error('Homework status kayıtları eklenirken hata:', insertError)
        // Ödev oluşturuldu ama status kayıtları eklenemedi - yine de başarılı döndür
        // Çünkü ödev oluşturma başarılı oldu
      }
    }

    return createResult
  },

  /**
   * Update homework
   */
  async update(id: string, data: Partial<TablesUpdate<'homeworks'>>) {
    // Eğer due_date güncelleniyorsa ve geçmişse is_active false yap
    if (data.dueDate) {
      const dueDateObj = new Date(data.dueDate)
      const now = new Date()
      if (dueDateObj < now) {
        data.isActive = false
      }
    }
    
    // generalStatus güncelleniyorsa veya dueDate değişiyorsa hesapla
    // Not: Bu backward compatibility için basit bir implementasyon
    // Tam hesaplama için modules/odev/services/homework.service.ts kullanılmalı
    if (data.dueDate || data.generalStatus === undefined) {
      // Eğer dueDate değişiyorsa, generalStatus'ü hesapla
      const dueDate = data.dueDate
      if (dueDate) {
        const dueDateObj = new Date(dueDate)
        const now = new Date()
        // Basit hesaplama: teslim tarihine daha varsa 'active', yoksa 'pending'
        // Tam hesaplama için modules/odev/services/homework.service.ts kullanılmalı
        data.generalStatus = dueDateObj > now ? 'active' : 'pending'
      }
    }
    
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
   * Öğrencinin mevcut sınıfındaki ödevleri getirir
   */
  async getByStudent(studentId: string, options?: QueryOptions) {
    // Öğrencinin mevcut sınıfını bul
    const { data: studentClass } = await supabaseApi.query('student_classes')
      .select('class_id')
      .eq('student_id', studentId)
      .single()

    if (!studentClass) {
      return { success: true, data: [] }
    }

    // Sınıfın ödevlerini getir
    return await supabaseApi.getAll('homeworks', {
      ...options,
      filters: { classId: studentClass.class_id }
    })
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
  },

  /**
   * Update overdue homeworks to inactive and pending statuses to not_done
   * This function checks all active homeworks and sets is_active to false if due_date has passed
   * Also updates pending homework_status records to not_done for overdue homeworks
   */
  async updateOverdueHomeworks() {
    const now = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
    
    try {
      // Get all active homeworks with due_date in the past
      const { data, error } = await supabaseApi.query('homeworks')
        .select('id')
        .eq('is_active', true)
        .lt('due_date', now)

      if (error) {
        return { success: false, message: error.message }
      }

      if (!data || data.length === 0) {
        // Süresi geçmiş ödev yoksa, sadece pending olanları kontrol et
        await this.updatePendingToNotDone()
        return { success: true, data: { updated: 0 } }
      }

      // Update all overdue homeworks using batch update
      const ids = data.map((hw: any) => hw.id)
      
      // Supabase'de batch update için .in() kullanarak toplu güncelleme yapabiliriz
      const { error: updateError } = await supabaseApi.query('homeworks')
        .update({ is_active: false })
        .in('id', ids)

      if (updateError) {
        return { success: false, message: updateError.message }
      }

      // Süresi geçmiş ödevlerde pending olanları not_done yap
      await this.updatePendingToNotDone()

      return { success: true, data: { updated: ids.length } }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  },

  /**
   * Teslim tarihi geçmiş ödevlerde pending olan öğrenci durumlarını not_done yap
   */
  async updatePendingToNotDone() {
    const now = new Date().toISOString().split('T')[0]
    
    try {
      // Teslim tarihi geçmiş ödevleri bul
      const { data: overdueHomeworks } = await supabaseApi.query('homeworks')
        .select('id')
        .lte('due_date', now)

      if (!overdueHomeworks || overdueHomeworks.length === 0) {
        return { success: true, data: { updated: 0 } }
      }

      const homeworkIds = overdueHomeworks.map((hw: any) => hw.id)

      // Bu ödevlerde pending olan durumları bul
      const { data: pendingStatuses } = await supabaseApi.query('homework_status')
        .select('id')
        .in('homework_id', homeworkIds)
        .eq('status', 'pending')

      if (!pendingStatuses || pendingStatuses.length === 0) {
        return { success: true, data: { updated: 0 } }
      }

      // Pending olanları not_done yap
      const pendingIds = pendingStatuses.map((s: any) => s.id)
      const { error: updateError } = await supabaseApi.query('homework_status')
        .update({ status: 'not_done' })
        .in('id', pendingIds)

      if (updateError) {
        return { success: false, message: updateError.message }
      }

      return { success: true, data: { updated: pendingIds.length } }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }
}

export default homeworkService
