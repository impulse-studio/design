import { randomUUID } from "node:crypto"
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest"
import { Pool } from "pg"
import { drizzle } from "drizzle-orm/node-postgres"
import { migrate } from "drizzle-orm/node-postgres/migrator"
import { eq } from "drizzle-orm"
import * as schema from "@/db/schema"
import { createRecord, loadRecord } from "@/features/mockups/repository.server"
import { createSiteDocument } from "./document.fixture"
import { applySiteProposal, elementsOf } from "./source"
import {
  saveSiteChange,
  getSiteVersion,
  siteHistory,
} from "./repository.server"

const userId = "test-owner",
  organizationId = "test-team"
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

describe("persistent React site revisions", () => {
  it("preserves legacy documents and rejects stale changes, cross-project restores and readers", async () => {
    const record = await createRecord("React project", userId, organizationId),
      doc = applySiteProposal(createSiteDocument(), {
        summary: "Premier contenu",
        operations: [
          {
            type: "writeFile",
            path: "src/App.tsx",
            content: "export function App(){return <h1>Bienvenue</h1>}",
          },
        ],
      }),
      versionId = randomUUID()
    await database.insert(schema.siteProjects).values({ id: record.id, doc })
    await database.insert(schema.siteVersions).values({
      id: versionId,
      projectId: record.id,
      revision: 0,
      doc,
      summary: "Initial",
    })
    const id = elementsOf(doc).find((e) => e.tag === "h1")!.id
    const updated = await saveSiteChange(record.id, userId, 0, {
      type: "visual",
      edit: { id, breakpoint: "mobile", styles: { padding: "12px" } },
    })
    expect(updated.revision).toBe(1)
    expect(updated.doc.files["src/visual.css"]).toContain("12px")
    await expect(
      saveSiteChange(record.id, userId, 0, { type: "text", id, text: "Stale" })
    ).rejects.toMatchObject({ kind: "conflict" })
    expect((await loadRecord(record.id, userId)).doc).toEqual(record.doc)
    expect(
      (await siteHistory(record.id, userId)).map((v) => v.revision)
    ).toEqual([1, 0])
    expect(await getSiteVersion(record.id, userId, versionId)).toEqual(doc)
    const other = await createRecord("Other", userId, organizationId)
    await database.insert(schema.siteProjects).values({ id: other.id, doc })
    await expect(
      saveSiteChange(other.id, userId, 0, { type: "restore", versionId })
    ).rejects.toMatchObject({ kind: "invalid" })
    const restored = await saveSiteChange(record.id, userId, 1, {
      type: "restore",
      versionId,
    })
    expect(restored.revision).toBe(2)
    expect(restored.doc).toEqual(doc)
    await database
      .update(schema.member)
      .set({ role: "viewer" })
      .where(eq(schema.member.userId, userId))
    await expect(
      saveSiteChange(record.id, userId, 2, {
        type: "text",
        id,
        text: "Forbidden",
      })
    ).rejects.toMatchObject({ kind: "forbidden" })
    await database
      .update(schema.member)
      .set({ role: "owner" })
      .where(eq(schema.member.userId, userId))
  })
  it("persists MCP edits with history and rejects concurrent writes", async () => {
    const record = await createRecord("MCP project", userId, organizationId)
    await database
      .insert(schema.siteProjects)
      .values({ id: record.id, doc: createSiteDocument() })
    const change = {
      type: "mcp" as const,
      input: {
        summary: "Titre demandé depuis Claude Code",
        operations: [
          {
            type: "writeFile" as const,
            path: "src/components/Welcome.tsx",
            content: "export function Welcome(){return <h1>Bienvenue</h1>}",
          },
        ],
      },
    }
    const results = await Promise.allSettled([
      saveSiteChange(record.id, userId, 0, change),
      saveSiteChange(record.id, userId, 0, change),
    ])
    expect(
      results.filter((result) => result.status === "fulfilled")
    ).toHaveLength(1)
    expect(
      results.filter((result) => result.status === "rejected")
    ).toHaveLength(1)
    const history = await siteHistory(record.id, userId)
    expect(history).toHaveLength(1)
    expect(history[0]).toMatchObject({
      revision: 1,
      summary: change.input.summary,
    })
    expect(
      (await getSiteVersion(record.id, userId, history[0].id)).files[
        "src/components/Welcome.tsx"
      ]
    ).toContain("Bienvenue")
  })
})
