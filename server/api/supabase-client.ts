import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.Project_URL as string,
  process.env.API_Key_anon_public as string
)