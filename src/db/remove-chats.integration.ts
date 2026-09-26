import { randomUUID } from "node:crypto"
import { afterAll, expect, it } from "vitest"
import { Pool } from "pg"
import { readMigrationFiles } from "drizzle-orm/migrator"

const connectionString =
  process.env.TEST_DATABASE_URL ??
  "postgresql://digit:digit_dev@localhost:5433/digit_ai_studio"
const admin = new Pool({ connectionString })
const name = `digit_test_${randomUUID().replaceAll("-", "")}`
let pool: Pool | undefined

afterAll(async () => {
  await pool?.end()
  await admin.query(`DROP DATABASE IF EXISTS "${name}"`)
  await admin.end()
})

it("removes populated chat tables while preserving documents and versions", async () => {
  await admin.query(`CREATE DATABASE "${name}"`)
  const url = new URL(connectionString)
  url.pathname = `/${name}`
  pool = new Pool({ connectionString: url.toString() })
  const migrations = readMigrationFiles({ migrationsFolder: "./drizzle" })
  for (const migration of migrations.slice(0, -1))
    for (const statement of migration.sql) await pool.query(statement)
  await pool.query(`
    INSERT INTO auth_user (id, name, email, email_verified, created_at, updated_at)
    VALUES ('owner', 'Owner', 'owner@example.com', true, now(), now());
    INSERT INTO mockups (id, name, doc) VALUES ('mockup', 'Saved mockup', '{"saved":true}');
    INSERT INTO site_projects (id, doc) VALUES ('mockup', '{"files":{"src/App.tsx":"saved source"}}');
    INSERT INTO site_versions (id, project_id, revision, doc, summary)
    VALUES ('version', 'mockup', 0, '{"saved":true}', 'Initial');
    INSERT INTO ai_connections (user_id) VALUES ('owner');
    INSERT INTO ai_conversations (id, user_id, mockup_id, title, transcript)
    VALUES ('conversation', 'owner', 'mockup', 'Old conversation', '[{"role":"user","content":"hello"}]');
    INSERT INTO ai_runs (id, user_id, conversation_id, request_id, model, prompt, context)
    VALUES ('run', 'owner', 'conversation', 'request', 'old-model', 'hello', '{}');
    INSERT INTO ai_proposals (id, run_id, tool_call_id, input, base_revision, base_hash, result_hash)
    VALUES ('proposal', 'run', 'tool', '{}', 0, 'before', 'after');
    INSERT INTO site_proposals (id, project_id, run_id, tool_call_id, base_revision, input)
    VALUES ('site-proposal', 'mockup', 'run', 'tool', 0, '{}');
    INSERT INTO ai_callback_receipts (id, expires_at) VALUES ('receipt', now());
  `)
  const tables = ["mockups", "site_projects", "site_versions"]
  const before = await Promise.all(
    tables.map((table) => pool!.query(`SELECT * FROM ${table}`))
  )
  for (const statement of migrations.at(-1)!.sql) await pool.query(statement)
  for (const [index, table] of tables.entries())
    expect((await pool.query(`SELECT * FROM ${table}`)).rows).toEqual(
      before[index].rows
    )
  for (const table of [
    "ai_connections",
    "ai_conversations",
    "ai_runs",
    "ai_proposals",
    "ai_callback_receipts",
    "site_proposals",
  ])
    expect(
      (await pool.query("SELECT to_regclass($1) AS relation", [table])).rows[0]
        .relation
    ).toBeNull()
})
