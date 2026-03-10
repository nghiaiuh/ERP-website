import { eq } from 'drizzle-orm'
import { useDrizzle, users } from '../../utils/drizzle'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const db = useDrizzle()
  
  try {
    const body = await readBody(event)
    const { email, password, name } = body
    
    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email and password are required'
      })
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email format'
      })
    }
  
    if (password.length < 6) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Password must be at least 6 characters long'
      })
    }
    
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
    
    if (existingUser.length > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: 'User with this email already exists'
      })
    }
    
    // Hash password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    
    const newUser = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        username: name || null
      })
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        createdAt: users.createdAt
      })
    
    return {
      success: true,
      message: 'User registered successfully',
      user: newUser[0]
    }
    
  } catch (error: any) {
    console.error('Registration error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error during registration'
    })
  }
})
