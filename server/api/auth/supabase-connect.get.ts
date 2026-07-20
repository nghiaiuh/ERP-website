import { createSupabaseClientFromEnv, getSupabaseEnv, testSupabaseConnection } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const env = getSupabaseEnv()
  if (!env.url || !env.key) {
    setResponseStatus(event, 503)
    return {
      success: false,
      data: {
        configured: false,
        connected: false,
        message: 'Missing SUPABASE_URL or SUPABASE_KEY',
      },
    }
  }

  const result = await testSupabaseConnection(createSupabaseClientFromEnv())
  setResponseStatus(event, result.connected ? 200 : 503)

  return {
    success: result.connected,
    data: result,
  }
})
