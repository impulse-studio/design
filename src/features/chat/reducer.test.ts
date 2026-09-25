import { describe, expect, it } from "vitest"
import { chatReducer, initialChatState } from "./reducer"
import type { ChatAction } from "./reducer"
import type { ChatState } from "./types"
import { restoreChat, serializeChat } from "./storage"
import { validateChatFile, MAX_CHAT_FILE_SIZE } from "./attachments"

const ready = (): ChatState => ({
  ...initialChatState(),
  ready: true,
  demo: true,
})
const reduce = (state: ChatState, ...actions: ChatAction[]) =>
  actions.reduce(chatReducer, state)
const start = (
  scenario: "create" | "selection" | "illustration" | "error" = "create"
) =>
  chatReducer(ready(), {
    type: "send",
    id: "turn-1",
    text: "Créer une page",
    context: [{ id: "layer", label: "Participants" }],
    scenario,
  })
const tick = (state: ChatState) =>
  state.run
    ? chatReducer(state, {
        type: "tick",
        id: state.run.id,
        phase: state.run.phase,
        step: state.run.step,
      })
    : state
const answer = (state: ChatState) =>
  reduce(
    state,
    {
      type: "answers",
      id: "turn-1",
      current: "notes",
      answers: {
        layout: { selected: ["cards"], custom: "" },
        features: { selected: ["search", "filters"], custom: "" },
        notes: { selected: [], custom: "Privilégier la lisibilité" },
      },
    },
    { type: "submit-answers", id: "turn-1" }
  )
const finish = (state: ChatState) => {
  let next = state
  for (let i = 0; i < 150 && next.run; i++) next = tick(next)
  return next
}

describe("session de démonstration", () => {
  it("parcourt les questions, le plan, l’outil, les tâches et la réponse", () => {
    let state = start()
    expect(state.messages[0].request).toMatchObject({
      model: "demo-opus",
      effort: "medium",
      context: [{ id: "layer", label: "Participants" }],
    })
    state = tick(state)
    expect(state.run?.phase).toBe("questions")
    expect(chatReducer(state, { type: "submit-answers", id: "turn-1" })).toBe(
      state
    )
    state = answer(state)
    expect(state.run?.phase).toBe("approval")
    expect(state.run?.answerSummary).toContain("Des cartes visuelles")
    state = reduce(
      state,
      { type: "approve", id: "turn-1" },
      { type: "tool", id: "turn-1", approved: true }
    )
    expect(state.run?.phase).toBe("working")
    state = finish(state)
    expect(state.run).toBeNull()
    expect(state.messages.at(-1)?.status).toBe("complete")
    expect(state.messages.at(-1)?.text).toContain("Recherche, Filtres")
    expect(state.messages.at(-1)?.text).toContain("Privilégier la lisibilité")
    expect(state.messages.at(-1)?.blocks).toContainEqual(
      expect.objectContaining({ type: "diff" })
    )
  })

  it("empêche les doubles envois et les validations provenant d’un ancien tour", () => {
    const state = start()
    expect(
      chatReducer(state, {
        type: "send",
        id: "duplicate",
        text: "Autre",
        context: [],
      })
    ).toBe(state)
    expect(chatReducer(state, { type: "approve", id: "old" })).toBe(state)
    expect(chatReducer(state, { type: "model", value: "demo-gpt" })).toBe(state)
  })

  it("réagit au refus et permet de demander une nouvelle proposition", () => {
    const waiting = answer(tick(start()))
    const refused = chatReducer(waiting, { type: "reject", id: "turn-1" })
    expect(refused.run).toBeNull()
    expect(refused.messages.at(-1)?.text).toContain("refusée")
    const changes = chatReducer(waiting, { type: "changes", id: "turn-1" })
    expect(changes.run).toBeNull()
    expect(changes.drafts.demo.text).toContain("Revoir la proposition")
    const tool = chatReducer(waiting, { type: "approve", id: "turn-1" })
    expect(
      chatReducer(tool, { type: "tool", id: "turn-1", approved: false }).run
    ).toBeNull()
  })

  it("garde le texte partiel après un arrêt et ignore les ticks tardifs", () => {
    let state = reduce(
      answer(tick(start())),
      { type: "approve", id: "turn-1" },
      { type: "tool", id: "turn-1", approved: true }
    )
    state = tick(tick(tick(tick(state))))
    const stopped = chatReducer(state, { type: "stop" })
    expect(stopped.messages.at(-1)?.text.length).toBeGreaterThan(0)
    expect(stopped.messages.at(-1)?.text).toBe(state.messages.at(-1)?.text)
    expect(stopped.messages.at(-1)?.status).toBe("stopped")
    expect(
      chatReducer(stopped, {
        type: "tick",
        id: "turn-1",
        phase: "streaming",
        step: 1,
      })
    ).toBe(stopped)
  })

  it("relance une erreur et produit des images avec sources dans le scénario illustré", () => {
    const failed = tick(start("error"))
    expect(failed.messages.at(-1)?.status).toBe("error")
    const retry = chatReducer(failed, {
      type: "retry",
      id: "turn-1",
      newId: "turn-2",
    })
    expect(tick(retry).run?.phase).toBe("questions")
    expect(retry.messages.at(-1)?.attempt).toBe(1)
    const illustrated = finish(
      reduce(
        tick(start("illustration")),
        { type: "approve", id: "turn-1" },
        { type: "tool", id: "turn-1", approved: true }
      )
    )
    expect(illustrated.messages.at(-1)?.blocks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: "image", status: "complete" }),
        expect.objectContaining({ type: "sources" }),
      ])
    )
  })

  it("isole le brouillon normal, les préférences et la démo", () => {
    const normal = reduce(
      { ...initialChatState(), ready: true },
      { type: "draft", text: "Mon vrai brouillon" },
      { type: "model", value: "demo-gemini-pro" },
      { type: "effort", value: "high" }
    )
    expect(
      chatReducer(normal, {
        type: "send",
        id: "blocked",
        text: "Non",
        context: [],
      })
    ).toBe(normal)
    const demo = reduce(
      normal,
      { type: "mode", demo: true },
      { type: "draft", text: "Démo" },
      { type: "send", id: "turn", text: "Démo", context: [] }
    )
    const disconnected = chatReducer(demo, { type: "mode", demo: false })
    expect(disconnected.drafts.disconnected.text).toBe("Mon vrai brouillon")
    expect(disconnected.messages.at(-1)?.status).toBe("stopped")
    expect(disconnected.model).toBe("demo-gemini-pro")
    expect(disconnected.effort).toBe("high")
    expect(
      chatReducer(disconnected, { type: "reset" }).drafts.disconnected.text
    ).toBe("Mon vrai brouillon")
  })

  it("exige un contexte pour la sélection et ne réutilise pas les exclusions après l’envoi", () => {
    expect(
      chatReducer(ready(), {
        type: "send",
        id: "x",
        text: "Modifier",
        context: [],
        scenario: "selection",
      }).notice
    ).toContain("Sélectionnez")
    const state = chatReducer(
      { ...ready(), ignoredContext: ["a"] },
      {
        type: "send",
        id: "x",
        text: "Modifier",
        context: [{ id: "b", label: "B" }],
      }
    )
    expect(state.messages[0].request?.context).toEqual([
      { id: "b", label: "B" },
    ])
    expect(state.ignoredContext).toEqual([])
  })
})

describe("stockage et fichiers locaux", () => {
  it("restaure un tour interrompu, sans objet URL ni connexion implicite", () => {
    const attachment = {
      id: "file",
      name: "image.png",
      size: 100,
      type: "image/png",
      blobUrl: "blob:private",
    }
    const state = chatReducer(
      {
        ...ready(),
        drafts: {
          ...ready().drafts,
          demo: { text: "", attachments: [attachment] },
        },
      },
      { type: "send", id: "x", text: "Image", context: [] }
    )
    const saved = serializeChat(state)
    expect(saved).not.toContain("blob:private")
    const restored = restoreChat(saved)
    expect(restored.demo).toBe(false)
    expect(restored.run).toBeNull()
    expect(restored.messages.at(-1)?.status).toBe("stopped")
    expect(restored.messages[0].request?.attachments[0].blobUrl).toBeUndefined()
    expect(restoreChat(null, "ancien brouillon").drafts.disconnected.text).toBe(
      "ancien brouillon"
    )
    expect(restoreChat("broken").notice).toBeTruthy()
    expect(restoreChat('{"version":1}').messages).toEqual([])
  })

  it("contrôle les extensions, MIME et la limite de 10 Mo", () => {
    expect(
      validateChatFile(new File(["x"], "brief.md", { type: "text/plain" }))
    ).toBeNull()
    expect(
      validateChatFile(new File(["x"], "capture.png", { type: "text/html" }))
    ).toContain("format")
    expect(
      validateChatFile(new File(["x"], "vector.svg", { type: "image/svg+xml" }))
    ).toContain("format")
    const huge = new File(["x"], "doc.pdf", { type: "application/pdf" })
    Object.defineProperty(huge, "size", { value: MAX_CHAT_FILE_SIZE + 1 })
    expect(validateChatFile(huge)).toContain("10 Mo")
  })
})
