import { createSupabaseAuthClientFromEnv } from '../../utils/supabase'
import { setCookie } from 'h3'

/* Legacy local-password authentication, retained only in source history.
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
    
    const config = useRuntimeConfig()
    const dbProvider = String(config.dbProvider || 'drizzle').toLowerCase()
    let user: AuthUser | null = null

    //Kết nối tới supabase
    if (dbProvider === 'supabase') {
      const supabase = createSupabaseAdminClientFromEnv()
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
    } 
    //Kết nối tới db nội bộ (drizzle(connection pool (cải tiến bằng redis)) -> schema)
    else {
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
    if (error.statusCode) {
      if (error.statusCode >= 500) {
        console.error('Login error:', error)
      }
      throw error
    }
    
    console.error('Login error:', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error during login'
    })
  }
})
*/

export default defineEventHandler(async (event) => {
  const body = await readBody<{ identifier?: string; password?: string }>(event)
  const email = body.identifier?.trim().toLowerCase()
  const password = body.password

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password are required' })
  }

  if (!email.includes('@')) {
    throw createError({ statusCode: 400, statusMessage: 'Sign in with the email registered in Supabase Auth' })
  }

  const supabase = createSupabaseAuthClientFromEnv()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !data.session || !data.user) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' })
  }

  setCookie(event, 'sb_access_token', data.session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: data.session.expires_in,
  })

  return {
    success: true,
    message: 'Login successful',
    user: {
      id: data.user.id,
      email: data.user.email,
      username: data.user.user_metadata.username ?? null,
      createdAt: data.user.created_at,
    },
  }
})
