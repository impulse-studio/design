import { act, renderHook, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createEditor } from "@/features/editor/store"
import type { Editor } from "@/features/editor/store"
import { emptyDocument } from "@/features/editor/document"
import { useAiChat } from "./use-ai-chat"
import type { AiProposal, AiSnapshot, AiConfiguration } from "./types"

const mocks = vi.hoisted(() => ({ request: vi.fn(), save: vi.fn() }))
let editor: Editor
vi.mock("@/features/editor/context", () => ({ useEditor: () => editor }))
vi.mock("@/features/mockups/persistence-context", () => ({
  useEditorPersistence: () => ({ waitForSave: mocks.save }),
}))
vi.mock("./client", () => ({
  aiRequest: mocks.request,
  hashDocument: async () => "document-hash",
}))

vi.mock("@trigger.dev/sdk/chat/react", () => ({
  useTriggerChatTransport: () => ({
    getSession: () => undefined,
    setSession: vi.fn(),
    sendMessages: async () =>
      new ReadableStream({
        start(controller) {
          controller.close()
        },
      }),
  }),
}))
class TestEventSource extends EventTarget {
  static instances: TestEventSource[] = []
  onerror: (() => void) | null = null
  constructor() {
    super()
    TestEventSource.instances.push(this)
  }
  close() {}
}
const snapshot: AiSnapshot = {
  sessionStarted: false,
  uiMessages: [],
  usage: [],
  conversations: [],
  conversationId: "conversation",
  messages: [],
  proposals: [],
  run: null,
}
const connection: AiConfiguration = {
  available: true,
  error: null,
  models: [
    {
      provider: "openai",
      id: "available",
      model: "available",
      displayName: "Disponible",
      isDefault: true,
    },
  ],
}
const proposal: AiProposal = {
  id: "proposal",
  runId: "run",
  summary: "Modifier la frame",
  operations: [],
  baseRevision: 1,
  baseHash: "base",
  resultHash: "result",
  status: "pending",
}
beforeEach(() => {
  editor = createEditor({ doc: emptyDocument(), name: "Test", status: "draft" })
  mocks.save.mockReset().mockResolvedValue(undefined)
  mocks.request
    .mockReset()
    .mockImplementation(async (path: string) =>
      path === "configuration" ? connection : snapshot
    )
  TestEventSource.instances = []
  vi.stubGlobal("EventSource", TestEventSource)
})
afterEach(() => vi.unstubAllGlobals())

describe("chat API dans l’éditeur", () => {
  it("réutilise l’identifiant après une réponse réseau perdue et ne renvoie rien en reconnectant le flux", async () => {
    const { result } = renderHook(() => useAiChat("mockup"))
    await waitFor(() => expect(result.current.model).toBe("available"))
    const sent: string[] = []
    mocks.request.mockImplementation(
      async (path: string, body?: { action: string; requestId: string }) => {
        if (body?.action === "send") {
          sent.push(body.requestId)
          if (sent.length === 1) throw new Error("Réseau coupé")
          return { id: "run" }
        }
        return path === "configuration" ? connection : snapshot
      }
    )
    await act(() => result.current.send("Créer un bouton"))
    expect(result.current.error).toBe("Réseau coupé")
    await act(() => result.current.send("Créer un bouton"))
    expect(sent).toHaveLength(2)
    expect(sent[1]).toBe(sent[0])
    act(() => TestEventSource.instances.at(-1)?.onerror?.())
    expect(result.current.reconnecting).toBe(true)
    expect(sent).toHaveLength(2)
  })
  it("une lecture initiale lente ne remplace pas un instantané SSE plus récent", async () => {
    let resolveState: (value: AiSnapshot) => void = () => {}
    mocks.request.mockImplementation((path: string) =>
      path === "configuration"
        ? Promise.resolve(connection)
        : new Promise<AiSnapshot>((resolve) => {
            resolveState = resolve
          })
    )
    const { result } = renderHook(() => useAiChat("mockup"))
    const latest = {
      ...snapshot,
      messages: [
        { id: "answer", role: "assistant" as const, text: "Réponse conservée" },
      ],
    }
    act(() =>
      TestEventSource.instances
        .at(-1)
        ?.dispatchEvent(
          new MessageEvent("snapshot", { data: JSON.stringify(latest) })
        )
    )
    await act(async () => resolveState(snapshot))
    expect(result.current.snapshot.messages).toEqual(latest.messages)
  })
  it("attend la sauvegarde avant de confirmer et conserve une seule étape annulable", async () => {
    const before = editor.state.get().doc,
      next = structuredClone(before)
    next.pages[0].frames[0].width = 1200
    const { result } = renderHook(() => useAiChat("mockup"))
    await waitFor(() => expect(result.current.connection).toEqual(connection))
    let releaseSave: () => void = () => {}
    mocks.save.mockResolvedValueOnce(undefined).mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          releaseSave = resolve
        })
    )
    mocks.request.mockImplementation(
      async (path: string, body?: { action: string }) =>
        body?.action === "prepare"
          ? { doc: next, baseHash: "base" }
          : path === "configuration"
            ? connection
            : snapshot
    )
    let applying: Promise<void>
    act(() => {
      applying = result.current.apply(proposal)
    })
    await waitFor(() => expect(editor.state.get().doc).toEqual(next))
    expect(
      mocks.request.mock.calls.some(([, body]) => body?.action === "decide")
    ).toBe(false)
    await act(async () => {
      releaseSave()
      await applying
    })
    expect(mocks.request).toHaveBeenCalledWith("action", {
      action: "decide",
      proposalId: "proposal",
      decision: "applied",
    })
    expect(editor.state.get().past).toHaveLength(1)
    editor.undo()
    expect(editor.state.get().doc).toEqual(before)
  })
  it("préserve les modifications faites pendant la préparation d’une proposition", async () => {
    const next = structuredClone(editor.state.get().doc)
    next.pages[0].frames[0].width = 1200
    const { result } = renderHook(() => useAiChat("mockup"))
    await waitFor(() => expect(result.current.connection).toEqual(connection))
    mocks.request.mockImplementation(
      async (_path: string, body?: { action: string }) => {
        if (body?.action === "prepare") {
          const manual = structuredClone(editor.state.get().doc)
          manual.pages[0].frames[0].name = "Modification manuelle"
          editor.replace(manual)
          return { doc: next, baseHash: "base" }
        }
        return snapshot
      }
    )
    await act(() => result.current.apply(proposal))
    expect(result.current.error).toMatch(/a changé/)
    expect(editor.state.get().doc.pages[0].frames[0].name).toBe(
      "Modification manuelle"
    )
    expect(editor.state.get().past).toHaveLength(1)
    expect(
      mocks.request.mock.calls.some(([, body]) => body?.action === "decide")
    ).toBe(false)
  })
})
