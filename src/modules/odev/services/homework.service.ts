import { supabaseApi, QueryOptions } from '@/lib/supabase/api'
import { supabase } from '@/lib/supabase/client'
import type { TablesInsert, TablesUpdate } from '@/lib/supabase/types'
import { isValidUUID } from '@/lib/supabase/helpers'
import type { HomeworkFilters, CreateHomeworkInput, UpdateHomeworkInput, SubmitHomeworkInput, GradeHomeworkInput } from '../types/homework.types'
import { HomeworkGeneralStatus } from '../types/homework.types'

/**
 * Ödev genel durumunu hesapla
 * - Tüm öğrenciler notlandırıldıysa (teslim tarihine gelmiş olsun veya olmasın) → 'graded' (Notlandırıldı)
 * - Teslim tarihine daha gelmediyse ve henüz notlandırılmadıysa → 'active' (Aktif Ödev)
 * - Teslim tarihi geçti/geldi ama henüz notlandırılmadıysa → 'waiting_for_grading' (Notlandırılmayı Bekliyor)
 * 
 * Notlandırılmış durumlar: 'done', 'not_done', 'incomplete'
 * Notlandırılmamış durum: 'pending' veya null
 */
export async function calculateGeneralStatus(homeworkId: string, dueDate: string): Promise<HomeworkGeneralStatus> {
  const now = new Date()
  const dueDateObj = new Date(dueDate)
  
  // Ödevin bilgilerini getir (classId için)
  const homeworkResult = await supabaseApi.getById('homeworks', homeworkId)
  if (!homeworkResult.success || !homeworkResult.data || !homeworkResult.data.classId || !dueDate) {
    // Veri yoksa teslim tarihine göre varsayılan döndür
    return dueDateObj > now ? HomeworkGeneralStatus.ACTIVE : HomeworkGeneralStatus.WAITING_FOR_GRADING
  }
  const homework = homeworkResult.data
  
  // Sınıftaki TÜM öğrencileri getir
  const { data: allStudents } = await supabaseApi.query('students')
    .select('id')
    .eq('class_id', homework.classId!)
  
  if (!allStudents || allStudents.length === 0) {
    // Sınıfta öğrenci yoksa teslim tarihine göre varsayılan döndür
    return dueDateObj > now ? HomeworkGeneralStatus.ACTIVE : HomeworkGeneralStatus.WAITING_FOR_GRADING
  }
  
  const totalStudents = allStudents.length
  
  // Ödeve ait öğrenci durumlarını getir
  const { data: statusRecords } = await supabaseApi.query('homework_status')
    .select('student_id, status')
    .eq('homework_id', homeworkId)
  
  if (!statusRecords || statusRecords.length === 0) {
    // Hiç durum kaydı yoksa teslim tarihine göre varsayılan döndür
    return dueDateObj > now ? HomeworkGeneralStatus.ACTIVE : HomeworkGeneralStatus.WAITING_FOR_GRADING
  }
  
  // Her öğrencinin durumunu kontrol et
  const studentIds = new Set(allStudents.map((s: any) => s.id))
  const statusMap = new Map(statusRecords.map((r: any) => [r.student_id, r.status]))
  
  // Tüm öğrenciler için durum kaydı var mı ve hepsi notlandırılmış mı?
  // Notlandırılmış durumlar: 'done', 'not_done', 'incomplete'
  // Notlandırılmamış durum: 'pending' veya null
  let allGraded = true
  let allStudentsHaveStatus = true
  
  for (const studentId of Array.from(studentIds)) {
    const status = statusMap.get(studentId)
    
    // Eğer öğrenci için status kaydı yoksa
    if (status === undefined || status === null) {
      allStudentsHaveStatus = false
      allGraded = false
      break
    }
    
    // Eğer status 'pending' ise, henüz notlandırılmamış demektir
    if (status === 'pending') {
      allGraded = false
      break
    }
  }
  
  // Tüm öğrenciler notlandırıldıysa (done, not_done veya incomplete) → 'graded'
  // ÖNEMLİ: Teslim tarihine gelmiş olsun veya olmasın, tüm öğrenciler notlandırıldıysa 'graded'
  if (allGraded && allStudentsHaveStatus && statusRecords.length === totalStudents) {
    return HomeworkGeneralStatus.GRADED
  }
  
  // Henüz notlandırılmadıysa teslim tarihine göre durum belirle
  if (dueDateObj > now) {
    // Teslim tarihine daha gelmediyse → 'active' (Aktif Ödev)
    return HomeworkGeneralStatus.ACTIVE
  } else {
    // Teslim tarihi geçti ama henüz notlandırılmadı → 'waiting_for_grading' (Notlandırılmayı Bekliyor)
    return HomeworkGeneralStatus.WAITING_FOR_GRADING
  }
}

/**
 * Ödev servisi - Supabase entegrasyonu
 */
export const homeworkService = {
  /**
   * Filtrelere göre ödevleri getir
   */
  async getHomeworks(filters?: HomeworkFilters) {
    const options: QueryOptions = {
      sortBy: 'due_date',
      sortOrder: 'desc',
      limit: 1000
    }

    if (filters) {
      const filterObj: Record<string, any> = {}
      
      if (filters.classId) filterObj.classId = filters.classId
      if (filters.teacherId) filterObj.teacherId = filters.teacherId
      if (filters.courseId) filterObj.courseId = filters.courseId
      if (filters.semesterId) filterObj.semesterId = filters.semesterId
      if (filters.isActive !== undefined) filterObj.isActive = filters.isActive

      if (Object.keys(filterObj).length > 0) {
        options.filters = filterObj
      }
    }

    return await supabaseApi.getAll('homeworks', options)
  },

  /**
   * ID'ye göre ödev getir
   */
  async getById(id: string) {
    return await supabaseApi.getById('homeworks', id)
  },

  /**
   * Yeni ödev oluştur
   */
  async createHomework(data: CreateHomeworkInput) {
    // Generate UUID for the new homework
    const id = crypto.randomUUID()
    
    // UUID alanlarını validate et ve geçersiz değerleri null'a çevir
    const cleanClassId = data.classId && isValidUUID(data.classId) ? data.classId : null
    const cleanCourseId = data.courseId && isValidUUID(data.courseId) ? data.courseId : null
    const cleanTeacherId = data.teacherId && isValidUUID(data.teacherId) ? data.teacherId : null
    
    // CreatedBy: Eğer verilmemişse veya geçersizse, mevcut kullanıcıyı al
    let cleanCreatedBy = data.createdBy && isValidUUID(data.createdBy) ? data.createdBy : null
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
    
    // Semester ID: Eğer verilmemişse veya geçersizse, aktif semester'ı al
    let cleanSemesterId = data.semesterId && isValidUUID(data.semesterId) ? data.semesterId : null
    if (!cleanSemesterId) {
      try {
        // Supabase client'ı direkt kullan (daha güvenilir)
        const { data: activeSemester, error } = await supabase
          .from('semesters')
          .select('id')
          .eq('is_active', true)
          .limit(1)
          .single()
        
        if (!error && activeSemester) {
          const semesterId = (activeSemester as any).id
          if (semesterId && isValidUUID(semesterId)) {
            cleanSemesterId = semesterId
            console.log('✅ Aktif semester otomatik atandı:', cleanSemesterId)
          }
        } else {
          console.warn('⚠️ Aktif semester bulunamadı:', error)
        }
      } catch (error) {
        console.error('Aktif semester alınırken hata:', error)
      }
    }
    
    // due_date geçmişse is_active false olacak
    const dueDateObj = new Date(data.dueDate)
    const now = new Date()
    const isActive = dueDateObj >= now
    
    // Yeni ödev için general_status: teslim tarihine gelmediyse 'active' (Aktif), geçtiyse 'waiting_for_grading'
    const generalStatus = dueDateObj > now ? HomeworkGeneralStatus.ACTIVE : HomeworkGeneralStatus.WAITING_FOR_GRADING

    const homeworkData: any = {
      id,
      title: data.title,
      description: data.description || null,
      dueDate: data.dueDate,
      classId: cleanClassId,
      courseId: cleanCourseId,
      teacherId: cleanTeacherId,
      semesterId: cleanSemesterId,
      isActive: data.isActive !== undefined ? data.isActive : isActive,
      generalStatus: generalStatus,
      createdBy: cleanCreatedBy
    }

    const createResult = await supabaseApi.create('homeworks', homeworkData as any)
    
    if (!createResult.success) {
      return createResult
    }

    // Sınıftaki TÜM öğrenciler için homework_status kayıtları oluştur (default: pending)
    if (!cleanClassId) {
      return createResult
    }
    
    const { data: allStudents, error: studentsError } = await supabaseApi.query('students')
      .select('id')
      .eq('class_id', cleanClassId)
    
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
        .insert(statusRecords as any)
      
      if (insertError) {
        console.error('Homework status kayıtları eklenirken hata:', insertError)
        // Ödev oluşturuldu ama status kayıtları eklenemedi - yine de başarılı döndür
        // Çünkü ödev oluşturma başarılı oldu
      }
    }

    return createResult
  },

  /**
   * Ödev güncelle
   */
  async updateHomework(id: string, data: UpdateHomeworkInput) {
    const updateData: Partial<TablesUpdate<'homeworks'>> = {}
    
    // Önce mevcut ödevi getir (dueDate için)
    const currentHomeworkResult = await supabaseApi.getById('homeworks', id)
    const currentHomework = currentHomeworkResult.success ? currentHomeworkResult.data : null
    const dueDate = data.dueDate || currentHomework?.dueDate
    
    if (data.title !== undefined) updateData.title = data.title
    if (data.description !== undefined) updateData.description = data.description
    if (data.dueDate !== undefined) {
      updateData.dueDate = data.dueDate
      // due_date geçmişse is_active false yap
      const dueDateObj = new Date(data.dueDate)
      const now = new Date()
      if (dueDateObj < now) {
        updateData.isActive = false
      }
      // general_status hesapla
      if (dueDate) {
        updateData.generalStatus = await calculateGeneralStatus(id, dueDate) as any
      }
    }
    // UUID alanlarını validate et ve geçersiz değerleri null'a çevir
    if (data.classId !== undefined) {
      updateData.classId = data.classId && isValidUUID(data.classId) ? data.classId : null
    }
    if (data.courseId !== undefined) {
      updateData.courseId = data.courseId && isValidUUID(data.courseId) ? data.courseId : null
    }
    if (data.teacherId !== undefined) {
      updateData.teacherId = data.teacherId && isValidUUID(data.teacherId) ? data.teacherId : null
    }
    if (data.semesterId !== undefined) {
      updateData.semesterId = data.semesterId && isValidUUID(data.semesterId) ? data.semesterId : null
    }
    if (data.isActive !== undefined) updateData.isActive = data.isActive

    return await supabaseApi.update('homeworks', id, updateData)
  },

  /**
   * Ödev sil
   */
  async deleteHomework(id: string) {
    return await supabaseApi.delete('homeworks', id)
  },

  /**
   * Öğrenci ödev teslim eder
   */
  async submitHomework(homeworkId: string, data: SubmitHomeworkInput) {
    // homework_status tablosuna kayıt oluştur veya güncelle
    const { data: existingStatus } = await supabaseApi.query('homework_status')
      .select('*')
      .eq('homework_id', homeworkId)
      .eq('student_id', data.studentId)
      .single()

    let result
    if (existingStatus) {
      // Mevcut kaydı güncelle (composite key kullanarak - id kolonu yok)
      const { data: updated, error } = await (supabaseApi.query('homework_status') as any)
        .update({
        status: 'done',
        feedback: data.content || null,
        updated_at: new Date().toISOString()
      })
        .eq('homework_id', homeworkId)
        .eq('student_id', data.studentId)
        .select()
        .single()
      
      if (error) {
        return {
          success: false,
          message: error.message || 'Ödev durumu güncellenirken bir hata oluştu'
        }
      }
      
      result = {
        success: true,
        data: updated
      }
    } else {
      // Yeni kayıt oluştur (id kolonu yok)
      const { data: created, error } = await supabaseApi.query('homework_status')
        .insert({
        homework_id: homeworkId,
        student_id: data.studentId,
        status: 'done',
        feedback: data.content || null,
        updated_at: new Date().toISOString()
      } as any)
        .select()
        .single()
      
      if (error) {
        return {
          success: false,
          message: error.message || 'Ödev durumu oluşturulurken bir hata oluştu'
        }
      }
      
      result = {
        success: true,
        data: created
      }
    }
    
    // general_status'ü güncelle
    const homeworkResult = await supabaseApi.getById('homeworks', homeworkId)
    if (homeworkResult.success && homeworkResult.data?.dueDate) {
      const newGeneralStatus = await calculateGeneralStatus(homeworkId, homeworkResult.data.dueDate)
      await supabaseApi.update('homeworks', homeworkId, {
        generalStatus: newGeneralStatus as any
      })
    }
    
    return result
  },

  /**
   * Öğretmen ödev notlar
   */
  async gradeHomework(homeworkId: string, studentId: string, grade: number, feedback?: string) {
    // homework_status kaydını bul
    const { data: statusRecord } = await supabaseApi.query('homework_status')
      .select('*')
      .eq('homework_id', homeworkId)
      .eq('student_id', studentId)
      .single()

    if (!statusRecord) {
      return {
        success: false,
        message: 'Ödev durumu bulunamadı'
      }
    }

    // Notu ve geri bildirimi güncelle (composite key kullanarak - id kolonu yok)
    const { data: updated, error } = await (supabaseApi.query('homework_status') as any)
      .update({
      status: 'done',
      feedback: feedback || null,
      updated_at: new Date().toISOString()
    })
      .eq('homework_id', homeworkId)
      .eq('student_id', studentId)
      .select()
      .single()
    
    if (error) {
      return {
        success: false,
        message: error.message || 'Ödev durumu güncellenirken bir hata oluştu'
      }
    }
    
    const updateResult = {
      success: true,
      data: updated
    }
    
    // general_status'ü güncelle
    const homeworkResult = await supabaseApi.getById('homeworks', homeworkId)
    if (homeworkResult.success && homeworkResult.data?.dueDate) {
      const newGeneralStatus = await calculateGeneralStatus(homeworkId, homeworkResult.data.dueDate)
      await supabaseApi.update('homeworks', homeworkId, {
        generalStatus: newGeneralStatus as any
      })
    }
    
    return updateResult
  },

  /**
   * Sınıfa göre ödevleri getir
   */
  async getByClass(classId: string, options?: QueryOptions) {
    return await supabaseApi.getAll('homeworks', {
      ...options,
      filters: { classId }
    })
  },

  /**
   * Öğretmene göre ödevleri getir
   */
  async getByTeacher(teacherId: string, options?: QueryOptions) {
    return await supabaseApi.getAll('homeworks', {
      ...options,
      filters: { teacherId }
    })
  },

  /**
   * Öğrencinin mevcut sınıfındaki ödevleri getir
   */
  async getByStudent(studentId: string, options?: QueryOptions) {
    // Öğrencinin mevcut sınıfını bul
    const { data: studentClass } = await (supabaseApi.query as any)('student_classes')
      .select('class_id')
      .eq('student_id', studentId)
      .single()

    if (!studentClass || !(studentClass as any).class_id) {
      return { success: true, data: [] }
    }

    // Sınıfın ödevlerini getir
    return await supabaseApi.getAll('homeworks', {
      ...options,
      filters: { classId: (studentClass as any).class_id }
    })
  },

  /**
   * Öğrencinin tüm ödev durumlarını getir (sınıf değişikliğinden bağımsız)
   */
  async getStudentHomeworkStatuses(studentId: string) {
    const { data, error } = await supabaseApi.query('homework_status')
      .select('*')
      .eq('student_id', studentId)
      .order('updated_at', { ascending: false })

    if (error) {
      return { success: false, message: error.message }
    }

    return { success: true, data: data || [] }
  },

  /**
   * Öğrencinin ödev durumlarını ödev bilgileriyle birlikte getir
   */
  async getStudentHomeworksWithStatus(studentId: string) {
    // Öğrencinin tüm ödev durumlarını getir
    const statusResult = await this.getStudentHomeworkStatuses(studentId)
    if (!statusResult.success) {
      return statusResult
    }

    const statuses = statusResult.data || []
    if (statuses.length === 0) {
      return { success: true, data: [] }
    }

    // Ödev ID'lerini topla
    const homeworkIds = Array.from(new Set(statuses.map((s: any) => s.homework_id)))

    // Ödevleri getir
    const { data: homeworks, error } = await supabaseApi.query('homeworks')
      .select('*')
      .in('id', homeworkIds)
      .order('due_date', { ascending: false })

    if (error) {
      return { success: false, message: error.message }
    }

    // Ödevleri durumlarıyla birleştir
    const homeworksWithStatus = (homeworks || []).map((homework: any) => {
      const status = (statuses as any[]).find((s: any) => s.homework_id === homework.id)
      return {
        ...homework,
        status: status?.status || null,
        feedback: status?.feedback || null,
        statusUpdatedAt: status?.updated_at || null
      }
    })

    return { success: true, data: homeworksWithStatus }
  },

  /**
   * Süresi geçmiş ödevleri pasif yap ve pending olanları not_done yap
   */
  async updateOverdueHomeworks() {
    const now = new Date().toISOString().split('T')[0]
    
    try {
      // Süresi geçmiş aktif ödevleri bul
      const { data: overdueHomeworks, error } = await supabaseApi.query('homeworks')
        .select('id, due_date')
        .eq('is_active', true)
        .lt('due_date', now)

      if (error) {
        return { success: false, message: error.message }
      }

      if (!overdueHomeworks || overdueHomeworks.length === 0) {
        // Süresi geçmiş ödev yoksa, sadece pending olanları kontrol et
        await this.updatePendingToNotDone()
        return { success: true, data: { updated: 0 } }
      }

      const ids = overdueHomeworks.map((hw: any) => hw.id)
      
      // is_active false yap
      const { error: updateError } = await (supabaseApi.query('homeworks') as any)
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

      // Bu ödevlerde pending olan durumları bul (id kolonu yok, homework_id ve student_id kullanıyoruz)
      const { data: pendingStatuses } = await supabaseApi.query('homework_status')
        .select('homework_id, student_id')
        .in('homework_id', homeworkIds)
        .eq('status', 'pending')

      if (!pendingStatuses || pendingStatuses.length === 0) {
        return { success: true, data: { updated: 0 } }
      }

      // Pending olanları not_done yap (composite key kullanarak - id kolonu yok)
      // Her bir kayıt için ayrı ayrı update yapmalıyız çünkü composite key kullanıyoruz
      let updatedCount = 0
      for (const status of pendingStatuses) {
        const statusAny = status as any
        const { error: updateError } = await (supabaseApi.query('homework_status') as any)
        .update({ status: 'not_done' })
          .eq('homework_id', statusAny.homework_id)
          .eq('student_id', statusAny.student_id)

        if (!updateError) {
          updatedCount++
        }
      }

      // general_status'leri güncelle
      for (const homeworkId of homeworkIds) {
        const homeworkResult = await supabaseApi.getById('homeworks', homeworkId)
        if (homeworkResult.success && homeworkResult.data?.dueDate) {
          const newGeneralStatus = await calculateGeneralStatus(homeworkId, homeworkResult.data.dueDate)
          await supabaseApi.update('homeworks', homeworkId, {
            generalStatus: newGeneralStatus as any
          })
        }
      }

      return { success: true, data: { updated: updatedCount } }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }
}

export default homeworkService

