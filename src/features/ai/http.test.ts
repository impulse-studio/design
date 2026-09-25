import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { handleAiGet, handleAiPost } from "./http.server"

const mocks = vi.hoisted(() => ({
  user: vi.fn(),
  snapshot: vi.fn(),
  stop: vi.fn(),
  enqueue: vi.fn(),
}))
vi.mock("./access.server", () => ({
  studioAiAccess: { requireUser: mocks.user },
}))
vi.mock("./repository.server", () => ({
  getSnapshot: mocks.snapshot,
  createConversation: vi.fn(),
  decideProposal: vi.fn(),
  enqueueRun: mocks.enqueue,
  prepareProposal: vi.fn(),
}))
vi.mock("./trigger.server", () => ({
  expireRuns: vi.fn(),
  startSession: vi.fn(),
  interruptRuns: mocks.stop,
}))
vi.mock("./config.server", () => ({
  readAiConfiguration: vi.fn(),
  requireModel: vi.fn(),
}))

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubEnv("BETTER_AUTH_URL", "https://studio.test")
  mocks.user.mockResolvedValue({ userId: "alice" })
})
afterEach(() => vi.useRealTimers())
describe("frontière HTTP IA", () => {
  it("réauthentifie le flux et ferme les événements si la session change", async () => {
    vi.useFakeTimers()
    mocks.snapshot.mockResolvedValue({
      conversationId: "private-alice",
      messages: [],
    })
    const response = await handleAiGet(
      new Request("https://studio.test/api/ai/events?mockupId=m")
    )
    const reader = response.body!.getReader()
    const first = await reader.read()
    expect(new TextDecoder().decode(first.value)).toContain("private-alice")
    expect(mocks.snapshot).toHaveBeenCalledWith("alice", "m", undefined)
    mocks.user.mockResolvedValue({ userId: "bob" })
    await vi.advanceTimersByTimeAsync(1200)
    expect(new TextDecoder().decode((await reader.read()).value)).toContain(
      "event: unavailable"
    )
    expect((await reader.read()).done).toBe(true)
    expect(mocks.snapshot).toHaveBeenCalledTimes(1)
    expect(mocks.enqueue).not.toHaveBeenCalled()
  })
  it("une reconnexion SSE ne réenvoie jamais une génération", async () => {
    mocks.snapshot.mockResolvedValue({
      conversationId: "private-alice",
      messages: [{ text: "Réponse partielle" }],
    })
    for (let attempt = 0; attempt < 2; attempt++) {
      const response = await handleAiGet(
        new Request("https://studio.test/api/ai/events?mockupId=m")
      )
      const reader = response.body!.getReader()
      expect(new TextDecoder().decode((await reader.read()).value)).toContain(
        "Réponse partielle"
      )
      await reader.cancel()
    }
    expect(mocks.enqueue).not.toHaveBeenCalled()
  })
  it("refuse les accès directs sans session, y compris SSE", async () => {
    mocks.user.mockRejectedValue(
      new Response("Connexion requise", { status: 401 })
    )
    for (const path of [
      "connection",
      "state?mockupId=m",
      "events?mockupId=m",
    ]) {
      const response = await handleAiGet(
        new Request(`https://studio.test/api/ai/${path}`)
      )
      expect(response.status).toBe(401)
    }
    expect(mocks.snapshot).not.toHaveBeenCalled()
  })
  it("bloque les POST provenant d’une autre origine", async () => {
    const response = await handleAiPost(
      new Request("https://studio.test/api/ai/action", {
        method: "POST",
        headers: {
          origin: "https://evil.test",
          "content-type": "application/json",
        },
        body: JSON.stringify({ action: "disconnect" }),
      })
    )
    expect(response.status).toBe(403)
    expect(mocks.user).not.toHaveBeenCalled()
  })
  it("utilise le compte de session pour l’arrêt, jamais un identifiant fourni", async () => {
    const headers = {
      origin: "https://studio.test",
      "content-type": "application/json",
    }
    const response = await handleAiPost(
      new Request("https://studio.test/api/ai/action", {
        method: "POST",
        headers,
        body: JSON.stringify({ action: "stop", runId: "run" }),
      })
    )
    expect(response.status).toBe(200)
    expect(mocks.stop).toHaveBeenCalledWith("alice", "run")
    const injected = await handleAiPost(
      new Request("https://studio.test/api/ai/action", {
        method: "POST",
        headers,
        body: JSON.stringify({ action: "stop", runId: "run", userId: "bob" }),
      })
    )
    expect(injected.status).toBe(400)
  })
})
