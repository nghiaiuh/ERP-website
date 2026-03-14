import jwt from 'jsonwebtoken'
import { eq } from 'drizzle-orm'
import { useDrizzle, users } from '~~/server/utils/drizzle'
import { supabase } from '../supabase-client'

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
            const { data, error: supabaseError } = await supabase
                .from('users')
                .select('id, email, username, created_at')
                .eq('id', decoded.userId)
                .maybeSingle()

            if (supabaseError) {
                throw createError({ statusCode: 503, message: `Database unavailable: ${supabaseError.message}` })
            }

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
        console.error('Token verification error:', err)

        // Keep token errors as 401, but surface DB connectivity issues correctly.
        if (err?.code === 'ETIMEDOUT' || err?.cause?.code === 'ETIMEDOUT') {
            throw createError({ statusCode: 503, message: 'Database unavailable' })
        }

        if (err?.name === 'JsonWebTokenError' || err?.name === 'TokenExpiredError') {
            throw createError({ statusCode: 401, message: 'Invalid token' })
        }

        throw createError({ statusCode: 500, message: 'Token verification failed' })
    }
})