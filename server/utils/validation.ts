export interface ValidationError {
  field: string
  message: string
}

export type ReportBodyError = ValidationError

export function validateReportBody(
  body: Record<string, any>,
  amountKey: 'totalRevenue' | 'totalExpense',
): ValidationError[] {
  const errors: ValidationError[] = []

  if (!body?.periodStart || typeof body.periodStart !== 'string') {
    errors.push({ field: 'periodStart', message: 'periodStart is required and must be a string' })
  } else if (Number.isNaN(Date.parse(body.periodStart))) {
    errors.push({ field: 'periodStart', message: 'periodStart must be a valid date string' })
  }

  if (!body?.periodEnd || typeof body.periodEnd !== 'string') {
    errors.push({ field: 'periodEnd', message: 'periodEnd is required and must be a date string' })
  } else if (Number.isNaN(Date.parse(body.periodEnd))) {
    errors.push({ field: 'periodEnd', message: 'periodEnd must be a valid date string' })
  }

  if (errors.length === 0 && new Date(body.periodEnd) < new Date(body.periodStart)) {
    errors.push({ field: 'periodEnd', message: 'periodEnd must be a date after periodStart' })
  }

  const amount = body?.[amountKey]
  if (amount === undefined || typeof amount !== 'number') {
    errors.push({ field: amountKey, message: `${amountKey} is required and must be a number` })
  } else if (!Number.isFinite(amount) || amount < 0) {
    errors.push({ field: amountKey, message: `${amountKey} must be a non-negative number` })
  }

  if (body?.items !== undefined) {
    if (!Array.isArray(body.items)) {
      errors.push({ field: 'items', message: 'items must be an array' })
    } else if (body.items.length > 500) {
      errors.push({ field: 'items', message: 'items cannot exceed 500 rows' })
    } else {
      for (let i = 0; i < body.items.length; i++) {
        const item = body.items[i]
        const itemAmount = item?.amount ?? item?.totalAmount

        if (itemAmount !== undefined && (typeof itemAmount !== 'number' || !Number.isFinite(itemAmount) || itemAmount < 0)) {
          errors.push({ field: `items[${i}].amount`, message: 'item amount must be a non-negative number' })
        }

        if (item?.documentDate !== undefined && (typeof item.documentDate !== 'string' || Number.isNaN(Date.parse(item.documentDate)))) {
          errors.push({ field: `items[${i}].documentDate`, message: 'documentDate must be a valid date string' })
        }

        if (item?.documentNumber !== undefined && (typeof item.documentNumber !== 'string' || item.documentNumber.length > 100)) {
          errors.push({ field: `items[${i}].documentNumber`, message: 'documentNumber must be a string with at most 100 characters' })
        }

        if (item?.category !== undefined && (typeof item.category !== 'string' || item.category.length > 100)) {
          errors.push({ field: `items[${i}].category`, message: 'category must be a string with at most 100 characters' })
        }
      }
    }
  }

  if (body?.metadata !== undefined) {
    if (body.metadata.taxCode !== undefined && (typeof body.metadata.taxCode !== 'string' || !/^[\w-]{1,20}$/.test(body.metadata.taxCode))) {
      errors.push({ field: 'metadata.taxCode', message: 'taxCode is invalid' })
    }

    if (body.metadata.businessName !== undefined && (typeof body.metadata.businessName !== 'string' || body.metadata.businessName.length > 255)) {
      errors.push({ field: 'metadata.businessName', message: 'businessName must be a string with at most 255 characters' })
    }

    if (body.metadata.address !== undefined && (typeof body.metadata.address !== 'string' || body.metadata.address.length > 1000)) {
      errors.push({ field: 'metadata.address', message: 'address must be a string with at most 1000 characters' })
    }

    if (body.metadata.mauSo !== undefined && (typeof body.metadata.mauSo !== 'string' || body.metadata.mauSo.length > 100)) {
      errors.push({ field: 'metadata.mauSo', message: 'mauSo must be a string with at most 100 characters' })
    }
  }

  return errors
}

export function validatePositiveIntegerParam(value: unknown, field: string): ValidationError[] {
  const numericValue = Number(value)

  if (!Number.isInteger(numericValue) || numericValue <= 0) {
    return [{ field, message: `${field} must be a positive integer` }]
  }

  return []
}

export function validatePaginationQuery(query: Record<string, unknown>): ValidationError[] {
  const errors: ValidationError[] = []

  for (const field of ['limit', 'offset']) {
    if (query[field] === undefined) continue

    const value = Number(query[field])
    if (!Number.isInteger(value) || value < 0) {
      errors.push({ field, message: `${field} must be a non-negative integer` })
    }
  }

  if (query.limit !== undefined && Number(query.limit) > 100) {
    errors.push({ field: 'limit', message: 'limit cannot exceed 100' })
  }

  return errors
}
