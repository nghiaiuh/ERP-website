import jwt from 'jsonwebtoken'
import { eq } from 'drizzle-orm'
import { useDrizzle, users } from '~~/server/utils/drizzle'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const { token } = body

    if(!token) {
        throw createError({statusCode: 400, message: 'No token was passed'})
    }

    try {
        const config = useRuntimeConfig()
        const jwtSecret = config.jwtSecret || process.env.JWT_SECRET!
        
        const decoded = jwt.verify(token, jwtSecret) as { userId: number, email: string }
        
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
        
        if (userResult.length === 0) {
            throw createError({statusCode: 401, message: 'User not found'})
        }
        
        return {
            success: true,
            user: userResult[0]
        }
    } catch (err) {
        console.error('Token verification error:', err)
        throw createError({statusCode: 401, message: 'Invalid token'})
    }
})