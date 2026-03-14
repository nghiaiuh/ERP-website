import { eq, or } from 'drizzle-orm'
import { useDrizzle, users } from '../../utils/drizzle'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { supabase } from '../supabase-client'

type AuthUser = {
  id: number
  email: string
  username: string | null
  password: string
  createdAt: string | null
}

export default defineEventHandler(async (event) => {
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

    const config = useRuntimeConfig()
    const dbProvider = String(config.dbProvider || 'drizzle').toLowerCase()
    let user: AuthUser | null = null

    if (dbProvider === 'supabase') {
      const { data, error: supabaseError } = await supabase
        .from('users')
        .select('id, email, username, password, created_at')
        .or(`email.eq.${identifier},username.eq.${identifier}`)
        .limit(1)
        .maybeSingle()

      if (supabaseError) {
        throw createError({
          statusCode: 503,
          statusMessage: `Database unavailable: ${supabaseError.message}`
        })
      }

      if (data) {
        user = {
          id: data.id,
          email: data.email,
          username: data.username,
          password: data.password,
          createdAt: data.created_at
        }
      }
    } else {
      const db = useDrizzle()
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

      if (userResult.length > 0) {
        user = {
          id: userResult[0]!.id,
          email: userResult[0]!.email,
          username: userResult[0]!.username,
          password: userResult[0]!.password,
          createdAt: userResult[0]!.createdAt
        }
      }
    }

    console.log('User found:', !!user)

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid email/username or password'
      })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    
    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid email/username or password'
      })
    }
    
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
