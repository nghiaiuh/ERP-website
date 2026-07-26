export default defineEventHandler(() => {
  // This endpoint intentionally never returns account records or credentials.
  return { message: 'ERP API is running' }
})
