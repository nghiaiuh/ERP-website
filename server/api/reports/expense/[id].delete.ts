import { db } from '../../../utils/drizzle'
import { soChiPhi, donChiPhi } from '../../../db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const id = Number(event.context.params?.id)

    if (!id || isNaN(id)) {
      setResponseStatus(event, 400)
      return {
        success: false,
        message: 'Invalid expense report ID'
      }
    }

    // Check if expense report exists
    const existingReport = await db
      .select({ id: soChiPhi.id })
      .from(soChiPhi)
      .where(eq(soChiPhi.id, id))
      .limit(1)

    if (existingReport.length === 0) {
      setResponseStatus(event, 404)
      return {
        success: false,
        message: 'Expense report not found'
      }
    }

    // Delete expense entries first (should cascade automatically but doing it explicitly)
    await db.delete(donChiPhi).where(eq(donChiPhi.expenseBookId, id))

    // Delete expense report
    await db.delete(soChiPhi).where(eq(soChiPhi.id, id))

    return {
      success: true,
      message: 'Expense report deleted successfully'
    }
  } catch (error) {
    console.error('Error deleting expense report:', error)
    setResponseStatus(event, 500)
    return {
      success: false,
      message: 'Failed to delete expense report'
    }
  }
})
