import { call } from "@orpc/server"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { createRpcContext } from "@/server/context"
import { createSiteHandler } from "./sites/mutations/create"
import { createMockupHandler } from "./mockups/mutations/create"

const mocks = vi.hoisted(() => ({
  authorize: vi.fn(),
  team: vi.fn(),
  createSite: vi.fn(),
  createMockup: vi.fn(),
}))
vi.mock("@/db/client.server", () => ({ getDatabase: () => ({}) }))
vi.mock("@/features/auth/browser-policy.server", () => ({
  authorizeBrowserRequest: mocks.authorize,
}))
vi.mock("@/features/teams/repository.server", () => ({
  findActiveTeam: mocks.team,
}))
vi.mock("@/features/sites/create.server", () => ({
  createSite: mocks.createSite,
}))
vi.mock("@/features/mockups/repository.server", () => ({
  createRecord: mocks.createMockup,
}))

const context = () =>
  createRpcContext(new Request("http://localhost/api/rpc", { method: "POST" }))
beforeEach(() => {
  vi.clearAllMocks()
  mocks.authorize.mockResolvedValue({
    user: { id: "user", activeOrganizationId: "team" },
  })
  mocks.team.mockResolvedValue({ id: "team", role: "owner" })
  mocks.createSite.mockResolvedValue({ id: "site" })
  mocks.createMockup.mockResolvedValue({ id: "mockup" })
})

describe("contrats de création RPC", () => {
  it("normalise le nom et conserve le framework par défaut avant la création", async () => {
    await expect(
      call(createSiteHandler, { name: "  Projet  " }, { context: context() })
    ).resolves.toEqual({ id: "site" })
    expect(mocks.team).toHaveBeenCalledWith("user", "team")
    expect(mocks.createSite).toHaveBeenCalledWith({
      name: "Projet",
      organizationId: "team",
      kind: "react-vite",
    })
  })
  it("valide les entrées avant de résoudre l’équipe", async () => {
    await expect(
      call(createSiteHandler, { name: " " }, { context: context() })
    ).rejects.toMatchObject({ code: "BAD_REQUEST" })
    expect(mocks.team).not.toHaveBeenCalled()
    expect(mocks.createSite).not.toHaveBeenCalled()
  })
  it("conserve les erreurs distinctes en l’absence d’équipe", async () => {
    mocks.team.mockResolvedValue(null)
    await expect(
      call(createSiteHandler, { name: "Projet" }, { context: context() })
    ).rejects.toMatchObject({ code: "FORBIDDEN" })
    await expect(
      call(createMockupHandler, { name: "Projet" }, { context: context() })
    ).rejects.toMatchObject({ code: "TEAM_REQUIRED" })
    expect(mocks.createSite).not.toHaveBeenCalled()
    expect(mocks.createMockup).not.toHaveBeenCalled()
  })
  it("refuse un lecteur et un utilisateur non authentifié", async () => {
    mocks.team.mockResolvedValue({ id: "team", role: "viewer" })
    await expect(
      call(createSiteHandler, { name: "Projet" }, { context: context() })
    ).rejects.toMatchObject({ code: "FORBIDDEN" })
    mocks.authorize.mockRejectedValue(new Error("No session"))
    await expect(
      call(createSiteHandler, { name: "Projet" }, { context: context() })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" })
    expect(mocks.createSite).not.toHaveBeenCalled()
  })
  it("conserve le conflit public quand la création échoue", async () => {
    mocks.createSite.mockRejectedValue(new Error("database unavailable"))
    await expect(
      call(createSiteHandler, { name: "Projet" }, { context: context() })
    ).rejects.toMatchObject({ code: "CONFLICT" })
  })
})
