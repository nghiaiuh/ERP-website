import { vi } from 'vitest'

vi.stubGlobal('defineEventHandler', (handler: unknown) => handler)
