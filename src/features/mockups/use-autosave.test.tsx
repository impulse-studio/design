import { saveMockupSchema } from "@/validators/mockups"
import { StrictMode } from "react"
import { act, render, screen } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createTanstackQueryUtils } from "@orpc/tanstack-query"
import { afterEach, expect, it, vi } from "vitest"
import { EditorProvider } from "@/pages/editor/components/shell/EditorProvider"
import { InspectorPanel } from "@/pages/editor/components/inspector/InspectorPanel"
import { createEditor } from "@/features/editor/store"
import { emptyDocument, framesOf } from "@/features/editor/document"
import type { Editor } from "@/features/editor/store"
import type { MockupRecord, SaveInput, SaveResult } from "./types"
import { draftKey } from "./save-queue"
import { useAutosave } from "./use-autosave"

const mocks = vi.hoisted(() => ({ useOrpc: vi.fn() }))
vi.mock("@/server/use-orpc", () => ({ useOrpc: mocks.useOrpc }))

const Harness = ({
  editor,
  initial,
}: {
  editor: Editor
  initial: MockupRecord
}) => {
  const autosave = useAutosave(editor, initial)
  return (
    <EditorProvider editor={editor}>
      <output aria-label="Brouillon">
        {autosave.recovery?.name ?? "Aucun"}
      </output>
      <output aria-label="Sauvegarde">{autosave.status}</output>
      <InspectorPanel fit={() => {}} zoomTo={() => {}} />
    </EditorProvider>
  )
}
const setup = () => {
  const initial: MockupRecord = {
    id: "mockup",
    name: "Enregistrée",
    status: "draft",
    doc: emptyDocument(),
    revision: 1,
    updatedAt: "",
    notionUrl: null,
    githubUrl: null,
  }
  const editor = createEditor(initial)
  editor.select(framesOf(initial.doc)[0].id)
  const save = vi.fn((_input: SaveInput): Promise<SaveResult> =>
    Promise.resolve({ status: "saved", revision: 2, updatedAt: "" })
  )
  // Use the real ORPC utility proxy: nested access intentionally returns a fresh object.
  const orpc = createTanstackQueryUtils({
    mockups: { save, list: async () => [] },
  })
  mocks.useOrpc.mockReturnValue(orpc)
  expect(orpc.mockups.list).not.toBe(orpc.mockups.list)
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  const ui = (
    <StrictMode>
      <QueryClientProvider client={client}>
        <Harness editor={editor} initial={initial} />
      </QueryClientProvider>
    </StrictMode>
  )
  return { initial, editor, save, ui }
}
afterEach(() => {
  localStorage.clear()
  vi.useRealTimers()
})

it("reads a recovery draft only on initialization, keeping the full inspector stable", () => {
  const { initial, editor, save, ui } = setup()
  localStorage.setItem(
    draftKey(initial.id),
    JSON.stringify({
      ...initial,
      name: "Brouillon local",
      baseRevision: 1,
      savedAt: Date.now(),
    })
  )
  const getItem = Storage.prototype.getItem
  let reads = 0
  const read = vi
    .spyOn(Storage.prototype, "getItem")
    .mockImplementation((key) => {
      // Bound a regressed effect loop so the test fails instead of hanging the test worker.
      if (key === draftKey(initial.id) && ++reads > 12)
        throw new Error("Repeated draft initialization")
      return getItem.call(localStorage, key)
    })
  const errors = vi.spyOn(console, "error")
  const view = render(ui)
  expect(screen.getByLabelText("Brouillon").textContent).toBe("Brouillon local")
  view.rerender(ui)
  for (let step = 0; step < 30; step++) {
    act(() =>
      editor.setViewport({ x: step * 10, y: -step * 5, zoom: 1 + step / 100 })
    )
  }
  expect(save).not.toHaveBeenCalled()
  expect(
    read.mock.calls.filter(([key]) => key === draftKey(initial.id)).length
  ).toBeLessThanOrEqual(2)
  expect(errors.mock.calls.flat().join(" ")).not.toMatch(
    /maximum update|suspend/i
  )
})

it("preserves the save queue across rerenders and saves only the final transaction", async () => {
  vi.useFakeTimers()
  const { initial, editor, save, ui } = setup()
  const view = render(ui)
  const id = framesOf(initial.doc)[0].id
  act(() => {
    editor.begin()
    editor.updateNodes([id], (node) => {
      if (node.type === "frame") node.x = 200
    })
  })
  await act(() => vi.advanceTimersByTimeAsync(2000))
  expect(save).not.toHaveBeenCalled()
  act(() => editor.commit())
  view.rerender(ui)
  await act(() => vi.advanceTimersByTimeAsync(1600))
  expect(save).toHaveBeenCalledTimes(1)
  expect(
    saveMockupSchema.parse(save.mock.calls[0][0]).doc.pages[0].frames[0].x
  ).toBe(200)
})

it.each(["saved", "error", "conflict"] as const)(
  "keeps a newer drop visible when an older save ends with %s",
  async (outcome) => {
    vi.useFakeTimers()
    const { initial, editor, save, ui } = setup()
    let resolve!: (result: SaveResult) => void
    let reject!: (reason: Error) => void
    save.mockImplementationOnce(
      () =>
        new Promise<SaveResult>((yes, no) => {
          resolve = yes
          reject = no
        })
    )
    render(ui)
    const id = framesOf(initial.doc)[0].id
    const drop = (x: number) =>
      act(() => {
        editor.begin()
        editor.updateNodes([id], (node) => {
          if (node.type === "frame") node.x = x
        })
        editor.commit()
      })
    drop(200)
    expect(editor.state.get().doc.pages[0].frames[0].x).toBe(200)
    await act(() => vi.advanceTimersByTimeAsync(1500))
    expect(save).toHaveBeenCalledTimes(1)
    drop(450)
    const latest = editor.state.get().doc
    await act(async () => {
      if (outcome === "error") reject(new Error("offline"))
      else
        resolve(
          outcome === "saved"
            ? { status: "saved", revision: 2, updatedAt: "" }
            : { status: "conflict", revision: 3 }
        )
      await vi.advanceTimersByTimeAsync(0)
    })
    expect(editor.state.get().doc).toBe(latest)
    expect(editor.state.get().doc.pages[0].frames[0].x).toBe(450)
    expect(
      JSON.parse(localStorage.getItem(draftKey(initial.id))!).doc.pages[0]
        .frames[0].x
    ).toBe(450)
    expect(screen.getByLabelText("Sauvegarde").textContent).toBe(
      outcome === "saved" ? "dirty" : outcome
    )
  }
)
