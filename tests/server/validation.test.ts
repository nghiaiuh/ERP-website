import { describe, expect, it } from 'vitest'
import {
  validatePaginationQuery,
  validatePositiveIntegerParam,
  validateReportBody,
} from '../../server/utils/validation'

describe('validation utilities', () => {
  it('validates report body dates, amount and item fields', () => {
    const errors = validateReportBody({
      periodStart: '2026-01-31',
      periodEnd: '2026-01-01',
      totalRevenue: -1,
      items: [{ amount: -5, documentDate: 'not-a-date' }],
    }, 'totalRevenue')

    expect(errors).toEqual(expect.arrayContaining([
      expect.objectContaining({ field: 'periodEnd' }),
      expect.objectContaining({ field: 'totalRevenue' }),
      expect.objectContaining({ field: 'items[0].amount' }),
      expect.objectContaining({ field: 'items[0].documentDate' }),
    ]))
  })

  it('validates route params and pagination query', () => {
    expect(validatePositiveIntegerParam('abc', 'id')).toHaveLength(1)
    expect(validatePositiveIntegerParam('10', 'id')).toHaveLength(0)

    expect(validatePaginationQuery({ limit: '101', offset: '-1' })).toEqual([
      { field: 'offset', message: 'offset must be a non-negative integer' },
      { field: 'limit', message: 'limit cannot exceed 100' },
    ])
  })
})
