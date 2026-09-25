import { beforeEach, describe, expect, it, vi } from "vitest"
import { createSiteDocument } from "@/features/sites/template"
import { loadSite, saveSiteChange } from "@/features/sites/repository.server"
import { validateSiteBuild } from "@/features/sites/compile.server"
import type * as MockupsModule from "./mockups.server"
import { applyMcpSiteChanges, readMcpSite } from "./sites.server"

vi.mock("@/features/sites/repository.server", () => ({
  loadSite: vi.fn(),
  findSite: vi.fn(),
  saveSiteChange: vi.fn(),
}))
vi.mock("@/features/sites/compile.server", () => ({
  validateSiteBuild: vi.fn(),
}))
vi.mock("./mockups.server", async (original) => ({
  ...(await original<typeof MockupsModule>()),
  listMcpMockups: vi.fn(),
}))
const id = "11111111-1111-4111-8111-111111111111"
const origin = "https://studio.example.com"
const doc = createSiteDocument()
const input = {
  site: `${origin}/m/${id}`,
  expectedRevision: 4,
  summary: "Nouveau titre",
  operations: [
    {
      type: "writeFile",
      path: "src/components/Title.tsx",
      content: "export function Title(){ return <h1>Bienvenue</h1> }",
    },
  ],
}
const loaded = {
  record: {
    id,
    name: "Site",
    notionUrl: null,
    githubUrl: null,
    status: "draft" as const,
    doc: {} as never,
    revision: 9,
    updatedAt: "",
    canEdit: true,
  },
  project: { id, doc, revision: 4 },
}
beforeEach(() => {
  vi.resetAllMocks()
  vi.mocked(loadSite).mockResolvedValue(loaded)
  vi.mocked(saveSiteChange).mockResolvedValue({ id, doc, revision: 5 })
})
describe("sites MCP", () => {
  it("reads the site revision rather than the legacy mockup revision", async () => {
    expect(await readMcpSite("owner", input.site, origin)).toMatchObject({
      revision: 4,
      doc,
      canEdit: true,
    })
  })
  it("can read a compact overview or only requested files", async () => {
    const overview = await readMcpSite("owner", input.site, origin, {
      mode: "overview",
    })
    expect(overview.doc.files["src/App.tsx"]).toBeTypeOf("number")
    const selected = await readMcpSite("owner", input.site, origin, {
      paths: ["src/App.tsx"],
    })
    expect(Object.keys(selected.doc.files)).toEqual(["src/App.tsx"])
    await expect(
      readMcpSite("owner", input.site, origin, { paths: ["missing.tsx"] })
    ).rejects.toThrow("introuvables")
  })
  it("rejects stale revisions without compilation or writes", async () => {
    expect(
      await applyMcpSiteChanges(
        "owner",
        { ...input, expectedRevision: 3 },
        origin
      )
    ).toEqual({ status: "conflict", revision: 4 })
    expect(validateSiteBuild).not.toHaveBeenCalled()
    expect(saveSiteChange).not.toHaveBeenCalled()
  })
  it("rejects viewers", async () => {
    vi.mocked(loadSite).mockResolvedValue({
      ...loaded,
      record: { ...loaded.record, canEdit: false },
    })
    await expect(applyMcpSiteChanges("viewer", input, origin)).rejects.toThrow(
      "lecture seule"
    )
    expect(saveSiteChange).not.toHaveBeenCalled()
  })
  it("rejects protected files", async () => {
    await expect(
      applyMcpSiteChanges(
        "owner",
        {
          ...input,
          operations: [{ ...input.operations[0], path: "src/main.tsx" }],
        },
        origin
      )
    ).rejects.toThrow("protégé")
    expect(saveSiteChange).not.toHaveBeenCalled()
  })
  it("does not persist a project that fails compilation", async () => {
    vi.mocked(validateSiteBuild).mockRejectedValue(
      new Error("Import indisponible")
    )
    await expect(applyMcpSiteChanges("owner", input, origin)).rejects.toThrow(
      "Import indisponible"
    )
    expect(saveSiteChange).not.toHaveBeenCalled()
  })
  it("compiles and saves with the revision and summary supplied", async () => {
    expect(await applyMcpSiteChanges("owner", input, origin)).toMatchObject({
      status: "saved",
      revision: 5,
    })
    expect(validateSiteBuild).toHaveBeenCalledWith(
      expect.objectContaining({
        files: expect.objectContaining({
          "src/components/Title.tsx": expect.stringContaining("Bienvenue"),
        }),
      })
    )
    expect(saveSiteChange).toHaveBeenCalledWith(id, "owner", 4, {
      type: "mcp",
      input: { summary: input.summary, operations: input.operations },
    })
  })
})
