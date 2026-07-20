import { describe, expect, it, vi } from 'vitest'
import { testSupabaseConnection } from '../../server/utils/supabase'

describe('Supabase connectivity check', () => {
  it('returns connected when the users table can be queried', async () => {
    const select = vi.fn().mockResolvedValue({ error: null })
    const client = {
      from: vi.fn(() => ({ select })),
    }

    await expect(testSupabaseConnection(client as any)).resolves.toEqual({
      configured: true,
      connected: true,
      message: 'Supabase connection succeeded',
    })
    expect(client.from).toHaveBeenCalledWith('users')
    expect(select).toHaveBeenCalledWith('id', { count: 'exact', head: true })
  })

  it('returns a failed connection result when Supabase reports an error', async () => {
    const client = {
      from: vi.fn(() => ({
        select: vi.fn().mockResolvedValue({ error: { message: 'permission denied' } }),
      })),
    }

    await expect(testSupabaseConnection(client as any)).resolves.toEqual({
      configured: true,
      connected: false,
      message: 'permission denied',
    })
  })
})
