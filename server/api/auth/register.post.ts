import { createSupabaseAuthClientFromEnv } from '../../utils/supabase'

/* Legacy local-password registration, retained only in source history.
export default defineEventHandler(async (event) => {
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
    
    // Hash password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const config = useRuntimeConfig()
    const dbProvider = String(config.dbProvider || 'drizzle').toLowerCase()
    let newUser: Array<{ id: number; email: string; username: string | null; createdAt: string | null }>

    if (dbProvider === 'supabase') {
      const supabase = createSupabaseAdminClientFromEnv()
      const { data: existingUser, error: lookupError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .limit(1)
        .maybeSingle()

      if (lookupError) {
        throw createError({
          statusCode: 503,
          statusMessage: `Database unavailable: ${lookupError.message}`
        })
      }

      if (existingUser) {
        throw createError({
          statusCode: 409,
          statusMessage: 'User with this email already exists'
        })
      }

      const { data, error: insertError } = await supabase
        .from('users')
        .insert({
          email,
          password: hashedPassword,
          username: name || null
        })
        .select('id, email, username, created_at')

      if (insertError) {
        throw createError({
          statusCode: 503,
          statusMessage: `Database unavailable: ${insertError.message}`
        })
      }

      newUser = (data ?? []).map((user) => ({
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.created_at
      }))
    } else {
      const db = useDrizzle()

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

      newUser = await db
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
    }
    
    return {
      success: true,
      message: 'User registered successfully',
      user: newUser[0]
    }
    
  } catch (error: any) {
    if (error.statusCode) {
      if (error.statusCode >= 500) {
        console.error('Registration error:', error)
      }
      throw error
    }
    
    console.error('Registration error:', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error during registration'
    })
  }
})
*/

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string; password?: string; name?: string }>(event)
  const email = body.email?.trim().toLowerCase()
  const password = body.password
  const username = body.name?.trim()

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password are required' })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid email format' })
  }

  if (password.length < 8) {
    throw createError({ statusCode: 400, statusMessage: 'Password must be at least 8 characters long' })
  }

  const supabase = createSupabaseAuthClientFromEnv()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username, display_name: username } },
  })

  if (error || !data.user) {
    throw createError({ statusCode: 400, statusMessage: error?.message || 'Unable to register user' })
  }

  return {
    success: true,
    message: data.session ? 'User registered successfully' : 'Check your email to confirm the account',
    user: {
      id: data.user.id,
      email: data.user.email,
      username: username || null,
      createdAt: data.user.created_at,
    },
  }
})
