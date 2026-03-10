export interface ReportBodyError {
    field: string
    message: string   
}

export function validateReportBody(body: any, amountKey: 'totalRevenue' | 'totalExpense'): ReportBodyError[] {
    const errors: ReportBodyError[] = []

    if (!body?.periodStart || typeof body.periodStart !== 'string') {
        errors.push({ field: 'periodStart', message: 'periodStart is required and must be a string' })
    }
    else if (isNaN(Date.parse(body.periodStart))) {
        errors.push({ field: 'periodStart', message: 'periodStart must be a valid date string' })
    }

    if (!body?.periodEnd || typeof body.periodEnd !== 'string') {
        errors.push({ field: 'periodEnd', message: 'periodEnd is required and must be a date string' })
    }
    else if (isNaN(Date.parse(body.periodEnd))) {
        errors.push({ field: 'periodEnd', message: 'periodEnd must be a valid date string' })
    }

    // check if periodEnd >= periodStart
    if (
        errors.length === 0 &&
        new Date(body.periodEnd) < new Date(body.periodStart)
    ) {
        errors.push({ field: 'periodEnd', message: 'periodEnd must be a date after periodStart' })
    }

    // totalRevenue / totalExpense >= 0
    const amount = body?.[amountKey]
    if (amount === undefined || typeof amount !== 'number') {
        errors.push({ field: amountKey, message: `${amountKey} is required and must be a number` })
    } else if (!isFinite(amount) || amount < 0) {
        errors.push({ field: amountKey, message: `${amountKey} must be a positive number` })
    }

    // items — nếu có phải là mảng, mỗi phần tử phải có amount hợp lệ
    if (body?.items !== undefined) {
        if (!Array.isArray(body.items)) {
        errors.push({ field: 'items', message: 'items phải là mảng' })
        } else {
        for (let i = 0; i < body.items.length; i++) {
            const item = body.items[i]
            const itemAmount = item?.amount ?? item?.totalAmount
            if (itemAmount !== undefined) {
            if (typeof itemAmount !== 'number' || !isFinite(itemAmount) || itemAmount < 0) {
                errors.push({ field: `items[${i}].amount`, message: 'Số tiền mục phải là số không âm' })
            }
            }
        }
        }
    }

    // metadata.taxCode — nếu có, chỉ cho phép ký tự an toàn
    if (body?.metadata?.taxCode !== undefined) {
        if (typeof body.metadata.taxCode !== 'string' || !/^[\w\-]{1,20}$/.test(body.metadata.taxCode)) {
        errors.push({ field: 'metadata.taxCode', message: 'taxCode không hợp lệ (chỉ chữ, số, gạch ngang, tối đa 20 ký tự)' })
        }
    }
    return errors
}