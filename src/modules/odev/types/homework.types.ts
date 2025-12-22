// Ödev modülü için TypeScript tipleri

export interface Homework {
  id: string
  title: string
  description: string
  dueDate: Date
  subject: string
  classId: string
  teacherId: string
  createdAt: Date
  updatedAt: Date
  status: HomeworkStatus
  attachments?: Attachment[]
}

export interface HomeworkSubmission {
  id: string
  homeworkId: string
  studentId: string
  submittedAt: Date
  content: string
  attachments?: Attachment[]
  grade?: number
  feedback?: string
  status: SubmissionStatus
}

export interface Attachment {
  id: string
  name: string
  url: string
  type: string
  size: number
}

export enum HomeworkStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CLOSED = 'CLOSED'
}

export enum SubmissionStatus {
  NOT_SUBMITTED = 'NOT_SUBMITTED',
  SUBMITTED = 'SUBMITTED',
  GRADED = 'GRADED',
  LATE = 'LATE'
}

export interface HomeworkFilters {
  classId?: string
  subject?: string
  status?: HomeworkStatus
  dateFrom?: Date
  dateTo?: Date
}

export interface CreateHomeworkInput {
  title: string
  description: string
  dueDate: Date
  subject: string
  classId: string
  attachments?: File[]
}

export interface UpdateHomeworkInput extends Partial<CreateHomeworkInput> {
  id: string
}

export interface SubmitHomeworkInput {
  homeworkId: string
  content: string
  attachments?: File[]
}

export interface GradeHomeworkInput {
  submissionId: string
  grade: number
  feedback?: string
}
