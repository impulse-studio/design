import { beforeEach, describe, expect, it, vi } from "vitest"
import { createMcpProject } from "./create.server"

const mocks = vi.hoisted(() => ({
  teams: vi.fn(),
  createRecord: vi.fn(),
  insert: vi.fn(),
  values: vi.fn(),
}))

vi.mock("@/features/teams/repository.server", () => ({
  listTeamsForUser: mocks.teams,
}))
vi.mock("@/features/mockups/repository.server", () => ({
  createRecord: mocks.createRecord,
}))
vi.mock("@/db/client.server", () => ({
  getDatabase: () => ({
    transaction: (callback: (tx: unknown) => Promise<unknown>) =>
      callback({ insert: mocks.insert }),
  }),
}))

beforeEach(() => {
  vi.clearAllMocks()
  mocks.teams.mockResolvedValue([
    { id: "team-1", name: "Équipe", role: "owner" },
  ])
  mocks.insert.mockReturnValue({ values: mocks.values })
  mocks.values.mockResolvedValue(undefined)
})

describe("création MCP", () => {
  it("creates a mockup in the only writable team", async () => {
    mocks.createRecord.mockResolvedValue({ id: "mockup-1", revision: 0 })
    await expect(
      createMcpProject(
        "owner",
        { name: "Test", kind: "mockup" },
        "https://studio.example.com"
      )
    ).resolves.toEqual({
      id: "mockup-1",
      kind: "mockup",
      revision: 0,
      url: "https://studio.example.com/m/mockup-1",
    })
    expect(mocks.createRecord).toHaveBeenCalledWith("Test", "owner", "team-1")
  })

  it("requires a team choice when several are writable", async () => {
    mocks.teams.mockResolvedValue([
      { id: "team-1", name: "A", role: "owner" },
      { id: "team-2", name: "B", role: "member" },
    ])
    await expect(
      createMcpProject(
        "owner",
        { name: "Test", kind: "site" },
        "https://studio.example.com"
      )
    ).rejects.toThrow("teamId")
    expect(mocks.insert).not.toHaveBeenCalled()
  })

  it("creates a site and its first version atomically", async () => {
    const result = await createMcpProject(
      "owner",
      { name: "Site", kind: "site" },
      "https://studio.example.com"
    )
    expect(result).toMatchObject({ kind: "site", revision: 0 })
    expect(mocks.insert).toHaveBeenCalledTimes(3)
    expect(mocks.values).toHaveBeenCalledWith(
      expect.objectContaining({
        id: result.id,
        name: "Site",
        organizationId: "team-1",
      })
    )
  })
})
