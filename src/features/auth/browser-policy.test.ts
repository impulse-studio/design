import { beforeEach, describe, expect, it, vi } from "vitest"
import { authorizeBrowserRequest } from "./browser-policy.server"

const mocks = vi.hoisted(() => ({ user: vi.fn() }))
vi.mock("./session.server", () => ({ readCurrentUser: mocks.user }))
vi.mock("./config.server", () => ({
  getAuthEnvironment: () => ({ BETTER_AUTH_URL: "https://studio.test" }),
}))

beforeEach(() => {
  mocks.user.mockReset()
  mocks.user.mockResolvedValue({ id: "alice" })
})

describe("politique des requêtes navigateur", () => {
  it("refuse une mutation sans origine ou provenant d'une autre origine", async () => {
    for (const origin of [undefined, "https://evil.test"]) {
      const request = new Request("https://studio.test/api/rpc", {
        method: "POST",
        headers: origin ? { origin } : undefined,
      })
      await expect(
        authorizeBrowserRequest(request, { session: "optional" })
      ).rejects.toMatchObject({ kind: "origin" })
    }
    expect(mocks.user).not.toHaveBeenCalled()
  })

  it("accepte une lecture sans origine et impose la session à la demande", async () => {
    mocks.user.mockResolvedValueOnce(null)
    await expect(
      authorizeBrowserRequest(new Request("https://studio.test/api/rpc"), {
        session: "required",
      })
    ).rejects.toMatchObject({
      kind: "unauthorized",
    })
  })
})
