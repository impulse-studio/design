import { createHmac, randomUUID } from "node:crypto"
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest"
import { Pool } from "pg"
import { drizzle } from "drizzle-orm/node-postgres"
import { migrate } from "drizzle-orm/node-postgres/migrator"
import { and, eq } from "drizzle-orm"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import * as schema from "@/db/schema"
import { organizationPlugin } from "@/features/teams/plugin.server"
import {
  createRecord,
  listRecords,
  loadRecord,
  saveRecord,
  updateRecordStatus,
} from "@/features/mockups/repository.server"
import { createAuthOptions } from "./options.server"

let db: ReturnType<typeof drizzle<typeof schema>>
vi.mock("@/db/client.server", () => ({ getDatabase: () => db }))
const dbName = `digit_auth_test_${randomUUID().replaceAll("-", "")}`
const connectionString =
  process.env.TEST_DATABASE_URL ??
  "postgresql://digit:digit_dev@localhost:5433/digit_ai_studio"
const admin = new Pool({ connectionString })
const url = new URL(connectionString)
url.pathname = `/${dbName}`
let pool: Pool | undefined
const secret = "auth-integration-test-secret-at-least-thirty-two-characters"
const origin = "http://localhost:3402"
const makeAuth = () =>
  betterAuth({
    ...createAuthOptions({
      BETTER_AUTH_URL: origin,
      BETTER_AUTH_SECRET: secret,
      GOOGLE_CLIENT_ID: "test.apps.googleusercontent.com",
      GOOGLE_CLIENT_SECRET: "test",
      DEV_AUTH_PASSWORD: "",
      devMode: false,
    }),
    database: drizzleAdapter(db, { provider: "pg", schema }),
    plugins: [organizationPlugin()],
    rateLimit: { enabled: false },
    advanced: { disableOriginCheck: false, disableCSRFCheck: false },
    logger: { level: "error" },
  })
let auth: ReturnType<typeof makeAuth>
const cookies = new Map<string, string>()
const request = (
  path: string,
  userId?: string,
  body?: Record<string, unknown>,
  requestOrigin = origin
) =>
  auth.handler(
    new Request(`${origin}/api/auth${path}`, {
      method: body ? "POST" : "GET",
      headers: {
        origin: requestOrigin,
        "content-type": "application/json",
        ...(userId ? { cookie: cookies.get(userId)! } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  )

beforeAll(async () => {
  await admin.query(`CREATE DATABASE "${dbName}"`)
  pool = new Pool({ connectionString: url.toString() })
  db = drizzle(pool, { schema })
  await migrate(db, { migrationsFolder: "./drizzle" })
  for (const id of [
    "owner",
    "admin",
    "editor",
    "viewer",
    "outsider",
    "invitee",
  ]) {
    await db.insert(schema.user).values({
      id,
      name: id,
      email: `${id}@digitevent.com`,
      emailVerified: true,
    })
    const token = randomUUID()
    await db.insert(schema.session).values({
      id: `session-${id}`,
      token,
      userId: id,
      expiresAt: new Date(Date.now() + 86400000),
      activeOrganizationId: "team-a",
    })
    const signature = createHmac("sha256", secret)
      .update(token)
      .digest("base64")
    cookies.set(
      id,
      `better-auth.session_token=${encodeURIComponent(`${token}.${signature}`)}`
    )
  }
  await db.insert(schema.organization).values([
    { id: "team-a", slug: "a", name: "A" },
    { id: "team-b", slug: "b", name: "B" },
  ])
  await db.insert(schema.member).values([
    {
      id: "member-owner",
      userId: "owner",
      organizationId: "team-a",
      role: "owner",
    },
    {
      id: "member-admin",
      userId: "admin",
      organizationId: "team-a",
      role: "admin",
    },
    {
      id: "member-editor",
      userId: "editor",
      organizationId: "team-a",
      role: "member",
    },
    {
      id: "member-viewer",
      userId: "viewer",
      organizationId: "team-a",
      role: "viewer",
    },
    {
      id: "member-outsider",
      userId: "outsider",
      organizationId: "team-b",
      role: "owner",
    },
  ])
  auth = makeAuth()
})
afterAll(async () => {
  await pool?.end()
  await admin.query(`DROP DATABASE IF EXISTS "${dbName}"`)
  await admin.end()
})

describe("Better Auth sessions and team permissions", () => {
  it("requires sessions and rejects password registration and cross-origin changes", async () => {
    expect(await (await request("/get-session")).json()).toBeNull()
    const session = await (await request("/get-session", "owner")).json()
    expect(session.user.email).toBe("owner@digitevent.com")
    expect(
      (
        await request("/organization/create", undefined, {
          name: "Anonymous",
          slug: "anonymous",
        })
      ).status
    ).toBe(401)
    expect(
      (
        await request("/sign-up/email", undefined, {
          name: "Test",
          email: "test@digitevent.com",
          password: "Some-test-password",
        })
      ).status
    ).toBeGreaterThanOrEqual(400)
    expect(
      (
        await request(
          "/organization/update",
          "owner",
          { organizationId: "team-a", data: { name: "Hijacked" } },
          "https://evil.test"
        )
      ).status
    ).toBe(403)
  })

  it("creates teams with an owner and prevents joining by changing the active team", async () => {
    const created = await request("/organization/create", "editor", {
      name: "Editor Team",
      slug: "editor-team",
    })
    expect(created.status).toBe(200)
    const team = await created.json()
    expect(team.members[0]).toMatchObject({ userId: "editor", role: "owner" })
    expect(
      (
        await request("/organization/set-active", "outsider", {
          organizationId: "team-a",
        })
      ).status
    ).toBeGreaterThanOrEqual(400)
  })

  it("denies invitations to external addresses and member management to editors/readers", async () => {
    expect(
      (
        await request("/organization/invite-member", "owner", {
          organizationId: "team-a",
          email: "someone@gmail.com",
          role: "viewer",
        })
      ).status
    ).toBe(400)
    for (const id of ["editor", "viewer", "outsider"]) {
      expect(
        (
          await request("/organization/invite-member", id, {
            organizationId: "team-a",
            email: "invitee@digitevent.com",
            role: "viewer",
          })
        ).status
      ).toBeGreaterThanOrEqual(400)
      expect(
        (
          await request("/organization/update-member-role", id, {
            organizationId: "team-a",
            memberId: "member-viewer",
            role: "admin",
          })
        ).status
      ).toBeGreaterThanOrEqual(400)
    }
    expect(
      (
        await request("/organization/update-member-role", "admin", {
          organizationId: "team-a",
          memberId: "member-admin",
          role: "owner",
        })
      ).status
    ).toBe(403)
    expect(
      (
        await request("/organization/leave", "owner", {
          organizationId: "team-a",
        })
      ).status
    ).toBeGreaterThanOrEqual(400)
  })

  it("binds invitations to their recipient, supports acceptance and removal, and rejects reuse", async () => {
    const created = await request("/organization/invite-member", "owner", {
      organizationId: "team-a",
      email: "invitee@digitevent.com",
      role: "viewer",
    })
    expect(created.status).toBe(200)
    const invitation = await created.json()
    expect(
      (
        await request("/organization/accept-invitation", "outsider", {
          invitationId: invitation.id,
        })
      ).status
    ).toBeGreaterThanOrEqual(400)
    expect(
      (
        await request("/organization/accept-invitation", "invitee", {
          invitationId: invitation.id,
        })
      ).status
    ).toBe(200)
    expect(
      (
        await request("/organization/accept-invitation", "invitee", {
          invitationId: invitation.id,
        })
      ).status
    ).toBeGreaterThanOrEqual(400)
    expect(
      (
        await request("/organization/remove-member", "admin", {
          organizationId: "team-a",
          memberIdOrEmail: "invitee@digitevent.com",
        })
      ).status
    ).toBe(200)
    const membership = await db
      .select()
      .from(schema.member)
      .where(
        and(
          eq(schema.member.userId, "invitee"),
          eq(schema.member.organizationId, "team-a")
        )
      )
    expect(membership).toHaveLength(0)
  })

  it("rejects canceled and expired invitations", async () => {
    const created = await (
      await request("/organization/invite-member", "owner", {
        organizationId: "team-a",
        email: "invitee@digitevent.com",
        role: "member",
      })
    ).json()
    expect(
      (
        await request("/organization/cancel-invitation", "owner", {
          invitationId: created.id,
        })
      ).status
    ).toBe(200)
    expect(
      (
        await request("/organization/accept-invitation", "invitee", {
          invitationId: created.id,
        })
      ).status
    ).toBeGreaterThanOrEqual(400)
    const expired = await (
      await request("/organization/invite-member", "owner", {
        organizationId: "team-a",
        email: "invitee@digitevent.com",
        role: "member",
      })
    ).json()
    await db
      .update(schema.invitation)
      .set({ expiresAt: new Date(Date.now() - 1000) })
      .where(eq(schema.invitation.id, expired.id))
    expect(
      (
        await request("/organization/accept-invitation", "invitee", {
          invitationId: expired.id,
        })
      ).status
    ).toBeGreaterThanOrEqual(400)
  })

  it("enforces mockup isolation and read-only access in the database queries", async () => {
    const row = await createRecord("Private A", "owner", "team-a")
    expect((await loadRecord(row.id, "viewer")).canEdit).toBe(false)
    expect(await listRecords("outsider", "team-a")).toEqual([])
    await expect(loadRecord(row.id, "outsider")).rejects.toThrow("introuvable")
    await expect(createRecord("Denied", "viewer", "team-a")).rejects.toThrow()
    await expect(createRecord("Denied", "outsider", "team-a")).rejects.toThrow()
    const input = {
      id: row.id,
      name: "Modified",
      doc: row.doc,
      status: row.status,
      expectedRevision: 0,
    }
    await expect(saveRecord(input, "viewer")).rejects.toThrow("lecture seule")
    await expect(saveRecord(input, "outsider")).rejects.toThrow("introuvable")
    expect(
      await updateRecordStatus(
        { id: row.id, status: "approved", expectedRevision: 0 },
        "viewer"
      )
    ).toEqual({ saved: false })
    expect((await saveRecord(input, "editor")).status).toBe("saved")
    await db
      .update(schema.member)
      .set({ role: "viewer" })
      .where(eq(schema.member.id, "member-editor"))
    await expect(
      saveRecord({ ...input, expectedRevision: 1 }, "editor")
    ).rejects.toThrow("lecture seule")
    expect((await loadRecord(row.id, "owner")).revision).toBe(1)
  })

  it("revokes a signed session on logout", async () => {
    expect((await request("/sign-out", "viewer", {})).status).toBe(200)
    expect(await (await request("/get-session", "viewer")).json()).toBeNull()
  })
})
