
import { createClient } from '@supabase/supabase-js';

// Fallback to placeholder strings to prevent "supabaseUrl is required" crash
// if environment variables are not set in the current execution context.
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
