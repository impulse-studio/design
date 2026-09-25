import { describe, expect, it, vi } from "vitest"
import { createSiteDocument } from "./document.fixture"
import { createExportSession } from "./export-session"
import type { SiteDocument } from "@/validators/sites/document"
import { projectFiles } from "./project"

describe("prepared site exports", () => {
  it("deduplicates concurrent preparation and caches the exact selected document", async () => {
    const prepare = vi.fn(async (doc: SiteDocument) => doc)
    const archive = vi.fn(async () => new Uint8Array([1, 2]))
    const session = createExportSession({ prepare, archive })
    const selected = createSiteDocument()
    selected.files["src/scenarios.json"] = '{"selected":"empty"}'
    const first = session.prepare(selected)
    expect(session.prepare(selected)).toBe(first)
    expect(session.get().stage).toBe("installing")
    await first
    await session.prepare(structuredClone(selected))
    expect(prepare).toHaveBeenCalledOnce()
    expect(prepare.mock.calls[0][0].files["src/scenarios.json"]).toContain(
      "empty"
    )
    selected.files["src/scenarios.json"] = '{"selected":"populated"}'
    await session.prepare(selected)
    expect(prepare).toHaveBeenCalledTimes(2)
    expect(session.get().stage).toBe("ready")
  })
  it("keeps a recoverable error and retries failed preparation without caching it", async () => {
    const doc = createSiteDocument()
    const prepare = vi
      .fn(async (input: SiteDocument) => input)
      .mockRejectedValueOnce(new Error("Registry indisponible"))
    const archive = vi.fn(async () => new Uint8Array([1]))
    const session = createExportSession({ prepare, archive })
    await expect(session.prepare(doc)).rejects.toThrow("Registry indisponible")
    expect(session.get()).toEqual({
      stage: "error",
      message: "Registry indisponible",
    })
    expect(archive).not.toHaveBeenCalled()
    await expect(session.prepare(doc)).resolves.toEqual(new Uint8Array([1]))
    expect(prepare).toHaveBeenCalledTimes(2)
  })
  it("uses one dependency manifest for preview and exported projects", () => {
    const doc = createSiteDocument()
    doc.files["pnpm-lock.yaml"] = "lockfileVersion: 9.0"
    doc.dependencies.clsx = "2.1.1"
    const files = projectFiles(doc)
    expect(JSON.parse(files["package.json"]).dependencies.clsx).toBe("2.1.1")
    expect(files["pnpm-lock.yaml"]).toBeUndefined()
    expect(doc.files["pnpm-lock.yaml"]).toBeDefined()
  })
})
