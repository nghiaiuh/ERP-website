// Temporary stub endpoint - Returns empty data structure
// TODO: Implement with new Vietnamese database schema
export default defineEventHandler(async (event) => {
  return {
    success: true,
    data: [],
    count: 0,
    message: 'This endpoint is temporarily disabled. Database schema has been migrated to Vietnamese tables.'
  }
})
