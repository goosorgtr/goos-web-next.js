// Generic API response types
export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
}

export interface ApiError {
  success: false
  message: string
  errors?: Record<string, string[]>
  statusCode?: number
}

// Pagination types
export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Query filter types
export interface QueryFilters {
  search?: string
  status?: string
  role?: string
  dateFrom?: string
  dateTo?: string
  [key: string]: any
}

// API request config
export interface ApiRequestConfig {
  params?: Record<string, any>
  headers?: Record<string, string>
  signal?: AbortSignal
}
