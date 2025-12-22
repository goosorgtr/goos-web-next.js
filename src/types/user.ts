import { Role, Status } from '@/constants'

// Base user interface
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: Role
  status: Status
  avatar?: string
  phone?: string
  createdAt: Date
  updatedAt: Date
}

// Admin specific fields
export interface Admin extends User {
  role: typeof import('@/constants').ROLES.ADMIN
  permissions: AdminPermission[]
}

export type AdminPermission =
  | 'manage_users'
  | 'manage_classes'
  | 'manage_courses'
  | 'view_reports'
  | 'manage_payments'
  | 'manage_canteen'
  | 'manage_transport'
  | 'manage_settings'

// Teacher specific fields
export interface Teacher extends User {
  role: typeof import('@/constants').ROLES.TEACHER
  employeeId: string
  department: string
  subjects: string[]
  classes: ClassInfo[]
}

// Student specific fields
export interface Student extends User {
  role: typeof import('@/constants').ROLES.STUDENT
  studentId: string
  classId: string
  className: string
  grade: number
  section: string
  parentIds: string[]
  canteenBalance: number
  transportRoute?: string
}

// Parent specific fields
export interface Parent extends User {
  role: typeof import('@/constants').ROLES.PARENT
  students: StudentInfo[]
  canAddCanteenBalance: boolean
}

// Kantinci (Canteen Worker) specific fields
export interface Kantinci extends User {
  role: typeof import('@/constants').ROLES.KANTINCI
  employeeId: string
  canManageProducts: boolean
  canManageOrders: boolean
  canViewReports: boolean
}

// Servici (Bus Driver) specific fields
export interface Servici extends User {
  role: typeof import('@/constants').ROLES.SERVICI
  employeeId: string
  licenseNumber: string
  routes: RouteInfo[]
  vehicleId?: string
}

// Helper types
export interface ClassInfo {
  id: string
  name: string
  grade: number
  section: string
}

export interface StudentInfo {
  id: string
  name: string
  className: string
  grade: number
}

export interface RouteInfo {
  id: string
  name: string
  stops: string[]
  students: string[]
}

// Union type for all user types
export type AnyUser = Admin | Teacher | Student | Parent | Kantinci | Servici

// Auth related types
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  role: Role
  phone?: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

// User profile update types
export interface UpdateProfileData {
  firstName?: string
  lastName?: string
  phone?: string
  avatar?: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}
