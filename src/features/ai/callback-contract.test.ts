import { describe, expect, it } from "vitest"
import {
  callbackRequestSchema,
  callbackResponseSchemas,
} from "@/validators/ai/callback"

describe("contrat callback Studio-worker", () => {
  it("refuse les champs d'une autre action", () => {
    expect(() =>
      callbackRequestSchema.parse({
        chatId: crypto.randomUUID(),
        eventId: crypto.randomUUID(),
        action: "heartbeat",
        runId: crypto.randomUUID(),
        triggerRunId: "worker-1",
        answer: "partiel",
        status: "completed",
      })
    ).toThrow()
  })

  it("valide les réponses selon l'action", () => {
    expect(callbackResponseSchemas.begin.parse({ waiting: true })).toEqual({
      waiting: true,
    })
    expect(() =>
      callbackResponseSchemas.begin.parse({ waiting: true, interrupted: true })
    ).toThrow()
    expect(() => callbackResponseSchemas.save.parse({})).toThrow()
  })
})
