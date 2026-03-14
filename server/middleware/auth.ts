/*
Flow:
        client request
              ↓
        middleware auth
              ↓
        API endpoint
*/

import jwt from 'jsonwebtoken'

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
  
  // Accept token from Authorization header or jwt_token cookie
  const authHeader = getHeader(event, 'authorization')
  let token: string | undefined
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.substring(7)
  } else {
    token = getCookie(event, 'jwt_token')
  }
  
  if(!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  try {
    const config = useRuntimeConfig()
    const jwtSecret = config.jwtSecret || process.env.JWT_SECRET!
    
    const decoded = jwt.verify(token, jwtSecret)
    
    // Add user info to event context
    event.context.user = decoded
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid or expired token' })
  }
})
