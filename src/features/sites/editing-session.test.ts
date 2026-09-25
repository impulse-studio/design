import { describe, expect, it } from "vitest"
import { createSiteDocument } from "./document.fixture"
import { createSiteEditingSession } from "./editing-session"
import type { SiteRecord } from "@/features/sites/types"

const record = (revision: number): SiteRecord => ({
  id: "site",
  revision,
  doc: createSiteDocument(),
})

describe("site editing session", () => {
  it("rejects remote reads that started before a local write", () => {
    const session = createSiteEditingSession(record(0))
    const staleRead = session.readToken()

    session.beginWrite(true)
    session.completeWrite(record(2), "revision-0")

    expect(session.adoptRemote(staleRead, record(1))).toBe(false)
    expect(session.record.revision).toBe(2)
  })

  it("preserves undo and redo stacks across historical writes", () => {
    const session = createSiteEditingSession(record(0))

    session.beginWrite(true)
    session.completeWrite(record(1), "revision-0")
    expect(session.historyTarget("undo")).toBe("revision-0")

    session.beginWrite(true)
    session.completeHistoricalWrite(record(2))
    session.completeRestore(record(2), "undo", "revision-1")
    expect(session.historyTarget("undo")).toBeUndefined()
    expect(session.historyTarget("redo")).toBe("revision-1")

    session.beginWrite(true)
    session.completeHistoricalWrite(record(3))
    session.completeRestore(record(3), "redo", "revision-2")
    expect(session.historyTarget("undo")).toBe("revision-2")
    expect(session.historyTarget("redo")).toBeUndefined()
  })

  it("does not let reload overwrite a write started after the request", () => {
    const session = createSiteEditingSession(record(0))
    const staleRead = session.readToken()

    session.beginWrite(true)

    expect(session.reload(staleRead, record(1))).toBe(false)
    session.abortWrite()
    expect(session.record.revision).toBe(0)
  })
})
