import { Pool } from 'pg'

export interface PostgresTestFixture {
  pool: Pool
  cleanup: () => Promise<void>
  close: () => Promise<void>
}

export async function createPostgresTestFixture(): Promise<PostgresTestFixture> {
  const connectionString = process.env.TEST_DATABASE_URL
  if (!connectionString) {
    throw new Error('TEST_DATABASE_URL is required for PostgreSQL integration tests')
  }

  const pool = new Pool({ connectionString })

  return {
    pool,
    cleanup: async () => {
      await pool.query(`
        DO $$
        DECLARE
          table_record RECORD;
        BEGIN
          FOR table_record IN
            SELECT tablename
            FROM pg_tables
            WHERE schemaname = 'public'
          LOOP
            EXECUTE format('TRUNCATE TABLE %I RESTART IDENTITY CASCADE', table_record.tablename);
          END LOOP;
        END $$;
      `)
    },
    close: async () => {
      await pool.end()
    },
  }
}
