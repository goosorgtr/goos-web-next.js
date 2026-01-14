import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

// Create typed Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Export types for convenience
export type { Database } from './types';
export type { Tables, TablesInsert, TablesUpdate } from './types';
