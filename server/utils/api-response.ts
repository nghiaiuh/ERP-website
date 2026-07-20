import type { H3Event } from 'h3'
import { createError, getHeader, setHeader, setResponseStatus } from 'h3'

export type ApiErrorCode =
  | 'BAD_REQUEST'
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'DATABASE_UNAVAILABLE'
  | 'INTERNAL_ERROR'

export interface ApiErrorPayload {
  code: ApiErrorCode
  message: string
  details?: unknown
  requestId?: string
}

export function ensureRequestId(event: H3Event): string {
  const existingRequestId = event.context.requestId
  if (typeof existingRequestId === 'string' && existingRequestId.length > 0) {
    return existingRequestId
  }

  const incomingRequestId = getHeader(event, 'x-request-id')
  const requestId = incomingRequestId && incomingRequestId.length <= 128
    ? incomingRequestId
    : crypto.randomUUID()

  event.context.requestId = requestId
  setHeader(event, 'x-request-id', requestId)
  return requestId
}

export function apiSuccess<T>(event: H3Event, data: T, message?: string) {
  return {
    success: true,
    requestId: ensureRequestId(event),
    message,
    data,
  }
}

export function throwValidationError(message: string, details: unknown): never {
  throw createError({
    statusCode: 400,
    statusMessage: message,
    data: {
      code: 'VALIDATION_ERROR',
      details,
    },
  })
}

export function toErrorResponse(event: H3Event, error: unknown, fallbackMessage: string) {
  const requestId = ensureRequestId(event)
  const normalized = error as {
    statusCode?: number
    statusMessage?: string
    message?: string
    data?: Partial<ApiErrorPayload>
  }

  const statusCode = normalized.statusCode && normalized.statusCode >= 400
    ? normalized.statusCode
    : 500

  setResponseStatus(event, statusCode)

  const code = normalized.data?.code || statusToCode(statusCode)
  const message = normalized.statusMessage || normalized.message || fallbackMessage

  return {
    success: false,
    requestId,
    error: {
      code,
      message,
      details: normalized.data?.details ?? normalized.data,
    },
    message,
  }
}

function statusToCode(statusCode: number): ApiErrorCode {
  if (statusCode === 400) return 'BAD_REQUEST'
  if (statusCode === 401) return 'UNAUTHORIZED'
  if (statusCode === 403) return 'FORBIDDEN'
  if (statusCode === 404) return 'NOT_FOUND'
  if (statusCode === 409) return 'CONFLICT'
  if (statusCode === 503) return 'DATABASE_UNAVAILABLE'
  return 'INTERNAL_ERROR'
}
