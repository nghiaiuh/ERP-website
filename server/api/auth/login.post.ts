import { eq, or } from 'drizzle-orm'
import { useDrizzle, users } from '../../utils/drizzle'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const db = useDrizzle()
  
  try {
    const body = await readBody(event)

    const { identifier, password } = body
    
    if (!identifier || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email/Username and password are required'
      })
    }
    
    console.log('Login attempt:', identifier)
    
    const userResult = await db
      .select()
      .from(users)
      .where(
        or(
          eq(users.email, identifier),
          eq(users.username, identifier)
        )
      )
      .limit(1)
    
    console.log('User found:', userResult.length > 0)
    
    if (userResult.length === 0) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid email/username or password'
      })
    }
    
    const user = userResult[0]!
    
    const isPasswordValid = await bcrypt.compare(password, user.password)
    
    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid email/username or password'
      })
    }
    
    const config = useRuntimeConfig()
    const jwtSecret = config.jwtSecret || process.env.JWT_SECRET!
    
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email
      },
      jwtSecret,
      {algorithm: 'HS256', expiresIn: '7d' }
    )
    
    return {
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt
      }
    }
    
  } catch (error: any) {
    console.error('Login error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error during login'
    })
  }
})
