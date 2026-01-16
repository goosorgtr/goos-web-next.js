/**
 * Auth Module Type Definitions
 * 
 * This file contains all authentication-related type definitions.
 * These types are specific to the authentication layer and are separate from:
 * - Database types (lib/supabase/types.ts) - snake_case, raw DB format
 * - UI types (modules/kullanicilar/types/) - UI-specific fields like colors, avatars
 */

// ============================================
// CORE AUTH TYPES
// ============================================

/**
 * AuthUser - Minimal user information for authentication layer
 * Used in login/logout operations and session management
 */
export interface AuthUser {
    id: string
    email: string
    firstName?: string
    lastName?: string
    roleId?: string
    roleName?: string
    tcNo?: string
    isActive: boolean
}

/**
 * Role - User role structure
 */
export interface Role {
    id: string
    name: string
    isActive?: boolean
    createdAt?: string
}

/**
 * AuthSession - Session management structure
 */
export interface AuthSession {
    accessToken: string
    refreshToken?: string
    expiresAt: number
    user: AuthUser
}

/**
 * AuthResponse - Standard response format for auth operations
 */
export interface AuthResponse<T = AuthUser> {
    success: boolean
    data?: T
    message?: string
    session?: AuthSession
}

// ============================================
// CREDENTIAL TYPES
// ============================================

/**
 * LoginCredentials - Email and password login
 */
export interface LoginCredentials {
    email: string
    password: string
}

/**
 * TcLoginCredentials - TC Number and password login
 */
export interface TcLoginCredentials {
    tcNo: string
    password: string
}

/**
 * SignUpData - User registration data
 */
export interface SignUpData extends LoginCredentials {
    firstName: string
    lastName: string
    phone?: string
    roleId: string
    tcNo?: string
    gender?: 'male' | 'female' | 'other'
    dateOfBirth?: string
    address?: string
}

// ============================================
// AUTH SERVICE RESPONSE TYPES
// ============================================

/**
 * SignInResponse - Response from sign in operations
 */
export type SignInResponse = AuthResponse<AuthUser>

/**
 * SignUpResponse - Response from sign up operations
 */
export type SignUpResponse = AuthResponse<AuthUser>

/**
 * SessionResponse - Response from session operations
 */
export type SessionResponse = AuthResponse<AuthSession>
