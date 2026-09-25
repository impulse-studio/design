import { describe, expect, it } from "vitest"
import { projectGenerationConversation } from "./projection"

describe("projection de conversation", () => {
  it("présente une erreur réelle sans vocabulaire de démonstration", () => {
    const messages = projectGenerationConversation([
      {
        id: "run-1",
        prompt: "Crée une page",
        answer: "Réponse partielle",
        status: "failed",
      },
    ])

    expect(messages[1]).toMatchObject({
      status: "error",
      errorTitle: "La génération a échoué",
    })
    expect(messages[1].errorTitle).not.toMatch(/simul/i)
  })

  it("distingue attente, flux partiel et interruption volontaire", () => {
    const messages = projectGenerationConversation([
      { id: "queued", prompt: "A", answer: "", status: "queued" },
      { id: "running", prompt: "B", answer: "Partiel", status: "running" },
      {
        id: "stopped",
        prompt: "C",
        answer: "Conservé",
        status: "interrupted",
      },
    ])

    expect(
      messages
        .filter((message) => message.role === "assistant")
        .map((message) => message.status)
    ).toEqual(["waiting", "streaming", "stopped"])
  })
})
