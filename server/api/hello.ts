import { teams, users } from "../db/schema";
import { useDrizzle } from "../utils/drizzle";

export default defineEventHandler(async (event) => {
    try {
        const db = useDrizzle()
        
        // Get all teams
        const allTeams = await db.select().from(teams)
        
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
            users: allUsers, 
            teams: allTeams
        }
    } catch (err) {
        // Let Nuxt handle the error response; include message for debugging
        throw createError({ statusCode: 500, statusMessage: String(err) })
    }
})