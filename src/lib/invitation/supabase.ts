import { createClient } from '@supabase/supabase-js'

// Using the same credentials as the main project for now
// In a real scenario, you might want separate schemas or projects
const supabaseUrl = 'https://fkbsvefhnzaoodlvlyap.supabase.co'
const supabaseAnonKey = 'sb_publishable_f9V7L21-GNrH5YtxfiDhtw__CHNBkk9'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
