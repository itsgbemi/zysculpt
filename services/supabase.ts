
import { createClient } from '@supabase/supabase-js';

/**
 * Zysculpt Supabase Configuration
 */

// Safely get env from process.env (populated in index.tsx)
const env = (typeof process !== 'undefined' ? process.env : {}) as any;

const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!supabaseUrl && !supabaseUrl.includes('placeholder');

if (!isSupabaseConfigured) {
  console.warn("Zysculpt Warning: Supabase credentials not detected.");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);
