import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createPostgresTestFixture, type PostgresTestFixture } from '../fixtures/postgres'

describe.skipIf(!process.env.TEST_DATABASE_URL)('PostgreSQL integration-test fixture', () => {
  let fixture: PostgresTestFixture

  beforeAll(async () => {
    fixture = await createPostgresTestFixture()
  })

  afterAll(async () => {
    await fixture.close()
  })

  it('connects to the isolated test database and can cleanup tables', async () => {
    const result = await fixture.pool.query('select 1 as ok')
    expect(result.rows[0].ok).toBe(1)

    await expect(fixture.cleanup()).resolves.toBeUndefined()
  })
})
