'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { supabaseApi } from '@/lib/supabase/api'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function TestSupabasePage() {
    const [connectionStatus, setConnectionStatus] = useState<'testing' | 'success' | 'error'>('testing')
    const [roles, setRoles] = useState<any[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        testConnection()
    }, [])

    const testConnection = async () => {
        try {
            // Test 1: Basic connection
            const { data, error: connError } = await supabase
                .from('roles')
                .select('*')
                .limit(5)

            if (connError) {
                setConnectionStatus('error')
                setError(connError.message)
                return
            }

            // Test 2: Using API wrapper
            const response = await supabaseApi.getAll('roles', { limit: 5 })

            if (response.success) {
                setRoles(response.data)
                setConnectionStatus('success')
            } else {
                setConnectionStatus('error')
                setError(response.message)
            }
        } catch (err) {
            setConnectionStatus('error')
            setError(err instanceof Error ? err.message : 'Unknown error')
        }
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold">Supabase Connection Test</h1>

            {/* Connection Status */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
                <div className="flex items-center gap-3">
                    {connectionStatus === 'testing' && (
                        <>
                            <div className="h-3 w-3 rounded-full bg-yellow-500 animate-pulse" />
                            <span>Testing connection...</span>
                        </>
                    )}
                    {connectionStatus === 'success' && (
                        <>
                            <div className="h-3 w-3 rounded-full bg-green-500" />
                            <span className="text-green-600 font-semibold">✅ Connected successfully!</span>
                        </>
                    )}
                    {connectionStatus === 'error' && (
                        <>
                            <div className="h-3 w-3 rounded-full bg-red-500" />
                            <span className="text-red-600 font-semibold">❌ Connection failed</span>
                        </>
                    )}
                </div>
                {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}
            </Card>

            {/* Environment Variables */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">NEXT_PUBLIC_SUPABASE_URL:</span>
                        <span className={process.env.NEXT_PUBLIC_SUPABASE_URL ? 'text-green-600' : 'text-red-600'}>
                            {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
                        <span className={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'text-green-600' : 'text-red-600'}>
                            {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}
                        </span>
                    </div>
                </div>
            </Card>

            {/* Roles Data */}
            {roles.length > 0 && (
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Sample Data (Roles)</h2>
                    <div className="space-y-2">
                        {roles.map((role, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-md">
                                <pre className="text-sm">{JSON.stringify(role, null, 2)}</pre>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Test Actions */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
                <div className="flex gap-3">
                    <Button onClick={testConnection}>
                        Retry Connection
                    </Button>
                    <Button variant="outline" onClick={() => window.location.reload()}>
                        Reload Page
                    </Button>
                </div>
            </Card>

            {/* Integration Info */}
            <Card className="p-6 bg-blue-50 border-blue-200">
                <h2 className="text-xl font-semibold mb-4">✅ Supabase Integration Complete</h2>
                <div className="space-y-2 text-sm">
                    <p>✅ <code className="bg-white px-2 py-1 rounded">src/lib/supabase/client.ts</code> - Typed Supabase client</p>
                    <p>✅ <code className="bg-white px-2 py-1 rounded">src/lib/supabase/types.ts</code> - 40+ database tables with TypeScript types</p>
                    <p>✅ <code className="bg-white px-2 py-1 rounded">src/lib/supabase/helpers.ts</code> - Case conversion utilities</p>
                    <p>✅ <code className="bg-white px-2 py-1 rounded">src/lib/supabase/api.ts</code> - CRUD wrapper with auto case conversion</p>
                </div>
            </Card>
        </div>
    )
}
