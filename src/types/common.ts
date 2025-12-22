// Common types used across modules

// Base entity with timestamps
export interface BaseEntity {
  id: string
  createdAt: Date
  updatedAt: Date
}

// File upload types
export interface FileUpload {
  file: File
  preview?: string
}

export interface UploadedFile {
  id: string
  url: string
  name: string
  size: number
  type: string
  uploadedAt: Date
}

// Date range filter
export interface DateRange {
  start: Date
  end: Date
}

// Selection/Option types
export interface SelectOption<T = string> {
  label: string
  value: T
  disabled?: boolean
}

// Table column types
export interface TableColumn<T = any> {
  key: string
  label: string
  sortable?: boolean
  render?: (value: any, item: T) => React.ReactNode
}

// Form field types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea' | 'file'
  placeholder?: string
  required?: boolean
  options?: SelectOption[]
  validation?: any
}

// Notification types
export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: Date
}

// Class/Grade types
export interface Class {
  id: string
  name: string
  grade: number
  section: string
  teacherId: string
  studentIds: string[]
  capacity: number
  academicYear: string
}

export interface Subject {
  id: string
  name: string
  code: string
  description?: string
  teacherIds: string[]
}

// Time slot for schedules
export interface TimeSlot {
  day: 'Pazartesi' | 'Sal1' | 'Çar_amba' | 'Per_embe' | 'Cuma' | 'Cumartesi' | 'Pazar'
  startTime: string // HH:mm format
  endTime: string // HH:mm format
}

// Address type
export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

// Location coordinates
export interface Coordinates {
  latitude: number
  longitude: number
  accuracy?: number
  timestamp?: Date
}

// Generic list response
export interface ListResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
}

// Action result
export interface ActionResult {
  success: boolean
  message: string
  data?: any
}
