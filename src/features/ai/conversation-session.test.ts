import { describe, expect, it, vi } from "vitest"
import { createConversationSession } from "./conversation-session"
import type { AiAction } from "@/validators/ai/actions"

describe("session de conversation", () => {
  it("réutilise conversation et requestId après un accusé perdu", async () => {
    const requests: Array<{ path: string; body: unknown }> = []
    let sends = 0
    const request = async <TResult>(path: string, body?: AiAction) => {
      requests.push({ path, body })
      if (body?.action === "conversation")
        return { id: "conversation-1" } as TResult
      if (body?.action === "send") {
        sends += 1
        if (sends === 1) throw new Error("ack perdu")
        return { id: "run-1" } as TResult
      }
      return {} as TResult
    }
    const session = createConversationSession({
      targetId: "mockup-1",
      startRemoteSession: false,
      request,
    })
    const input = {
      model: "openai:test",
      prompt: "Bonjour",
      docHash: "a".repeat(64),
      selectedIds: [],
    }

    await expect(session.send(input, vi.fn())).rejects.toThrow("ack perdu")
    await session.send(
      input,
      vi.fn(async () => undefined)
    )

    const admissions = requests
      .map((entry) => entry.body as { action?: string; requestId?: string })
      .filter((body) => body.action === "send")
    expect(admissions).toHaveLength(2)
    expect(admissions[0].requestId).toBe(admissions[1].requestId)
    expect(
      requests.filter(
        (entry) => (entry.body as { action?: string }).action === "conversation"
      )
    ).toHaveLength(1)
  })
})
