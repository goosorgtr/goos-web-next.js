import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

// Create typed Supabase client with Next.js optimized settings
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: typeof window !== 'undefined', // Sadece browser'da persist et
    autoRefreshToken: true,
    detectSessionInUrl: false, // Next.js'te genelde false olmalı
    flowType: 'implicit', // PKCE yerine implicit flow (Next.js için daha uyumlu)
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
  global: {
    headers: {
      'x-client-info': 'goos-web-nextjs',
    },
  },
});

// Export types for convenience
export type { Database } from './types';
export type { Tables, TablesInsert, TablesUpdate } from './types';
