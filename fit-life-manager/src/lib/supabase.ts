import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_DEFAULT_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_API_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
