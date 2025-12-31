
import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string) => {
  try {
    return typeof process !== 'undefined' && process.env ? process.env[key] : null;
  } catch {
    return null;
  }
};

const supabaseUrl = getEnv('SUPABASE_URL') || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY') || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
