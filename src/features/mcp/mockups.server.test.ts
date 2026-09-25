import { beforeEach, describe, expect, it, vi } from "vitest"
import { emptyDocument } from "@/features/editor/document"
import { library } from "@/features/editor/library"
import { loadRecord, saveRecord } from "@/features/mockups/repository.server"
import {
  applyMcpChanges,
  readMcpMockup,
  resolveMockupId,
} from "./mockups.server"

vi.mock("@/features/mockups/repository.server", () => ({
  loadRecord: vi.fn(),
  saveRecord: vi.fn(),
  listRecords: vi.fn(),
}))
vi.mock("@/features/teams/repository.server", () => ({
  listTeamsForUser: vi.fn(),
}))

const id = "11111111-1111-4111-8111-111111111111"
const origin = "https://studio.example.com"
const doc = emptyDocument()
const input = {
  mockup: `${origin}/m/${id}`,
  expectedRevision: 4,
  summary: "Agrandir la frame",
  operations: [
    {
      type: "updateNode" as const,
      id: doc.pages[0].frames[0].id,
      patch: { width: 1280 },
    },
  ],
}

describe("modifications MCP", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(loadRecord).mockResolvedValue({
      id,
      name: "Test",
      notionUrl: null,
      githubUrl: null,
      status: "draft",
      doc,
      revision: 4,
      updatedAt: new Date().toISOString(),
      canEdit: true,
    })
    vi.mocked(saveRecord).mockResolvedValue({
      status: "saved",
      revision: 5,
      updatedAt: new Date().toISOString(),
    })
  })

  it("refuse un lien vers un autre site", () => {
    expect(() =>
      resolveMockupId(`https://other.example/m/${id}`, origin)
    ).toThrow()
  })

  it("retourne un aperçu léger de la maquette", async () => {
    const overview = await readMcpMockup(
      "owner",
      input.mockup,
      origin,
      "overview"
    )
    expect(overview).toMatchObject({
      revision: 4,
      pages: [{ frames: [{ id: doc.pages[0].frames[0].id, nodeCount: 1 }] }],
    })
    expect(overview).not.toHaveProperty("doc")
  })

  it("refuse une ancienne révision sans écriture", async () => {
    const result = await applyMcpChanges(
      "owner",
      { ...input, expectedRevision: 3 },
      origin
    )
    expect(result).toEqual({ status: "conflict", revision: 4 })
    expect(saveRecord).not.toHaveBeenCalled()
  })

  it("refuse une maquette en lecture seule", async () => {
    vi.mocked(loadRecord).mockResolvedValueOnce({
      ...(await loadRecord(id, "owner")),
      canEdit: false,
    })
    await expect(applyMcpChanges("owner", input, origin)).rejects.toThrow(
      /lecture seule/
    )
    expect(saveRecord).not.toHaveBeenCalled()
  })

  it("valide et enregistre les opérations avec la révision attendue", async () => {
    expect(await applyMcpChanges("owner", input, origin)).toMatchObject({
      status: "saved",
      revision: 5,
    })
    expect(saveRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        id,
        expectedRevision: 4,
        doc: expect.objectContaining({ libVersion: library.orchestrationSha }),
      }),
      "owner"
    )
  })
})
