import { randomUUID } from "node:crypto"
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest"
import { Pool } from "pg"
import { drizzle } from "drizzle-orm/node-postgres"
import { migrate } from "drizzle-orm/node-postgres/migrator"
import { eq } from "drizzle-orm"
import * as schema from "@/db/schema"
import { emptyDocument } from "@/features/editor/document"
import { applyMcpChanges } from "@/features/mcp/mockups.server"
import { mockupStatusSchema } from "@/validators/mockups"
import {
  createRecord as createScopedRecord,
  loadRecord as loadScopedRecord,
  saveRecord as saveScopedRecord,
  updateRecordStatus as updateScopedRecordStatus,
} from "./repository.server"

const userId = "test-owner"
const organizationId = "test-team"
const createRecord = (name: string) =>
  createScopedRecord(name, userId, organizationId)
const loadRecord = (id: string) => loadScopedRecord(id, userId)
const saveRecord = (input: Parameters<typeof saveScopedRecord>[0]) =>
  saveScopedRecord(input, userId)
const updateRecordStatus = (
  input: Parameters<typeof updateScopedRecordStatus>[0]
) => updateScopedRecordStatus(input, userId)

let database: ReturnType<typeof drizzle<typeof schema>>
vi.mock("@/db/client.server", () => ({ getDatabase: () => database }))
const name = `digit_test_${randomUUID().replaceAll("-", "")}`
const connectionString =
  process.env.TEST_DATABASE_URL ??
  "postgresql://digit:digit_dev@localhost:5433/digit_ai_studio"
const admin = new Pool({ connectionString }),
  url = new URL(connectionString)
url.pathname = `/${name}`
let pool: Pool | undefined
beforeAll(async () => {
  await admin.query(`CREATE DATABASE "${name}"`)
  pool = new Pool({ connectionString: url.toString() })
  database = drizzle(pool, { schema })
  await migrate(database, { migrationsFolder: "./drizzle" })
  await migrate(database, { migrationsFolder: "./drizzle" })
  await database.insert(schema.user).values({
    id: userId,
    name: "Test Owner",
    email: "owner@digitevent.com",
    emailVerified: true,
  })
  await database
    .insert(schema.organization)
    .values({ id: organizationId, name: "Test Team", slug: "test-team" })
  await database
    .insert(schema.member)
    .values({ id: "test-member", userId, organizationId, role: "owner" })
})
afterAll(async () => {
  await pool?.end()
  await admin.query(`DROP DATABASE IF EXISTS "${name}"`)
  await admin.end()
})
describe("PostgreSQL migrations and revision protection", () => {
  it("enregistre une modification MCP et refuse la même révision ensuite", async () => {
    const row = await createRecord("Depuis Claude Code")
    const change = {
      mockup: row.id,
      expectedRevision: row.revision,
      summary: "Agrandir le plan de travail",
      operations: [
        {
          type: "updateNode" as const,
          id: row.doc.pages[0].frames[0].id,
          patch: { width: 1280 },
        },
      ],
    }
    expect(
      await applyMcpChanges(userId, change, "https://studio.example.com")
    ).toMatchObject({
      status: "saved",
      revision: 1,
    })
    expect((await loadRecord(row.id)).doc.pages[0].frames[0].width).toBe(1280)
    expect(
      await applyMcpChanges(userId, change, "https://studio.example.com")
    ).toEqual({
      status: "conflict",
      revision: 1,
    })
  })
  it("creates an empty desktop, saves document and lifecycle, then reloads", async () => {
    const row = await createRecord("Maquette de test")
    expect(row.status).toBe("draft")
    expect(row.doc.pages[0].frames[0].children).toEqual([])
    const doc = emptyDocument()
    doc.pages[0].frames[0].width = 1280
    const result = await saveRecord({
      id: row.id,
      name: "Modifiée",
      status: "in_review",
      doc,
      expectedRevision: 0,
    })
    expect(result.status).toBe("saved")
    const loaded = await loadRecord(row.id)
    expect(loaded).toMatchObject({
      name: "Modifiée",
      status: "in_review",
      revision: 1,
    })
    expect(loaded.doc).toEqual(doc)
    expect(
      await updateRecordStatus({
        id: row.id,
        status: "approved",
        expectedRevision: 1,
      })
    ).toEqual({ saved: true })
    expect((await loadRecord(row.id)).status).toBe("approved")
  })
  it("accepts one of two concurrent writes and rejects stale lifecycle updates", async () => {
    const row = await createRecord("Concurrence")
    const input = {
      id: row.id,
      name: row.name,
      status: row.status,
      doc: row.doc,
      expectedRevision: 0,
    }
    const results = await Promise.all([
      saveRecord({ ...input, name: "A" }),
      saveRecord({ ...input, name: "B" }),
    ])
    expect(results.filter((result) => result.status === "saved")).toHaveLength(
      1
    )
    expect(
      results.filter((result) => result.status === "conflict")
    ).toHaveLength(1)
    expect(
      await updateRecordStatus({
        id: row.id,
        status: "approved",
        expectedRevision: 0,
      })
    ).toEqual({ saved: false })
    expect((await loadRecord(row.id)).revision).toBe(1)
  })
  it("rejects invalid component props and invalid status values without writing", async () => {
    const row = await createRecord("Validation")
    row.doc.pages[0].frames[0].children.push({
      id: randomUUID(),
      type: "component",
      component: "DigiButton",
      props: { variant: "does-not-exist" },
    })
    await expect(
      saveRecord({
        id: row.id,
        name: row.name,
        status: row.status,
        doc: row.doc,
        expectedRevision: 0,
      })
    ).rejects.toThrow("Valeur invalide")
    expect((await loadRecord(row.id)).revision).toBe(0)
    expect(mockupStatusSchema.safeParse("unknown").success).toBe(false)
    await expect(
      database
        .update(schema.mockups)
        .set({ status: "unknown" as "draft" })
        .where(eq(schema.mockups.id, row.id))
    ).rejects.toThrow()
  })
  it("preserves the server document through a closed connection and recovery", async () => {
    const row = await createRecord("Connexion")
    await pool!.end()
    await expect(
      saveRecord({
        id: row.id,
        name: "Hors ligne",
        status: row.status,
        doc: row.doc,
        expectedRevision: 0,
      })
    ).rejects.toThrow()
    pool = new Pool({ connectionString: url.toString() })
    database = drizzle(pool, { schema })
    expect((await loadRecord(row.id)).name).toBe("Connexion")
  })
})
