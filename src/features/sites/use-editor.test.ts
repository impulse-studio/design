import { act, renderHook, cleanup } from "@testing-library/react"
import { afterEach, beforeEach, expect, it, vi } from "vitest"
import { useSiteEditor } from "./use-editor"
import { createSiteDocument } from "./template"
import { compileSite } from "./compile"

const { getSite, getSiteHistory, getSiteVersion, changeSite } = vi.hoisted(
  () => ({
    getSite: vi.fn(),
    getSiteHistory: vi.fn(),
    getSiteVersion: vi.fn(),
    changeSite: vi.fn(),
  })
)
const { queryClient } = vi.hoisted(() => ({
  queryClient: {
    fetchQuery: (options: { queryFn: () => unknown }) => options.queryFn(),
    invalidateQueries: vi.fn().mockResolvedValue(undefined),
  },
}))
vi.mock("@/lib/use-orpc", () => {
  const query = (name: string, fn: (input: never) => unknown) => ({
    queryKey: () => ["sites", name],
    queryOptions: ({ input }: { input: never }) => ({
      queryFn: () => fn(input),
    }),
  })
  const orpc = {
    sites: {
      get: query("get", getSite),
      getHistory: query("getHistory", getSiteHistory),
      getVersion: query("getVersion", getSiteVersion),
      change: { mutationOptions: () => ({ mutationFn: changeSite }) },
    },
    mockups: { list: { queryKey: () => ["mockups", "list"] } },
  }
  return { useOrpc: () => orpc }
})
vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => queryClient,
  useMutation: (options: { mutationFn: (input: unknown) => unknown }) => ({
    mutateAsync: options.mutationFn,
  }),
}))
vi.mock("./compile", () => ({ compileSite: vi.fn() }))
const initial = { id: "site", doc: createSiteDocument(), revision: 0 }
beforeEach(() => {
  vi.resetAllMocks()
  vi.useFakeTimers()
  getSiteHistory.mockResolvedValue([])
})
afterEach(() => {
  cleanup()
  vi.useRealTimers()
})
it("loads external revisions and refreshes history automatically", async () => {
  const next = { ...initial, revision: 1 }
  getSite.mockResolvedValue({ project: next, record: {} as never })
  const { result } = renderHook(() => useSiteEditor(initial, true))
  await act(() => vi.advanceTimersByTimeAsync(1000))
  expect(result.current.record).toEqual(next)
  expect(getSiteHistory).toHaveBeenCalledTimes(2)
})
it("refreshes when the site editor becomes visible again", async () => {
  const next = { ...initial, revision: 1 }
  getSite.mockResolvedValue({ project: next, record: {} as never })
  const { result } = renderHook(() => useSiteEditor(initial, true))
  await act(async () => {
    document.dispatchEvent(new Event("visibilitychange"))
  })
  expect(result.current.record.revision).toBe(1)
})
it("ignores a poll started before a local save", async () => {
  let resolvePoll!: (value: { project: typeof initial; record: never }) => void
  getSite.mockImplementation(
    () => new Promise((resolve) => (resolvePoll = resolve))
  )
  vi.mocked(compileSite).mockResolvedValue("")
  const local = { ...initial, revision: 2 }
  changeSite.mockResolvedValue(local)
  const { result } = renderHook(() => useSiteEditor(initial, true))
  await act(() => vi.advanceTimersByTimeAsync(1000))
  await act(() =>
    result.current.apply({
      id: "proposal",
      baseRevision: 0,
      status: "pending",
      input: {
        summary: "Local",
        operations: [
          {
            type: "writeFile",
            path: "src/components/Local.tsx",
            content: "export function Local(){return <p>Local</p>}",
          },
        ],
      },
    })
  )
  await act(async () => {
    resolvePoll({ project: { ...initial, revision: 1 }, record: {} as never })
  })
  expect(result.current.record.revision).toBe(2)
})
