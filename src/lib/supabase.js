import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if credentials are placeholder values or missing
const hasValidCredentials =
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'your_supabase_url' &&
    supabaseAnonKey !== 'your_supabase_anon_key'

if (!hasValidCredentials) {
    console.warn('⚠️ Supabase credentials not configured. Using dummy client.')
    console.warn('📝 Update your .env file with real Supabase credentials to enable full functionality.')
}

// Use dummy values if credentials are missing to prevent app crash
export const supabase = createClient(
    hasValidCredentials ? supabaseUrl : 'https://placeholder.supabase.co',
    hasValidCredentials ? supabaseAnonKey : 'placeholder-key'
)
