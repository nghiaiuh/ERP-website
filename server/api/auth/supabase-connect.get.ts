import { createSupabaseAdminClientFromEnv, getSupabaseEnv, testSupabaseConnection } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const env = getSupabaseEnv()
  if (!env.url || !env.serviceRoleKey) {
    setResponseStatus(event, 503)
    return {
      success: false,
      data: {
        configured: false,
        connected: false,
        message: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY',
      },
    }
  }

  // The profile table is RLS protected; the server-only health check uses admin access.
  const result = await testSupabaseConnection(createSupabaseAdminClientFromEnv())
  setResponseStatus(event, result.connected ? 200 : 503)

  return {
    success: result.connected,
    data: result,
  }
})
