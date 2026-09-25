import { afterEach, describe, expect, it, vi } from "vitest"
import { createSaveQueue } from "./save-queue"
import { emptyDocument } from "@/features/editor/document"
import type { SaveResult } from "./types"

const snapshot = (name: string) => ({
  name,
  status: "draft" as const,
  doc: emptyDocument(),
})
afterEach(() => vi.useRealTimers())
describe("serialized autosave", () => {
  it("debounces and serializes requests, retaining a newer draft during a slow save", async () => {
    vi.useFakeTimers()
    let finish!: (value: SaveResult) => void
    const save = vi
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise<SaveResult>((resolve) => {
            finish = resolve
          })
      )
      .mockResolvedValue({ status: "saved", revision: 6, updatedAt: "" })
    const onStatus = vi.fn(),
      writeDraft = vi.fn()
    const queue = createSaveQueue({
      id: "id",
      revision: 4,
      save,
      onStatus,
      writeDraft,
    })
    queue.update(snapshot("first"))
    await vi.advanceTimersByTimeAsync(1000)
    expect(save).not.toHaveBeenCalled()
    queue.update(snapshot("second"))
    await vi.advanceTimersByTimeAsync(1500)
    expect(save).toHaveBeenCalledTimes(1)
    queue.update(snapshot("third"))
    await vi.advanceTimersByTimeAsync(2000)
    expect(save).toHaveBeenCalledTimes(1)
    finish({ status: "saved", revision: 5, updatedAt: "" })
    await vi.advanceTimersByTimeAsync(1)
    expect(writeDraft).toHaveBeenLastCalledWith(
      expect.objectContaining({ name: "third", baseRevision: 5 })
    )
    await vi.advanceTimersByTimeAsync(1500)
    expect(save).toHaveBeenLastCalledWith(
      expect.objectContaining({ name: "third", expectedRevision: 5 })
    )
    expect(writeDraft).toHaveBeenLastCalledWith(null)
    expect(onStatus).toHaveBeenLastCalledWith("saved")
    queue.dispose()
  })
  it("keeps editable data and retries after disconnection", async () => {
    const save = vi
      .fn()
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValue({ status: "saved", revision: 1, updatedAt: "" })
    const writeDraft = vi.fn(),
      onStatus = vi.fn(),
      queue = createSaveQueue({
        id: "id",
        revision: 0,
        save,
        writeDraft,
        onStatus,
      })
    queue.update(snapshot("offline"))
    await queue.flush()
    expect(onStatus).toHaveBeenLastCalledWith("error")
    expect(queue.pending).toBe(true)
    await queue.flush()
    expect(onStatus).toHaveBeenLastCalledWith("saved")
    expect(queue.pending).toBe(false)
    queue.dispose()
  })
  it("never overwrites a conflict and keeps the newest recovery draft", async () => {
    vi.useFakeTimers()
    const save = vi.fn().mockResolvedValue({ status: "conflict", revision: 8 }),
      onStatus = vi.fn(),
      writeDraft = vi.fn()
    const queue = createSaveQueue({
      id: "id",
      revision: 2,
      save,
      onStatus,
      writeDraft,
    })
    queue.update(snapshot("conflict"))
    await queue.flush()
    queue.update(snapshot("keep editing"))
    await queue.flush()
    await vi.advanceTimersByTimeAsync(5000)
    expect(save).toHaveBeenCalledTimes(1)
    expect(onStatus).toHaveBeenLastCalledWith("conflict")
    expect(writeDraft).toHaveBeenLastCalledWith(
      expect.objectContaining({ name: "keep editing", baseRevision: 2 })
    )
    queue.dispose()
  })
})
