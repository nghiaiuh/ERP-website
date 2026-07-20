import { beforeEach, describe, expect, it, vi } from 'vitest'

function createEvent() {
  return {
    context: {},
    node: {
      req: {
        headers: {
          'x-request-id': 'test-request-id',
        },
      },
      res: {
        statusCode: 200,
        setHeader: vi.fn(),
      },
    },
  }
}

describe('revenue report API contract', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('returns a 400 validation contract instead of masking validation as 500', async () => {
    vi.stubGlobal('readBody', vi.fn(async () => ({
      periodStart: '2026-01-31',
      periodEnd: '2026-01-01',
      totalRevenue: -1,
    })))

    const handler = (await import('../../server/api/reports/revenue/index.post')).default
    const event = createEvent()
    const response = await handler(event as any)

    expect(event.node.res.statusCode).toBe(400)
    expect(response).toMatchObject({
      success: false,
      requestId: 'test-request-id',
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid revenue report payload',
      },
    })
    expect(response.error.details).toEqual(expect.arrayContaining([
      expect.objectContaining({ field: 'periodEnd' }),
      expect.objectContaining({ field: 'totalRevenue' }),
    ]))
  })
})
