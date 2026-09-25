import { beforeEach, describe, expect, it, vi } from "vitest"
import type * as SitesModule from "./sites.server"
import type * as CreateModule from "./create.server"
import { handleMcpPost } from "./http.server"

const mocks = vi.hoisted(() => ({
  claims: { sub: "owner", azp: "codex", scope: "mcp:read" },
  consent: vi.fn(),
  listSites: vi.fn(),
  applySiteChanges: vi.fn(),
  createProject: vi.fn(),
}))

vi.mock("@/features/auth/auth.server", () => ({ getAuth: () => ({}) }))
vi.mock("@/features/sites/compile.server", () => ({
  validateSiteBuild: vi.fn(),
}))
vi.mock("@/features/auth/config.server", () => ({
  getAuthEnvironment: () => ({ BETTER_AUTH_URL: "http://localhost:3402" }),
}))
vi.mock("@better-auth/mcp", () => ({
  requireMcpAuth:
    (
      _auth: unknown,
      next: (request: Request, claims: typeof mocks.claims) => Promise<Response>
    ) =>
    (request: Request) =>
      next(request, mocks.claims),
}))
vi.mock("@/db/client.server", () => ({
  getDatabase: () => ({
    select: () => ({ from: () => ({ where: mocks.consent }) }),
  }),
}))
vi.mock("./sites.server", async (original) => ({
  ...(await original<typeof SitesModule>()),
  listMcpSites: mocks.listSites,
  applyMcpSiteChanges: mocks.applySiteChanges,
}))
vi.mock("./create.server", async (original) => ({
  ...(await original<typeof CreateModule>()),
  createMcpProject: mocks.createProject,
}))

const send = async (method: string, params: Record<string, unknown> = {}) => {
  const response = await handleMcpPost(
    new Request("http://localhost:3402/api/mcp", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json, text/event-stream",
        "mcp-protocol-version": "2025-06-18",
      },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    })
  )
  const text = await response.text()
  const payload = response.headers
    .get("content-type")
    ?.includes("text/event-stream")
    ? text
        .split("\n")
        .find((line) => line.startsWith("data: "))
        ?.slice(6)
    : text
  return {
    status: response.status,
    payload: payload ? JSON.parse(payload) : null,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.claims.scope = "mcp:read"
  mocks.consent.mockResolvedValue([{ scopes: ["mcp:read", "mcp:write"] }])
  mocks.listSites.mockResolvedValue([])
})

describe("MCP Streamable HTTP compatibility", () => {
  it("accepts the protocol negotiated by Codex", async () => {
    const response = await send("initialize", {
      protocolVersion: "2025-06-18",
      capabilities: {},
      clientInfo: { name: "codex-test", version: "1.0.0" },
    })
    expect(response.status).toBe(200)
    expect(response.payload.result.protocolVersion).toBe("2025-06-18")
  })

  it("lists and calls site tools without an HTTP session", async () => {
    const listed = await send("tools/list")
    expect(listed.payload.result.tools).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "list_sites" })])
    )
    const called = await send("tools/call", {
      name: "list_sites",
      arguments: {},
    })
    expect(called.payload.result.content).toEqual([
      { type: "text", text: "[]" },
    ])
    expect(mocks.listSites).toHaveBeenCalledWith(
      "owner",
      "http://localhost:3402"
    )
  })

  it("still rejects revoked consent before serving the protocol", async () => {
    mocks.consent.mockResolvedValue([])
    const response = await handleMcpPost(
      new Request("http://localhost:3402/api/mcp")
    )
    expect(response.status).toBe(403)
    expect(mocks.listSites).not.toHaveBeenCalled()
  })

  it("does not allow a read-only token to modify a site", async () => {
    const response = await send("tools/call", {
      name: "apply_site_changes",
      arguments: {
        site: "11111111-1111-4111-8111-111111111111",
        expectedRevision: 0,
        summary: "Test",
        operations: [
          {
            type: "writeFile",
            path: "src/App.tsx",
            content: "export default () => null",
          },
        ],
      },
    })
    expect(response.payload.result.isError).toBe(true)
    expect(response.payload.result.content[0].text).toContain(
      "Autorisation d'écriture MCP requise"
    )
    expect(mocks.applySiteChanges).not.toHaveBeenCalled()
  })

  it("offers project creation and requires write permission", async () => {
    const listed = await send("tools/list")
    expect(listed.payload.result.tools).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "create_project" }),
      ])
    )
    const denied = await send("tools/call", {
      name: "create_project",
      arguments: { name: "Accueil", kind: "site" },
    })
    expect(denied.payload.result.isError).toBe(true)
    expect(mocks.createProject).not.toHaveBeenCalled()
    mocks.claims.scope = "mcp:read mcp:write"
    mocks.createProject.mockResolvedValue({ id: "new", revision: 0 })
    const created = await send("tools/call", {
      name: "create_project",
      arguments: { name: "Accueil", kind: "site" },
    })
    expect(created.payload.result.content[0].text).toContain('"revision":0')
  })
})
