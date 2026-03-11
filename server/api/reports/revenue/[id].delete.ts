import { db } from '../../../utils/drizzle'
import { soDoanhThu, donDoanhThu } from '../../../db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const id = Number(event.context.params?.id)

    if (!id || isNaN(id)) {
      setResponseStatus(event, 400)
      return {
        success: false,
        message: 'Invalid revenue report ID'
      }
    }

    // Check if revenue report exists
    const existingReport = await db
      .select({ id: soDoanhThu.id })
      .from(soDoanhThu)
      .where(eq(soDoanhThu.id, id))
      .limit(1)

    if (existingReport.length === 0) {
      setResponseStatus(event, 404)
      return {
        success: false,
        message: 'Revenue report not found'
      }
    }

    // Delete revenue entries first (should cascade automatically but doing it explicitly)
    await db.delete(donDoanhThu).where(eq(donDoanhThu.revenueBookId, id))

    // Delete revenue report
    await db.delete(soDoanhThu).where(eq(soDoanhThu.id, id))

    return {
      success: true,
      message: 'Revenue report deleted successfully'
    }
  } catch (error) {
    console.error('Error deleting revenue report:', error)
    setResponseStatus(event, 500)
    return {
      success: false,
      message: 'Failed to delete revenue report'
    }
  }
})
