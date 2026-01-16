/**
 * Auth Service Unit Tests
 * 
 * Tests for authentication service including:
 * - Email/password login
 * - TC number login
 * - Sign up
 * - Sign out
 * - Session management
 */

import { authService } from '../auth.service'
import { supabase } from '@/lib/supabase/client'
import type { LoginCredentials, TcLoginCredentials } from '@/modules/auth/types'

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
    supabase: {
        auth: {
            signInWithPassword: jest.fn(),
            signUp: jest.fn(),
            signOut: jest.fn(),
            getSession: jest.fn(),
            getUser: jest.fn(),
            resetPasswordForEmail: jest.fn(),
            updateUser: jest.fn(),
            admin: {
                deleteUser: jest.fn(),
            },
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
    },
}))

// Mock Supabase API
jest.mock('@/lib/supabase/api', () => ({
    supabaseApi: {
        create: jest.fn(),
    },
}))

describe('Auth Service', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        // Suppress console logs in tests
        jest.spyOn(console, 'log').mockImplementation()
        jest.spyOn(console, 'error').mockImplementation()
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    describe('signIn', () => {
        const mockCredentials: LoginCredentials = {
            email: 'test@example.com',
            password: 'password123',
        }

        const mockUser = {
            id: 'user-123',
            email: 'test@example.com',
            created_at: '2024-01-01T00:00:00Z',
            app_metadata: {},
            user_metadata: {},
            aud: 'authenticated',
            role: 'authenticated',
        }

        const mockSession = {
            access_token: 'mock-token',
            refresh_token: 'mock-refresh',
            expires_in: 3600,
            expires_at: Date.now() / 1000 + 3600,
            token_type: 'bearer' as const,
            user: mockUser,
        }

        it('should successfully sign in with valid credentials', async () => {
            // Mock successful sign in with session polling
            const mockSignInWithPassword = supabase.auth.signInWithPassword as jest.Mock
            const mockGetSession = supabase.auth.getSession as jest.Mock

            // İlk getSession çağrısı - session yok
            // Sonraki çağrılarda - session var
            let callCount = 0
            mockGetSession.mockImplementation(() => {
                callCount++
                if (callCount === 1) {
                    // İlk kontrol - session yok
                    return Promise.resolve({
                        data: { session: null },
                        error: null,
                    })
                } else {
                    // Sonraki kontroller - session bulundu
                    return Promise.resolve({
                        data: { session: mockSession },
                        error: null,
                    })
                }
            })

            mockSignInWithPassword.mockResolvedValue({
                data: { user: mockUser, session: mockSession },
                error: null,
            })

            const result = await authService.signIn(mockCredentials)

            expect(result.success).toBe(true)
            expect(result.data).toEqual(mockUser)
            expect(mockSignInWithPassword).toHaveBeenCalledWith({
                email: mockCredentials.email,
                password: mockCredentials.password,
            })
        })

        it('should return error with invalid credentials', async () => {
            const mockSignInWithPassword = supabase.auth.signInWithPassword as jest.Mock
            const mockGetSession = supabase.auth.getSession as jest.Mock

            // Session her zaman null
            mockGetSession.mockResolvedValue({
                data: { session: null },
                error: null,
            })

            mockSignInWithPassword.mockResolvedValue({
                data: { user: null, session: null },
                error: {
                    message: 'Invalid login credentials',
                    status: 400,
                    name: 'AuthApiError',
                },
            })

            const result = await authService.signIn(mockCredentials)

            expect(result.success).toBe(false)
            expect(result.message).toBe('Invalid login credentials')
        })

        it('should handle network errors', async () => {
            const mockSignInWithPassword = supabase.auth.signInWithPassword as jest.Mock
            const mockGetSession = supabase.auth.getSession as jest.Mock

            mockGetSession.mockResolvedValue({
                data: { session: null },
                error: null,
            })

            mockSignInWithPassword.mockRejectedValue(new Error('Network error'))

            await expect(authService.signIn(mockCredentials)).rejects.toThrow('Network error')
        })

        it('should handle timeout errors gracefully', async () => {
            const mockSignInWithPassword = supabase.auth.signInWithPassword as jest.Mock
            const mockGetSession = supabase.auth.getSession as jest.Mock

            // Session hiç bulunamıyor
            mockGetSession.mockResolvedValue({
                data: { session: null },
                error: null,
            })

            // signInWithPassword asla tamamlanmıyor (timeout simülasyonu)
            mockSignInWithPassword.mockImplementation(() =>
                new Promise((resolve) => setTimeout(resolve, 10000))
            )

            const result = await authService.signIn(mockCredentials)

            expect(result.success).toBe(false)
            expect(result.message).toContain('Session oluşturulamadı')
        }, 10000) // 10 saniye timeout
    })

    describe('signInWithTcNo', () => {
        const mockTcCredentials: TcLoginCredentials = {
            tcNo: '12345678901',
            password: 'password123',
        }

        it('should successfully sign in with valid TC number', async () => {
            const mockFrom = supabase.from as jest.Mock
            const mockSelect = jest.fn().mockReturnThis()
            const mockEq = jest.fn().mockReturnThis()
            const mockLimit = jest.fn().mockResolvedValue({
                data: [{ email: 'test@example.com', is_active: true }],
                error: null,
            })

            mockFrom.mockReturnValue({
                select: mockSelect,
                eq: mockEq,
                limit: mockLimit,
            })

            // Mock signIn method
            const mockSignIn = jest.spyOn(authService, 'signIn').mockResolvedValue({
                success: true,
                data: { id: 'user-123', email: 'test@example.com' } as any,
            })

            const result = await authService.signInWithTcNo(mockTcCredentials)

            expect(result.success).toBe(true)
            expect(mockFrom).toHaveBeenCalledWith('users')
            expect(mockSelect).toHaveBeenCalledWith('email, is_active')
            expect(mockEq).toHaveBeenCalledWith('tc_no', mockTcCredentials.tcNo)
            expect(mockSignIn).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: mockTcCredentials.password,
            })

            mockSignIn.mockRestore()
        })

        it('should return error when TC number not found', async () => {
            const mockFrom = supabase.from as jest.Mock
            const mockSelect = jest.fn().mockReturnThis()
            const mockEq = jest.fn().mockReturnThis()
            const mockLimit = jest.fn().mockResolvedValue({
                data: [],
                error: null,
            })

            mockFrom.mockReturnValue({
                select: mockSelect,
                eq: mockEq,
                limit: mockLimit,
            })

            const result = await authService.signInWithTcNo(mockTcCredentials)

            expect(result.success).toBe(false)
            expect(result.message).toContain('TC Kimlik Numarası ile eşleşen kullanıcı bulunamadı')
        })

        it('should return error when user is not active', async () => {
            const mockFrom = supabase.from as jest.Mock
            const mockSelect = jest.fn().mockReturnThis()
            const mockEq = jest.fn().mockReturnThis()
            const mockLimit = jest.fn().mockResolvedValue({
                data: [{ email: 'test@example.com', is_active: false }],
                error: null,
            })

            mockFrom.mockReturnValue({
                select: mockSelect,
                eq: mockEq,
                limit: mockLimit,
            })

            const result = await authService.signInWithTcNo(mockTcCredentials)

            expect(result.success).toBe(false)
            expect(result.message).toContain('Hesabınız aktif değil')
        })

        it('should return error when user has no email', async () => {
            const mockFrom = supabase.from as jest.Mock
            const mockSelect = jest.fn().mockReturnThis()
            const mockEq = jest.fn().mockReturnThis()
            const mockLimit = jest.fn().mockResolvedValue({
                data: [{ email: null, is_active: true }],
                error: null,
            })

            mockFrom.mockReturnValue({
                select: mockSelect,
                eq: mockEq,
                limit: mockLimit,
            })

            const result = await authService.signInWithTcNo(mockTcCredentials)

            expect(result.success).toBe(false)
            expect(result.message).toContain('Kullanıcı e-posta adresi bulunamadı')
        })
    })

    describe('signOut', () => {
        it('should successfully sign out', async () => {
            const mockSignOut = supabase.auth.signOut as jest.Mock
            mockSignOut.mockResolvedValue({ error: null })

            const result = await authService.signOut()

            expect(result.success).toBe(true)
            expect(mockSignOut).toHaveBeenCalled()
        })

        it('should return error on sign out failure', async () => {
            const mockSignOut = supabase.auth.signOut as jest.Mock
            mockSignOut.mockResolvedValue({
                error: { message: 'Sign out failed' },
            })

            const result = await authService.signOut()

            expect(result.success).toBe(false)
            expect(result.message).toBe('Sign out failed')
        })
    })

    describe('getSession', () => {
        it('should successfully get session', async () => {
            const mockSession = {
                access_token: 'mock-token',
                user: { id: 'user-123' },
            }

            const mockGetSession = supabase.auth.getSession as jest.Mock
            mockGetSession.mockResolvedValue({
                data: { session: mockSession },
                error: null,
            })

            const result = await authService.getSession()

            expect(result.success).toBe(true)
            expect(result.data).toEqual(mockSession)
        })

        it('should return error when session retrieval fails', async () => {
            const mockGetSession = supabase.auth.getSession as jest.Mock
            mockGetSession.mockResolvedValue({
                data: { session: null },
                error: { message: 'Session not found' },
            })

            const result = await authService.getSession()

            expect(result.success).toBe(false)
            expect(result.message).toBe('Session not found')
        })
    })

    describe('getCurrentUser', () => {
        it('should successfully get current user', async () => {
            const mockUser = { id: 'user-123', email: 'test@example.com' }

            const mockGetUser = supabase.auth.getUser as jest.Mock
            mockGetUser.mockResolvedValue({
                data: { user: mockUser },
                error: null,
            })

            const result = await authService.getCurrentUser()

            expect(result.success).toBe(true)
            expect(result.data).toEqual(mockUser)
        })

        it('should return error when user retrieval fails', async () => {
            const mockGetUser = supabase.auth.getUser as jest.Mock
            mockGetUser.mockResolvedValue({
                data: { user: null },
                error: { message: 'User not found' },
            })

            const result = await authService.getCurrentUser()

            expect(result.success).toBe(false)
            expect(result.message).toBe('User not found')
        })
    })

    describe('resetPassword', () => {
        it('should successfully send password reset email', async () => {
            const mockResetPassword = supabase.auth.resetPasswordForEmail as jest.Mock
            mockResetPassword.mockResolvedValue({ error: null })

            // Mock window.location.origin
            Object.defineProperty(window, 'location', {
                value: { origin: 'http://localhost:3000' },
                writable: true,
            })

            const result = await authService.resetPassword('test@example.com')

            expect(result.success).toBe(true)
            expect(result.message).toBe('Password reset email sent')
            expect(mockResetPassword).toHaveBeenCalledWith('test@example.com', {
                redirectTo: 'http://localhost:3000/sifre-yenileme',
            })
        })

        it('should return error on password reset failure', async () => {
            const mockResetPassword = supabase.auth.resetPasswordForEmail as jest.Mock
            mockResetPassword.mockResolvedValue({
                error: { message: 'Email not found' },
            })

            const result = await authService.resetPassword('test@example.com')

            expect(result.success).toBe(false)
            expect(result.message).toBe('Email not found')
        })
    })

    describe('updatePassword', () => {
        it('should successfully update password', async () => {
            const mockUpdateUser = supabase.auth.updateUser as jest.Mock
            mockUpdateUser.mockResolvedValue({ error: null })

            const result = await authService.updatePassword('newPassword123')

            expect(result.success).toBe(true)
            expect(result.message).toBe('Password updated successfully')
            expect(mockUpdateUser).toHaveBeenCalledWith({
                password: 'newPassword123',
            })
        })

        it('should return error on password update failure', async () => {
            const mockUpdateUser = supabase.auth.updateUser as jest.Mock
            mockUpdateUser.mockResolvedValue({
                error: { message: 'Password update failed' },
            })

            const result = await authService.updatePassword('newPassword123')

            expect(result.success).toBe(false)
            expect(result.message).toBe('Password update failed')
        })
    })
})
