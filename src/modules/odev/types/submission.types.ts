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

export enum SubmissionStatus {
    NOT_SUBMITTED = 'NOT_SUBMITTED',
    SUBMITTED = 'SUBMITTED',
    GRADED = 'GRADED',
    LATE = 'LATE'
}
