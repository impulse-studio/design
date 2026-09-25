import { beforeEach, describe, expect, it, vi } from "vitest"
import { validate, version } from "uuid"
import { publishLibrary } from "./service.server"
import { setLibraryPermission } from "./permissions.server"

const mocks = vi.hoisted(() => ({
  access: vi.fn(),
  persist: vi.fn(),
  permission: vi.fn(),
  transaction: vi.fn(),
  tx: { transactionId: "test" },
}))
vi.mock("@/db/client.server", () => ({
  getDatabase: () => ({ transaction: mocks.transaction }),
}))
vi.mock("./access.server", () => ({
  requireLibraryAccess: mocks.access,
  projectOrganization: vi.fn(),
}))
vi.mock("./repository.server", () => ({
  persistLibrarySnapshot: mocks.persist,
  updateLibraryPermission: mocks.permission,
  listLibraryRecords: vi.fn(),
  findLibraryVersion: vi.fn(),
  findLibraryProject: vi.fn(),
}))
vi.mock("./import", () => ({ discoverComponents: () => [] }))
vi.mock("@/features/sites/versioning.server", () => ({
  commitSiteVersion: vi.fn(),
}))

beforeEach(() => {
  vi.clearAllMocks()
  mocks.access.mockResolvedValue({ role: "owner", canManageLibraries: false })
  mocks.permission.mockResolvedValue([{ id: "member" }])
  mocks.persist.mockResolvedValue(undefined)
  mocks.transaction.mockImplementation(
    (action: (tx: typeof mocks.tx) => Promise<unknown>) => action(mocks.tx)
  )
})

describe("services de bibliothèques", () => {
  it("vérifie les accès avant puis dans la transaction et transmet le snapshot normalisé", async () => {
    const result = await publishLibrary("team", "user", {
      name: "  UI  ",
      payload: { framework: "react-vite", files: {} },
    })
    expect(mocks.access.mock.calls).toEqual([
      ["team", "user", true],
      ["team", "user", true, mocks.tx],
    ])
    expect(result).toMatchObject({
      name: "UI",
      version: 1,
      payload: { files: {}, assets: {}, dependencies: {}, components: [] },
    })
    expect(validate(result.id) && validate(result.libraryId)).toBe(true)
    expect(version(result.id)).toBe(4)
    expect(mocks.persist).toHaveBeenCalledWith(
      mocks.tx,
      "team",
      "user",
      expect.objectContaining({ name: "UI", expectedVersion: 0 }),
      result
    )
  })
  it("propage une erreur de persistance hors de la transaction", async () => {
    mocks.persist.mockRejectedValue(new Error("version conflict"))
    await expect(
      publishLibrary("team", "user", {
        name: "UI",
        payload: { framework: "react-vite", files: {} },
      })
    ).rejects.toThrow("version conflict")
  })
  it("ne persiste rien si l’accès est refusé", async () => {
    mocks.access.mockRejectedValue(new Error("denied"))
    await expect(publishLibrary("team", "user", {})).rejects.toThrow("denied")
    expect(mocks.transaction).not.toHaveBeenCalled()
    expect(mocks.persist).not.toHaveBeenCalled()
  })
  it("réserve l’attribution de permission au propriétaire et cible son équipe", async () => {
    const input = { organizationId: "team", memberId: "member", enabled: true }
    mocks.access.mockResolvedValue({ role: "admin", canManageLibraries: true })
    await expect(setLibraryPermission("user", input)).rejects.toMatchObject({
      kind: "forbidden",
    })
    expect(mocks.permission).not.toHaveBeenCalled()
    mocks.access.mockResolvedValue({ role: "owner" })
    await setLibraryPermission("user", input)
    expect(mocks.permission).toHaveBeenCalledWith(
      mocks.tx,
      "team",
      "member",
      true
    )
    mocks.permission.mockResolvedValue([])
    await expect(setLibraryPermission("user", input)).rejects.toMatchObject({
      kind: "not_found",
    })
  })
})
