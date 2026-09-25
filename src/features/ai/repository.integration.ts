import { readFile } from "node:fs/promises"
import { handleWorkerCallback } from "./callback.server"
import { signCallback } from "./callback-auth"
import { proxyInput } from "./transport.server"
import { randomUUID } from "node:crypto"
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest"
import { Pool } from "pg"
import { drizzle } from "drizzle-orm/node-postgres"
import { migrate } from "drizzle-orm/node-postgres/migrator"
import { eq } from "drizzle-orm"
import * as schema from "@/db/schema"
import {
  createRecord,
  loadRecord,
  saveRecord,
} from "@/features/mockups/repository.server"
import {
  claimRun,
  createConversation,
  decideProposal,
  documentHash,
  enqueueRun,
  getSnapshot,
  persistProposal,
  prepareProposal,
  requireConversation,
} from "./repository.server"

const transport = vi.hoisted(() => ({ upstream: vi.fn() }))
vi.mock("./trigger.server", () => ({ triggerFetch: transport.upstream }))
let database: ReturnType<typeof drizzle<typeof schema>>
vi.mock("@/db/client.server", () => ({ getDatabase: () => database }))
vi.mock("@/features/auth/session.server", () => ({
  readCurrentUser: async () => null,
}))
const databaseName = `digit_ai_test_${randomUUID().replaceAll("-", "")}`
const connectionString =
  process.env.TEST_DATABASE_URL ??
  "postgresql://digit:digit_dev@localhost:5433/digit_ai_studio"
const admin = new Pool({ connectionString }),
  url = new URL(connectionString)
url.pathname = `/${databaseName}`
let pool: Pool
let mockupId: string
beforeAll(async () => {
  vi.stubEnv("AI_CALLBACK_SECRET", "test-only-".repeat(5))
  await admin.query(`CREATE DATABASE "${databaseName}"`)
  pool = new Pool({ connectionString: url.toString() })
  database = drizzle(pool, { schema })
  await migrate(database, { migrationsFolder: "./drizzle" })
  await migrate(database, { migrationsFolder: "./drizzle" })
  await database
    .insert(schema.organization)
    .values({ id: "team", name: "Équipe", slug: "team" })
  for (const id of ["alice", "bob", "carole", "viewer"]) {
    await database.insert(schema.user).values({
      id,
      name: id,
      email: `${id}@digitevent.com`,
      emailVerified: true,
    })
    await database.insert(schema.member).values({
      id,
      userId: id,
      organizationId: "team",
      role: id === "viewer" ? "viewer" : "member",
    })
  }
})
beforeEach(async () => {
  await database.delete(schema.aiConversations)
  const record = await createRecord("Partagée", "alice", "team")
  mockupId = record.id
})
afterAll(async () => {
  await pool.end()
  await admin.query(`DROP DATABASE IF EXISTS "${databaseName}"`)
  await admin.end()
  vi.unstubAllEnvs()
})
const enqueue = async (userId = "alice") => {
  const { id } = await createConversation(userId, mockupId)
  const record = await loadRecord(mockupId, userId)
  const input = {
    conversationId: id,
    requestId: randomUUID(),
    model: "model-from-account",
    prompt: "Crée une page",
    docHash: documentHash(record.doc),
    selectedIds: [],
  }
  return { input, result: await enqueueRun(userId, input) }
}
describe("chat API persistant et isolé", () => {
  it("partage la maquette mais jamais les conversations et propositions", async () => {
    const { input } = await enqueue()
    expect((await loadRecord(mockupId, "bob")).id).toBe(mockupId)
    expect((await getSnapshot("bob", mockupId)).messages).toEqual([])
    await expect(
      requireConversation("bob", input.conversationId)
    ).rejects.toThrow("introuvable")
    await expect(
      getSnapshot("bob", mockupId, input.conversationId)
    ).rejects.toThrow("introuvable")
  })
  it("déduplique les envois et limite à une génération par compte", async () => {
    const { input, result } = await enqueue()
    const retries = await Promise.all([
      enqueueRun("alice", input),
      enqueueRun("alice", input),
    ])
    expect(retries).toEqual([result, result])
    await expect(
      enqueueRun("alice", { ...input, requestId: randomUUID() })
    ).rejects.toThrow("déjà en cours")
    await expect(
      enqueueRun("alice", { ...input, prompt: "autre message" })
    ).rejects.toThrow("déjà utilisé")
    expect((await getSnapshot("alice", mockupId)).messages).toHaveLength(2)
  })
  it("limite à deux générations globales et préserve la file", async () => {
    await enqueue("alice")
    await enqueue("bob")
    await enqueue("carole")
    const claims = await Promise.all([claimRun(), claimRun(), claimRun()])
    expect(claims.filter(Boolean)).toHaveLength(2)
    expect(
      await database
        .select()
        .from(schema.aiRuns)
        .where(eq(schema.aiRuns.status, "queued"))
    ).toHaveLength(1)
  })
  it("conserve le texte partiel après perte du worker sans rejouer le message", async () => {
    await enqueue()
    const run = (await claimRun())!
    await database
      .update(schema.aiRuns)
      .set({
        answer: "Réponse partielle",
        updatedAt: new Date(Date.now() - 90_000),
      })
      .where(eq(schema.aiRuns.id, run.id))
    expect(await claimRun()).toBeNull()
    const snapshot = await getSnapshot("alice", mockupId)
    expect(snapshot.run?.status).toBe("interrupted")
    expect(snapshot.messages[1].text).toBe("Réponse partielle")
  })
  it("valide une proposition puis attend la sauvegarde avant de la marquer appliquée", async () => {
    await enqueue()
    const run = (await claimRun())!
    const frame = run.context.doc.pages[0].frames[0]
    const proposal = await persistProposal(run, "tool1", {
      summary: "Titre",
      operations: [
        {
          type: "insertNode",
          parentId: frame.id,
          node: { id: "title", type: "text", content: "Bienvenue" },
        },
      ],
    })
    await expect(
      prepareProposal("bob", proposal.proposalId, run.context.hash)
    ).rejects.toThrow("introuvable")
    const prepared = await prepareProposal(
      "alice",
      proposal.proposalId,
      run.context.hash
    )
    expect(
      (await loadRecord(mockupId, "alice")).doc.pages[0].frames[0].children
    ).toEqual([])
    await expect(
      decideProposal("alice", proposal.proposalId, "applied")
    ).rejects.toThrow("sauvegarde")
    const record = await loadRecord(mockupId, "alice")
    await saveRecord(
      {
        id: mockupId,
        name: record.name,
        status: record.status,
        doc: prepared.doc,
        expectedRevision: record.revision,
      },
      "alice"
    )
    const retry = await prepareProposal(
      "alice",
      proposal.proposalId,
      documentHash(prepared.doc)
    )
    expect(retry.alreadyApplied).toBe(true)
    expect(retry.doc).toEqual(prepared.doc)
    await decideProposal("alice", proposal.proposalId, "applied")
    expect((await getSnapshot("alice", mockupId)).proposals[0].status).toBe(
      "applied"
    )
  })
  it("refuse les propositions obsolètes et les droits révoqués", async () => {
    await enqueue()
    const run = (await claimRun())!
    const proposal = await persistProposal(run, "tool1", {
      summary: "Taille",
      operations: [
        {
          type: "updateNode",
          id: run.context.doc.pages[0].frames[0].id,
          patch: { width: 1200 },
        },
      ],
    })
    await expect(
      prepareProposal("alice", proposal.proposalId, "different-hash")
    ).rejects.toThrow("changé")
    await database
      .update(schema.mockups)
      .set({ revision: 1 })
      .where(eq(schema.mockups.id, mockupId))
    await expect(
      prepareProposal("alice", proposal.proposalId, run.context.hash)
    ).rejects.toThrow("changé")
    await database
      .update(schema.member)
      .set({ role: "viewer" })
      .where(eq(schema.member.id, "alice"))
    await expect(
      prepareProposal("alice", proposal.proposalId, run.context.hash)
    ).rejects.toBeInstanceOf(Response)
    await database
      .update(schema.member)
      .set({ role: "member" })
      .where(eq(schema.member.id, "alice"))
  })
  it("refuse un snapshot local non sauvegardé", async () => {
    const { id } = await createConversation("bob", mockupId)
    const record = await loadRecord(mockupId, "bob")
    const input = {
      conversationId: id,
      requestId: randomUUID(),
      model: "m",
      prompt: "Test",
      docHash: "stale",
      selectedIds: [],
    }
    await expect(enqueueRun("bob", input)).rejects.toThrow("Enregistrez")
    expect(
      (await enqueueRun("bob", { ...input, docHash: documentHash(record.doc) }))
        .id
    ).toBeTruthy()
  })
})

const callbackRequest = (chatId: string, action: string, data: Record<string, unknown> = {}) => {
  const body = JSON.stringify({ chatId, action, eventId: randomUUID(), ...data })
  return new Request("https://studio.test/api/ai/callback", { method: "POST", headers: signCallback(body), body })
}
describe("callbacks Cloud et proxy privé", () => {
  it("vérifie la signature, la portée et les replays avant toute modification", async () => {
    const { input, result } = await enqueue()
    const bob = await createConversation("bob", mockupId)
    const scope = { runId: result.id, triggerRunId: "trigger-run-a" }
    expect((await handleWorkerCallback(callbackRequest(bob.id, "begin", scope))).status).toBe(404)
    const signed = callbackRequest(input.conversationId, "begin", scope)
    const replay = signed.clone()
    expect((await handleWorkerCallback(signed)).status).toBe(200)
    expect((await handleWorkerCallback(replay)).status).toBe(409)
    const forged = new Request(callbackRequest(input.conversationId, "complete", scope), { headers: { "x-ai-signature": "0".repeat(64) } })
    expect((await handleWorkerCallback(forged)).status).toBe(401)
    expect((await handleWorkerCallback(callbackRequest(input.conversationId, "heartbeat", { ...scope, triggerRunId: "another-worker", answer: "injected" }))).status).toBe(409)
    expect((await getSnapshot("alice", mockupId)).run?.status).toBe("running")
  })
  it("conserve le transcript, les tokens et un résultat de proposition idempotent", async () => {
    const { input, result } = await enqueue()
    const scope = { runId: result.id, triggerRunId: "trigger-run" }
    await handleWorkerCallback(callbackRequest(input.conversationId, "begin", scope))
    await handleWorkerCallback(callbackRequest(input.conversationId, "heartbeat", { ...scope, answer: "Partiel" }))
    expect((await getSnapshot("alice", mockupId)).messages[1].text).toBe("Partiel")
    const record = await loadRecord(mockupId, "alice")
    const args = { ...scope, callId: "stable-tool-id", input: { summary: "Largeur", operations: [{ type: "updateNode", id: record.doc.pages[0].frames[0].id, patch: { width: 1200 } }] } }
    const first = await (await handleWorkerCallback(callbackRequest(input.conversationId, "proposal", args))).json()
    const second = await (await handleWorkerCallback(callbackRequest(input.conversationId, "proposal", args))).json()
    expect(second.proposalId).toBe(first.proposalId)
    await handleWorkerCallback(callbackRequest(input.conversationId, "complete", { ...scope, answer: "Terminé", status: "completed", inputTokens: 40, outputTokens: 12 }))
    const messages = [{ id: `${result.id}:user`, role: "user", parts: [{ type: "text", text: input.prompt }] }, { id: "assistant-sdk", role: "assistant", parts: [{ type: "text", text: "Terminé" }] }]
    // Trigger saves AFTER onTurnComplete: terminal status must not discard the final transcript.
    expect((await handleWorkerCallback(callbackRequest(input.conversationId, "save", { ...scope, messages, lastEventId: "42" }))).status).toBe(200)
    const snapshot = await getSnapshot("alice", mockupId)
    expect(snapshot.uiMessages).toEqual(messages)
    expect(snapshot.lastEventId).toBe("42")
    expect(snapshot.usage[0]).toMatchObject({ inputTokens: 40, outputTokens: 12 })
    expect(snapshot.proposals).toHaveLength(1)
  })
  it("interrompt la récupération sans rejouer et refuse les droits révoqués", async () => {
    const { input, result } = await enqueue()
    const scope = { runId: result.id, triggerRunId: "old-worker" }
    await handleWorkerCallback(callbackRequest(input.conversationId, "begin", scope))
    await handleWorkerCallback(callbackRequest(input.conversationId, "heartbeat", { ...scope, answer: "Conservé" }))
    await handleWorkerCallback(callbackRequest(input.conversationId, "recover", { triggerRunId: "old-worker" }))
    expect((await getSnapshot("alice", mockupId)).run?.status).toBe("interrupted")
    expect((await getSnapshot("alice", mockupId)).messages[1].text).toBe("Conservé")
    expect(await (await handleWorkerCallback(callbackRequest(input.conversationId, "begin", scope))).json()).toEqual({ interrupted: true })
    await database.delete(schema.member).where(eq(schema.member.id, "alice"))
    expect((await handleWorkerCallback(callbackRequest(input.conversationId, "load"))).status).toBe(403)
    await database.insert(schema.member).values({ id: "alice", userId: "alice", organizationId: "team", role: "member" })
  })
  it("le proxy remplace les métadonnées, déduplique et ne révèle pas les jetons", async () => {
    const { input, result } = await enqueue()
    transport.upstream.mockReset().mockResolvedValue(Response.json({ seq: 12, publicAccessToken: "secret-never-public" }))
    const request = () => new Request("https://studio.test/api/ai/transport/in", { method: "POST", body: JSON.stringify({ kind: "message", payload: { chatId: input.conversationId, runId: result.id, trigger: "submit-message", metadata: { userId: "bob", model: "hacked" }, message: { id: `${result.id}:user`, role: "user", parts: [{ type: "text", text: input.prompt }] } } }) })
    await expect(proxyInput(request(), "bob")).rejects.toThrow("introuvable")
    const response = await proxyInput(request(), "alice")
    expect(await response.json()).toEqual({ seq: 12 })
    const forwarded = transport.upstream.mock.calls[0][2]
    expect(JSON.parse(forwarded.body).payload.metadata).toEqual({ runId: result.id })
    expect(forwarded.headers["X-Part-Id"]).toBe(result.id)
    expect(transport.upstream).toHaveBeenCalledTimes(1)
  })
  it("la migration conserve les anciens messages et interrompt les tours Codex", async () => {
    const { input, result } = await enqueue()
    await database.update(schema.aiRuns).set({ answer: "Ancienne réponse" }).where(eq(schema.aiRuns.id, result.id))
    const migration = await readFile("drizzle/0005_api_chat.sql", "utf8")
    const updates = migration.slice(migration.indexOf("UPDATE ai_runs"))
    await pool.query(updates)
    const snapshot = await getSnapshot("alice", mockupId, input.conversationId)
    expect(snapshot.run?.status).toBe("interrupted")
    expect(snapshot.uiMessages).toHaveLength(2)
    expect(snapshot.uiMessages[1].parts).toEqual([{ type: "text", text: "Ancienne réponse" }])
  })
})
