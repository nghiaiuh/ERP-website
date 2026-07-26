/*
Flow:
        client request
              ↓
        middleware auth
              ↓
        API endpoint
*/

import { createSupabaseAuthClientFromEnv } from '../utils/supabase'

export default defineEventHandler(async (event) => {
  // Only guard API routes. Do not block page/html/static requests.
  const url = getRequestURL(event)
  if (!url.pathname.startsWith('/api/')) {
    return
  }

  // Skip auth for auth endpoints
  if (url.pathname.startsWith('/api/auth/')) {
    return
  }
  
  // The browser token is HttpOnly; API clients may use Authorization instead.
  const authHeader = getHeader(event, 'authorization')
  let token: string | undefined
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.substring(7)
  } else {
    token = getCookie(event, 'sb_access_token')
  }
  
  if(!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  try {
    const supabase = createSupabaseAuthClientFromEnv()
    const { data, error } = await supabase.auth.getUser(token)

    if (error || !data.user) {
      throw new Error('Invalid Supabase access token')
    }

    // The access token identifies the user; tenant authorization stays in RLS/use cases.
    event.context.user = { userId: data.user.id, email: data.user.email }
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid or expired token' })
  }
})
