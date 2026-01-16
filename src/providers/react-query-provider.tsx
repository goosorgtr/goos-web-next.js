'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 5 * 60 * 1000, // 5 dakika (daha uzun cache)
                        gcTime: 10 * 60 * 1000, // 10 dakika sonra cache temizle (eski cacheTime)
                        refetchOnWindowFocus: false,
                        refetchOnMount: true, // Her mount'ta fresh data
                        refetchOnReconnect: true,
                        retry: (failureCount, error: any) => {
                            // Auth hatalarında (401/403) retry yapma
                            if (error?.code === 'PGRST301' || error?.code === 'PGRST116' || 
                                error?.message?.includes('JWT') || error?.message?.includes('401') || 
                                error?.message?.includes('403')) {
                                return false
                            }
                            return failureCount < 2
                        },
                        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
                        onError: (error: any) => {
                            // Auth hatalarında cache'i temizle
                            if (error?.code === 'PGRST301' || error?.code === 'PGRST116' || 
                                error?.message?.includes('JWT') || error?.message?.includes('401') || 
                                error?.message?.includes('403')) {
                                console.warn('🔴 [REACT QUERY] Auth hatası tespit edildi, cache temizleniyor')
                                queryClient.clear()
                            }
                        },
                    },
                    mutations: {
                        retry: 1,
                        onError: (error: any) => {
                            // Auth hatalarında cache'i temizle
                            if (error?.code === 'PGRST301' || error?.code === 'PGRST116' || 
                                error?.message?.includes('JWT') || error?.message?.includes('401') || 
                                error?.message?.includes('403')) {
                                console.warn('🔴 [REACT QUERY] Auth hatası tespit edildi, cache temizleniyor')
                                queryClient.clear()
                            }
                        },
                    },
                },
            })
    )

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
