import { users } from "../db/schema";
import { useDrizzle } from "../utils/drizzle";

export default defineEventHandler(async (event) => {
    try {
        const db = useDrizzle()
        
        // Get all users
        const allUsers = await db
            .select({
                id: users.id,
                email: users.email,
                username: users.username,
                password: users.password,
                createdAt: users.createdAt
            })
            .from(users)
            .orderBy(users.createdAt)
        
        
        return { 
            message: 'ERP Database connected successfully',
            users: allUsers
        }
    } catch (err) {
        // Let Nuxt handle the error response; include message for debugging
        throw createError({ statusCode: 500, statusMessage: String(err) })
    }
})