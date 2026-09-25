import { act, cleanup, renderHook, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, expect, it, vi } from "vitest"
import { createSiteDocument } from "./document.fixture"
import {
  disposeSiteRuntime,
  startSiteRuntime,
  syncSiteRuntime,
} from "./runtime"
import { useSitePreviewSession } from "./use-preview-session"
import type { SiteRecord } from "@/features/sites/types"

vi.mock("./runtime", () => ({
  startSiteRuntime: vi.fn(),
  syncSiteRuntime: vi.fn(),
  disposeSiteRuntime: vi.fn(),
}))

const callbacks = {
  onSelect: vi.fn(),
  onInventory: vi.fn(),
  onRoute: vi.fn(),
  onError: vi.fn(),
  onStatus: vi.fn(),
}
const record = (revision: number): SiteRecord => ({
  id: "site",
  revision,
  doc: createSiteDocument(),
})

beforeEach(() => {
  vi.resetAllMocks()
  vi.mocked(startSiteRuntime).mockResolvedValue("https://preview.test/")
  vi.mocked(syncSiteRuntime).mockResolvedValue("https://preview.test/")
  vi.mocked(disposeSiteRuntime).mockResolvedValue(undefined)
})

afterEach(cleanup)

it("starts, synchronizes, and disposes one preview runtime", async () => {
  const options = {
    record: record(0),
    sourceElements: [],
    editing: false,
    path: "/",
    selection: null,
    command: null,
    ...callbacks,
  }
  const hook = renderHook(
    (props: typeof options) => useSitePreviewSession(props),
    {
      initialProps: options,
    }
  )

  await waitFor(() =>
    expect(hook.result.current.url).toBe("https://preview.test/")
  )
  const next = record(1)
  hook.rerender({ ...options, record: next })
  await waitFor(() =>
    expect(syncSiteRuntime).toHaveBeenCalledWith(
      next.doc,
      expect.objectContaining({ revision: 1 })
    )
  )
  act(() => {
    vi.mocked(startSiteRuntime).mock.calls[0][2]({
      stage: "error",
      message: "Vite stopped",
    })
  })
  expect(hook.result.current.status).toEqual({
    stage: "error",
    message: "Vite stopped",
  })

  hook.unmount()
  expect(disposeSiteRuntime).toHaveBeenCalledTimes(1)
})

it("delivers a navigation command queued before the bridge is ready once", async () => {
  const options = {
    record: record(0),
    sourceElements: [],
    editing: false,
    path: "/contacts",
    selection: null,
    command: { type: "back" as const, sequence: 1 },
    ...callbacks,
  }
  const hook = renderHook(() => useSitePreviewSession(options))
  await waitFor(() => expect(startSiteRuntime).toHaveBeenCalledTimes(1))

  const frame = document.createElement("iframe")
  document.body.append(frame)
  act(() => {
    hook.result.current.iframe.current = frame
  })
  const postMessage = vi.spyOn(frame.contentWindow!, "postMessage")
  const preview = vi.mocked(startSiteRuntime).mock.calls[0][1]!

  await waitFor(() =>
    expect(hook.result.current.url).toBe("https://preview.test/")
  )
  act(() => {
    window.dispatchEvent(
      new MessageEvent("message", {
        source: frame.contentWindow,
        origin: "https://preview.test",
        data: {
          source: "digit-site",
          token: preview.token,
          revision: 0,
          type: "ready",
        },
      })
    )
  })

  const messages = postMessage.mock.calls.map(([message]) => message)
  expect(messages.filter((message) => message.type === "back")).toHaveLength(1)
  expect(messages).toContainEqual(
    expect.objectContaining({
      type: "navigate",
      path: "/contacts",
    })
  )
  frame.remove()
})
