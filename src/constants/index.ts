// App constants
export const APP_NAME = 'School Management System'
export const APP_DESCRIPTION = 'Comprehensive school management system'

// API constants
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Role constants
export const ROLES = {
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
  PARENT: 'PARENT',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

// Status constants
export const STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PENDING: 'PENDING',
} as const

export type Status = (typeof STATUS)[keyof typeof STATUS]

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]
