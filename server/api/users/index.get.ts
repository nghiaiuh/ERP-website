import { desc } from 'drizzle-orm'
import { users } from '../../db/schema'

export default defineEventHandler(async (event) => {
  try {
    const db = useDrizzle()
    const query = getQuery(event)
    
    const {
      limit = 100,
      offset = 0
    } = query

    // Fetch all users (excluding password for security)
    const allUsers = await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(Number(limit))
      .offset(Number(offset))

    return {
      success: true,
      data: allUsers,
      count: allUsers.length
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch users: ' + error.message
    })
  }
})
