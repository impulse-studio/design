import { describe, expect, it, vi } from "vitest"
import { createSiteIsolationGuard } from "./isolation-navigation"

const browser = (storage: { marker: string | null }) => ({
  crossOriginIsolated: false,
  isSecureContext: true,
  href: "https://studio.test/m/site",
  readMarker: () => storage.marker,
  writeMarker: (href: string) => {
    storage.marker = href
  },
  clearMarker: () => {
    storage.marker = null
  },
  replace: vi.fn(),
})

describe("site editor isolation navigation", () => {
  it("reloads once when an SPA navigation inherits a non-isolated document", () => {
    const storage = { marker: null as string | null }
    const firstDocument = browser(storage)

    expect(createSiteIsolationGuard()(firstDocument)).toBe(true)
    expect(firstDocument.replace).toHaveBeenCalledWith(firstDocument.href)
    expect(storage.marker).toBe(firstDocument.href)

    const reloadedDocument = browser(storage)
    const guard = createSiteIsolationGuard()
    expect(guard(reloadedDocument)).toBe(false)
    expect(guard(reloadedDocument)).toBe(false)
    expect(reloadedDocument.replace).not.toHaveBeenCalled()
    expect(storage.marker).toBeNull()
  })

  it("clears a previous attempt once the document is isolated", () => {
    const storage = { marker: "https://studio.test/m/site" }
    const isolated = { ...browser(storage), crossOriginIsolated: true }

    expect(createSiteIsolationGuard()(isolated)).toBe(false)
    expect(storage.marker).toBeNull()
  })
})
