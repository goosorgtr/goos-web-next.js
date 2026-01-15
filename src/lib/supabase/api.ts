/**
 * Supabase API Client Wrapper
 * 
 * This file provides a wrapper around Supabase queries to maintain
 * compatibility with the existing Axios-based API client while adding
 * automatic case conversion and type safety.
 */

import { supabase } from './client'
import type { Database, Tables, TablesInsert, TablesUpdate } from './types'
import {
    toCamelCase,
    toSnakeCase,
    handleSupabaseError,
    createSuccessResponse,
    buildPagination,
    buildFilters,
    type SupabaseSuccessResponse,
    type SupabaseErrorResponse
} from './helpers'

// ============================================
// TYPE DEFINITIONS
// ============================================

export type SupabaseResponse<T> = SupabaseSuccessResponse<T> | SupabaseErrorResponse

export interface QueryOptions {
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    filters?: Record<string, any>
}

// ============================================
// GENERIC CRUD OPERATIONS
// ============================================

/**
 * Get all records from a table with optional filtering and pagination
 */
export async function getAll<T extends keyof Database['public']['Tables']>(
    table: T,
    options: QueryOptions = {}
): Promise<SupabaseResponse<Tables<T>[]>> {
    try {
        const { page = 1, limit = 10, sortBy, sortOrder = 'asc', filters } = options

        let query = supabase.from(table).select('*', { count: 'exact' })

        // Apply filters
        if (filters) {
            const cleanFilters = buildFilters(toSnakeCase(filters))
            Object.entries(cleanFilters).forEach(([key, value]) => {
                query = query.eq(key, value)
            })
        }

        // Apply sorting
        if (sortBy) {
            const snakeSortBy = toSnakeCase({ [sortBy]: true })
            query = query.order(Object.keys(snakeSortBy)[0], { ascending: sortOrder === 'asc' })
        }

        // Apply pagination
        const { from, to } = buildPagination(page, limit)
        query = query.range(from, to)

        const { data, error, count } = await query

        if (error) {
            return handleSupabaseError(error)
        }

        // Convert snake_case to camelCase
        const camelData = toCamelCase<Tables<T>[]>(data || [])

        return createSuccessResponse(camelData, count || 0)
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        }
    }
}

/**
 * Get a single record by ID
 */
export async function getById<T extends keyof Database['public']['Tables']>(
    table: T,
    id: string
): Promise<SupabaseResponse<Tables<T>>> {
    try {
        const { data, error } = await supabase
            .from(table)
            .select('*')
            .eq('id', id as any)
            .single()

        if (error) {
            return handleSupabaseError(error)
        }

        // Convert snake_case to camelCase
        const camelData = toCamelCase<Tables<T>>(data)

        return createSuccessResponse(camelData)
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        }
    }
}

/**
 * Create a new record
 */
export async function create<T extends keyof Database['public']['Tables']>(
    table: T,
    data: Partial<TablesInsert<T>>
): Promise<SupabaseResponse<Tables<T>>> {
    try {
        // Convert camelCase to snake_case
        const snakeData = toSnakeCase(data)

        const { data: result, error } = await supabase
            .from(table)
            .insert(snakeData)
            .select()
            .single()

        if (error) {
            return handleSupabaseError(error)
        }

        // Convert snake_case to camelCase
        const camelData = toCamelCase<Tables<T>>(result)

        return createSuccessResponse(camelData)
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        }
    }
}

/**
 * Update a record by ID
 */
export async function update<T extends keyof Database['public']['Tables']>(
    table: T,
    id: string,
    data: Partial<TablesUpdate<T>>
): Promise<SupabaseResponse<Tables<T>>> {
    try {
        // Convert camelCase to snake_case
        const snakeData = toSnakeCase(data)

        const { data: result, error } = await supabase
            .from(table)
            .update(snakeData)
            .eq('id', id as any)
            .select()
            .single()

        if (error) {
            return handleSupabaseError(error)
        }

        // Convert snake_case to camelCase
        const camelData = toCamelCase<Tables<T>>(result)

        return createSuccessResponse(camelData)
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        }
    }
}

/**
 * Delete a record by ID
 */
export async function deleteById<T extends keyof Database['public']['Tables']>(
    table: T,
    id: string
): Promise<SupabaseResponse<null>> {
    try {
        const { error } = await supabase
            .from(table)
            .delete()
            .eq('id', id as any)

        if (error) {
            return handleSupabaseError(error)
        }

        return createSuccessResponse(null)
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        }
    }
}

// ============================================
// ADVANCED QUERY BUILDER
// ============================================

/**
 * Advanced query builder for complex queries
 * Returns a Supabase query builder instance for custom queries
 */
export function query<T extends keyof Database['public']['Tables']>(table: T) {
    return supabase.from(table)
}

// ============================================
// EXPORT API CLIENT
// ============================================

export const supabaseApi = {
    getAll,
    getById,
    create,
    update,
    delete: deleteById,
    query
}

export default supabaseApi
