/**
 * Integration Tests - Auth Service
 * 
 * Bu testler GERÇEK Supabase ile çalışır
 * Test kullanıcıları Supabase'de olmalı
 */

import { authService } from '../auth.service'
import type { LoginCredentials, TcLoginCredentials } from '@/modules/auth/types'

// NOT: Bu testler gerçek Supabase'e bağlanır
// Mock kullanmıyoruz!

describe('Auth Service - Integration Tests', () => {
    // Test kullanıcı bilgileri - .env.test'den gelecek
    const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'test@example.com'
    const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'test123456'
    const TEST_TC_NO = process.env.TEST_USER_TC_NO || '12345678901'

    describe('signIn - Real Supabase', () => {
        it('should sign in with real test user credentials', async () => {
            const credentials: LoginCredentials = {
                email: TEST_EMAIL,
                password: TEST_PASSWORD,
            }

            const result = await authService.signIn(credentials)

            // Gerçek giriş yapılmalı
            expect(result.success).toBe(true)
            expect(result.data).toBeDefined()
            expect(result.data?.email).toBe(TEST_EMAIL)
        }, 15000) // 15 saniye timeout - gerçek API çağrısı

        it('should fail with invalid credentials', async () => {
            const credentials: LoginCredentials = {
                email: TEST_EMAIL,
                password: 'wrong-password',
            }

            const result = await authService.signIn(credentials)

            expect(result.success).toBe(false)
            expect(result.message).toBeDefined()
        }, 15000)
    })

    describe('signInWithTcNo - Real Supabase', () => {
        it('should sign in with TC number', async () => {
            const credentials: TcLoginCredentials = {
                tcNo: TEST_TC_NO,
                password: TEST_PASSWORD,
            }

            const result = await authService.signInWithTcNo(credentials)

            expect(result.success).toBe(true)
            expect(result.data).toBeDefined()
        }, 15000)

        it('should fail with invalid TC number', async () => {
            const credentials: TcLoginCredentials = {
                tcNo: '99999999999',
                password: TEST_PASSWORD,
            }

            const result = await authService.signInWithTcNo(credentials)

            expect(result.success).toBe(false)
        }, 15000)
    })

    describe('Session Management', () => {
        beforeAll(async () => {
            // Test başlamadan önce giriş yap
            await authService.signIn({
                email: TEST_EMAIL,
                password: TEST_PASSWORD,
            })
        }, 15000)

        afterAll(async () => {
            // Test bittikten sonra çıkış yap
            await authService.signOut()
        })

        it('should get current session', async () => {
            const result = await authService.getSession()

            expect(result.success).toBe(true)
            expect(result.data).toBeDefined()
            expect(result.data?.user).toBeDefined()
        })

        it('should get current user', async () => {
            const result = await authService.getCurrentUser()

            expect(result.success).toBe(true)
            expect(result.data).toBeDefined()
            expect(result.data?.email).toBe(TEST_EMAIL)
        })
    })

    describe('Sign Out', () => {
        beforeEach(async () => {
            // Her test öncesi giriş yap
            await authService.signIn({
                email: TEST_EMAIL,
                password: TEST_PASSWORD,
            })
        }, 15000)

        it('should sign out successfully', async () => {
            const result = await authService.signOut()

            expect(result.success).toBe(true)

            // Çıkış yaptıktan sonra session olmamalı
            const sessionResult = await authService.getSession()
            expect(sessionResult.data?.session).toBeNull()
        })
    })
})
