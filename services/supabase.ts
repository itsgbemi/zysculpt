
import { createClient } from '@supabase/supabase-js';

// Accessing environment variables
const supabaseUrl = typeof process !== 'undefined' && process.env ? process.env.SUPABASE_URL : '';
const supabaseAnonKey = typeof process !== 'undefined' && process.env ? process.env.SUPABASE_ANON_KEY : '';

// Validation
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Zysculpt Error: SUPABASE_URL or SUPABASE_ANON_KEY is missing. Database features will fail.");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-project.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);

export const isSupabaseConfigured = !!supabaseUrl && !supabaseUrl.includes('placeholder');
