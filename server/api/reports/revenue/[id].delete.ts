import { eq } from 'drizzle-orm'
import { donDoanhThu, soDoanhThu } from '../../../db/schema'
import { db } from '../../../utils/drizzle'
import { toErrorResponse, throwValidationError } from '../../../utils/api-response'
import { validatePositiveIntegerParam } from '../../../utils/validation'

export default defineEventHandler(async (event) => {
  try {
    const validationErrors = validatePositiveIntegerParam(event.context.params?.id, 'id')
    if (validationErrors.length > 0) {
      throwValidationError('Invalid revenue report id', validationErrors)
    }
    const id = Number(event.context.params?.id)

    const existingReport = await db
      .select({ id: soDoanhThu.id })
      .from(soDoanhThu)
      .where(eq(soDoanhThu.id, id))
      .limit(1)

    if (existingReport.length === 0) {
      setResponseStatus(event, 404)
      return {
        success: false,
        message: 'Revenue report not found',
      }
    }

    await db.delete(donDoanhThu).where(eq(donDoanhThu.revenueBookId, id))
    await db.delete(soDoanhThu).where(eq(soDoanhThu.id, id))

    return {
      success: true,
      message: 'Revenue report deleted successfully',
    }
  } catch (error) {
    console.error('Error deleting revenue report:', error)
    return toErrorResponse(event, error, 'Failed to delete revenue report')
  }
})
