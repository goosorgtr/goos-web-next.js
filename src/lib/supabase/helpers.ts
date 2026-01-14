import { PostgrestError } from '@supabase/supabase-js'

// ============================================
// CASE CONVERSION UTILITIES
// ============================================

/**
 * Converts a snake_case string to camelCase
 * @example snakeToCamel('first_name') => 'firstName'
 */
export function snakeToCamel(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * Converts a camelCase string to snake_case
 * @example camelToSnake('firstName') => 'first_name'
 */
export function camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

/**
 * Recursively converts all keys in an object from snake_case to camelCase
 * @param obj - Object with snake_case keys
 * @returns Object with camelCase keys
 */
export function toCamelCase<T = any>(obj: any): T {
    if (obj === null || obj === undefined) {
        return obj
    }

    if (Array.isArray(obj)) {
        return obj.map((item) => toCamelCase(item)) as T
    }

    if (typeof obj === 'object' && obj.constructor === Object) {
        return Object.keys(obj).reduce((acc, key) => {
            const camelKey = snakeToCamel(key)
            acc[camelKey] = toCamelCase(obj[key])
            return acc
        }, {} as any) as T
    }

    return obj
}

/**
 * Recursively converts all keys in an object from camelCase to snake_case
 * @param obj - Object with camelCase keys
 * @returns Object with snake_case keys
 */
export function toSnakeCase<T = any>(obj: any): T {
    if (obj === null || obj === undefined) {
        return obj
    }

    if (Array.isArray(obj)) {
        return obj.map((item) => toSnakeCase(item)) as T
    }

    if (typeof obj === 'object' && obj.constructor === Object) {
        return Object.keys(obj).reduce((acc, key) => {
            const snakeKey = camelToSnake(key)
            acc[snakeKey] = toSnakeCase(obj[key])
            return acc
        }, {} as any) as T
    }

    return obj
}

/**
 * Transforms an array of objects from snake_case to camelCase
 * @param array - Array of objects with snake_case keys
 * @returns Array of objects with camelCase keys
 */
export function transformArray<T = any>(array: any[]): T[] {
    return array.map((item) => toCamelCase<T>(item))
}

// ============================================
// ERROR HANDLING
// ============================================

/**
 * Standard error response format
 */
export interface SupabaseErrorResponse {
    success: false
    message: string
    code?: string
    details?: string
    hint?: string
}

/**
 * Handles Supabase errors and returns a standardized error object
 * @param error - Supabase PostgrestError
 * @returns Standardized error response
 */
export function handleSupabaseError(
    error: PostgrestError | null
): SupabaseErrorResponse {
    if (!error) {
        return {
            success: false,
            message: 'An unknown error occurred'
        }
    }

    return {
        success: false,
        message: error.message || 'Database operation failed',
        code: error.code,
        details: error.details,
        hint: error.hint
    }
}

/**
 * Checks if a Supabase response has an error
 * @param error - Supabase error object
 * @returns True if there is an error
 */
export function hasError(error: PostgrestError | null): boolean {
    return error !== null
}

// ============================================
// QUERY HELPERS
// ============================================

/**
 * Builds a Supabase select query with common patterns
 * @param columns - Columns to select (default: '*')
 * @returns Select query string
 */
export function buildSelectQuery(columns: string[] = ['*']): string {
    return columns.join(', ')
}

/**
 * Builds pagination parameters for Supabase queries
 * @param page - Page number (1-indexed)
 * @param limit - Items per page
 * @returns Object with from and to range
 */
export function buildPagination(page: number = 1, limit: number = 10) {
    const from = (page - 1) * limit
    const to = from + limit - 1
    return { from, to }
}

/**
 * Builds filter object for Supabase queries
 * @param filters - Object with filter key-value pairs
 * @returns Cleaned filter object (removes null/undefined values)
 */
export function buildFilters<T extends Record<string, any>>(filters: T): Partial<T> {
    return Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
            acc[key as keyof T] = value
        }
        return acc
    }, {} as Partial<T>)
}

// ============================================
// DATA TRANSFORMATION HELPERS
// ============================================

/**
 * Safely parses JSON data
 * @param data - JSON string or object
 * @returns Parsed object or null
 */
export function safeJsonParse<T = any>(data: string | null | undefined): T | null {
    if (!data) return null

    try {
        return typeof data === 'string' ? JSON.parse(data) : data
    } catch {
        return null
    }
}

/**
 * Formats a date string to ISO format
 * @param date - Date object or string
 * @returns ISO date string
 */
export function formatDateForDb(date: Date | string): string {
    if (typeof date === 'string') {
        return new Date(date).toISOString()
    }
    return date.toISOString()
}

/**
 * Checks if a value is a valid UUID
 * @param value - String to check
 * @returns True if valid UUID
 */
export function isValidUUID(value: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    return uuidRegex.test(value)
}

/**
 * Removes undefined values from an object
 * @param obj - Object to clean
 * @returns Object without undefined values
 */
export function removeUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        if (value !== undefined) {
            acc[key as keyof T] = value
        }
        return acc
    }, {} as Partial<T>)
}

// ============================================
// RESPONSE HELPERS
// ============================================

/**
 * Standard success response format
 */
export interface SupabaseSuccessResponse<T> {
    success: true
    data: T
    count?: number
}

/**
 * Creates a standardized success response
 * @param data - Response data
 * @param count - Optional count for pagination
 * @returns Standardized success response
 */
export function createSuccessResponse<T>(
    data: T,
    count?: number
): SupabaseSuccessResponse<T> {
    return {
        success: true,
        data,
        ...(count !== undefined && { count })
    }
}

/**
 * Type guard to check if response is successful
 * @param response - Response object
 * @returns True if response is successful
 */
export function isSuccessResponse<T>(
    response: SupabaseSuccessResponse<T> | SupabaseErrorResponse
): response is SupabaseSuccessResponse<T> {
    return response.success === true
}
