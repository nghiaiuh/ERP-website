import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export interface SupabaseConnectionResult {
  configured: boolean
  connected: boolean
  message: string
}

export function getSupabaseEnv() {
  return {
    url: sanitizeEnv(process.env.SUPABASE_URL),
    key: sanitizeEnv(process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    serviceRoleKey: sanitizeEnv(process.env.SUPABASE_SERVICE_ROLE_KEY),
  }
}

export function createSupabaseClientFromEnv(): SupabaseClient {
  const { url, key } = getSupabaseEnv()

  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL and SUPABASE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY in environment variables')
  }

  return createClient(url, key)
}

export function createSupabaseAuthClientFromEnv(): SupabaseClient {
  const { url, key } = getSupabaseEnv()

  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL and SUPABASE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY in environment variables')
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  })
}

export function createSupabaseAdminClientFromEnv(): SupabaseClient {
  const { url, serviceRoleKey } = getSupabaseEnv()

  if (!url || !serviceRoleKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables')
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export async function testSupabaseConnection(
  client: Pick<SupabaseClient, 'from'> = createSupabaseClientFromEnv(),
): Promise<SupabaseConnectionResult> {
  const { error } = await client
    .from('users')
    .select('id', { count: 'exact', head: true })

  if (error) {
    return {
      configured: true,
      connected: false,
      message: error.message,
    }
  }

  return {
    configured: true,
    connected: true,
    message: 'Supabase connection succeeded',
  }
}

function sanitizeEnv(value: string | undefined): string {
  return (value ?? '').trim().replace(/^['"]|['"]$/g, '')
}
