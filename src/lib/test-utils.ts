/// <reference types="jest" />

import { createClient } from '@supabase/supabase-js'

/**
 * Test utilities for Supabase
 */

// Test Supabase client
export const createTestSupabaseClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    return createClient(supabaseUrl, supabaseKey)
}

// Mock user data
export const mockUser = {
    id: 'test-user-id-123',
    email: 'test@example.com',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    role: 'authenticated',
}

export const mockSession = {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_in: 3600,
    expires_at: Date.now() / 1000 + 3600,
    token_type: 'bearer',
    user: mockUser,
}

// Mock Supabase responses
export const mockSupabaseResponses = {
    signInSuccess: {
        data: {
            user: mockUser,
            session: mockSession,
        },
        error: null,
    },
    signInError: {
        data: {
            user: null,
            session: null,
        },
        error: {
            message: 'Invalid login credentials',
            status: 400,
        },
    },
    sessionSuccess: {
        data: {
            session: mockSession,
        },
        error: null,
    },
    sessionNull: {
        data: {
            session: null,
        },
        error: null,
    },
}

// Helper to wait for async operations
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Helper to create mock Supabase client
export const createMockSupabaseClient = () => ({
    auth: {
        signInWithPassword: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
        getSession: jest.fn(),
        getUser: jest.fn(),
        resetPasswordForEmail: jest.fn(),
        updateUser: jest.fn(),
    },
    from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn(),
        limit: jest.fn().mockReturnThis(),
    })),
})
