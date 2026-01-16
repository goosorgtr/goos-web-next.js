// Ödev modülü için TypeScript tipleri - Supabase uyumlu

export type HomeworkStatusType = 'done' | 'not_done' | 'incomplete' | 'pending' | null

export enum HomeworkGeneralStatus {
  ACTIVE = 'active',                    // Aktif Ödev (teslim tarihi henüz gelmedi)
  PENDING = 'pending',                  // Bekliyor (başlangıç durumu)
  WAITING_FOR_GRADING = 'waiting_for_grading',  // Notlandırılmayı Bekliyor (teslim tarihi geçti/geldi, henüz notlandırılmadı)
  GRADED = 'graded'                     // Notlandırıldı (tüm öğrenciler notlandırıldı)
}

export interface Homework {
  id: string
  courseId: string | null
  classId: string | null
  teacherId: string | null
  semesterId: string | null
  title: string | null
  description: string | null
  dueDate: string | null // ISO date string
  isActive: boolean | null
  generalStatus: HomeworkGeneralStatus | null
  createdBy: string | null
  updatedAt: string | null
}

export interface HomeworkStatus {
  homework_id: string
  student_id: string
  status: HomeworkStatusType
  feedback: string | null
  updated_at: string | null
}

export interface HomeworkFilters {
  classId?: string
  teacherId?: string
  courseId?: string
  semesterId?: string
  isActive?: boolean
  searchQuery?: string
  dueDateFrom?: string
  dueDateTo?: string
}

export interface CreateHomeworkInput {
  title: string
  description?: string | null
  dueDate: string // ISO date string
  classId: string
  courseId: string
  teacherId: string
  semesterId?: string | null
  isActive?: boolean
  createdBy?: string | null
}

export interface UpdateHomeworkInput extends Partial<CreateHomeworkInput> {
  id: string
}

export interface SubmitHomeworkInput {
  homeworkId: string
  studentId: string
  content?: string
  fileUrl?: string
}

export interface GradeHomeworkInput {
  homeworkId: string
  studentId: string
  grade: number
  feedback?: string
}
