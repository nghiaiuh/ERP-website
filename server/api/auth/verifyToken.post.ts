import { createSupabaseAdminClientFromEnv, createSupabaseAuthClientFromEnv } from '../../utils/supabase'

/* Legacy custom-JWT verification, retained only in source history.
export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const { token } = body

    if(!token) {
        throw createError({statusCode: 400, message: 'No token was passed'})
    }

    try {
        const config = useRuntimeConfig()
        const jwtSecret = config.jwtSecret || process.env.JWT_SECRET!
        const dbProvider = String(config.dbProvider || 'drizzle').toLowerCase()
        
        const decoded = jwt.verify(token, jwtSecret) as { userId: number, email: string }

        let user: { id: number; email: string; username: string | null; createdAt: string | null } | null = null

        if (dbProvider === 'supabase') {
            const supabase = createSupabaseAdminClientFromEnv()
            //Truy vẫn dữ liệu từ db
            const { data, error: supabaseError } = await supabase
                .from('users')
                .select('id, email, username, created_at')
                .eq('id', decoded.userId)
                .maybeSingle()
            //Lỗi
            if (supabaseError) {
                throw createError({ statusCode: 503, message: `Database unavailable: ${supabaseError.message}` })
            }
            //Thành công
            if (data) {
                user = {
                    id: data.id,
                    email: data.email,
                    username: data.username,
                    createdAt: data.created_at
                }
            }
        } else {
            const db = useDrizzle()
            const userResult = await db
                .select({
                    id: users.id,
                    email: users.email,
                    username: users.username,
                    createdAt: users.createdAt
                })
                .from(users)
                .where(eq(users.id, decoded.userId))
                .limit(1)

            if (userResult.length > 0) {
                user = userResult[0]!
            }
        }

        if (!user) {
            throw createError({statusCode: 401, message: 'User not found'})
        }
        
        return {
            success: true,
            user
        }
    } catch (err: any) {
        // Keep token errors as 401, but surface DB connectivity issues correctly.
        if (err?.code === 'ETIMEDOUT' || err?.cause?.code === 'ETIMEDOUT') {
            console.error('Token verification error:', err)
            throw createError({ statusCode: 503, message: 'Database unavailable' })
        }

        if (err?.statusCode) {
            if (err.statusCode >= 500) {
                console.error('Token verification error:', err)
            }
            throw err
        }

        if (err?.name === 'JsonWebTokenError' || err?.name === 'TokenExpiredError') {
            throw createError({ statusCode: 401, message: 'Invalid token' })
        }

        console.error('Token verification error:', err)

        throw createError({ statusCode: 500, message: 'Token verification failed' })
    }
})
*/

export default defineEventHandler(async (event) => {
  const { token } = await readBody<{ token?: string }>(event)

  if (!token) {
    throw createError({ statusCode: 400, statusMessage: 'No token was passed' })
  }

  const authClient = createSupabaseAuthClientFromEnv()
  const { data: authData, error: authError } = await authClient.auth.getUser(token)

  if (authError || !authData.user) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid or expired token' })
  }

  const adminClient = createSupabaseAdminClientFromEnv()
  const { data: profile, error: profileError } = await adminClient
    .from('users')
    .select('id, username, display_name, created_at')
    .eq('id', authData.user.id)
    .maybeSingle()

  if (profileError) {
    throw createError({ statusCode: 503, statusMessage: 'Database unavailable' })
  }

  return {
    success: true,
    user: {
      id: authData.user.id,
      email: authData.user.email,
      username: profile?.username ?? authData.user.user_metadata.username ?? null,
      displayName: profile?.display_name ?? null,
      createdAt: profile?.created_at ?? authData.user.created_at,
    },
  }
})
