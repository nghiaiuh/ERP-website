import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  // Skip auth for auth endpoints
  const url = getRequestURL(event)
  if (url.pathname.startsWith('/api/auth/')) {
    return
  }
  
  // Get token from Authorization header
  const authHeader = getHeader(event, 'authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return // Allow requests without auth for now
  }
  
  const token = authHeader.substring(7)
  
  try {
    const config = useRuntimeConfig()
    const jwtSecret = config.jwtSecret || process.env.JWT_SECRET!
    
    const decoded = jwt.verify(token, jwtSecret)
    
    // Add user info to event context
    event.context.user = decoded
  } catch (error) {
    console.error('Token verification failed:', error)
  }
})
