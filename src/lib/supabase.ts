import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fkbsvefhnzaoodlvlyap.supabase.co'
const supabaseAnonKey = 'sb_publishable_f9V7L21-GNrH5YtxfiDhtw__CHNBkk9'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
