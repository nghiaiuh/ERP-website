import { ensureRequestId } from '../utils/api-response'

export default defineEventHandler((event) => {
  ensureRequestId(event)
})
