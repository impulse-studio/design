import { beforeEach, describe, expect, it, vi } from "vitest"
import { hasCurrentMcpAccess, revokeMcpConnection } from "./connections.server"

const mocks = vi.hoisted(() => ({
  selectRows: [] as unknown[][],
  cleanupFails: false,
  consentDelete: vi.fn(),
  deleteWhere: vi.fn(),
  updateWhere: vi.fn(),
}))

const query = () => {
  const rows = mocks.selectRows.shift() ?? []
  const promise = Promise.resolve(rows)
  return Object.assign(promise, { limit: () => Promise.resolve(rows) })
}

vi.mock("@/db/client.server", () => ({
  getDatabase: () => ({
    select: () => ({
      from: () => ({ where: query, innerJoin: () => ({ where: query }) }),
    }),
    transaction: async (callback: (tx: unknown) => Promise<void>) => {
      if (mocks.cleanupFails) throw new Error("database unavailable")
      return callback({
        delete: () => ({ where: mocks.deleteWhere }),
      })
    },
    delete: () => ({ where: mocks.deleteWhere }),
    update: () => ({ set: () => ({ where: mocks.updateWhere }) }),
  }),
}))
vi.mock("@/features/auth/auth.server", () => ({
  getAuth: () => ({ api: { deleteOAuthConsent: mocks.consentDelete } }),
}))

beforeEach(() => {
  vi.clearAllMocks()
  mocks.selectRows = []
  mocks.cleanupFails = false
})

describe("connexions MCP", () => {
  it("refuse immédiatement un accès marqué pour révocation", async () => {
    mocks.selectRows.push([{ id: "consent-1" }])
    await expect(
      hasCurrentMcpAccess("alice", "codex", ["mcp:read"])
    ).resolves.toBe(false)
  })

  it("conserve un nettoyage incomplet et peut le rejouer", async () => {
    const cleanup = {
      id: "consent-1",
      userId: "alice",
      clientId: "codex",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mocks.selectRows.push([cleanup], [])
    mocks.cleanupFails = true
    await expect(
      revokeMcpConnection("alice", "consent-1", new Headers())
    ).resolves.toEqual({ status: "revoked_cleanup_pending" })

    mocks.selectRows.push([cleanup], [])
    mocks.cleanupFails = false
    await expect(
      revokeMcpConnection("alice", "consent-1", new Headers())
    ).resolves.toEqual({ status: "revoked" })
    expect(mocks.deleteWhere).toHaveBeenCalled()
  })
})
