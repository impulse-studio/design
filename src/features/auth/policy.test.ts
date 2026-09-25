import { afterEach, describe, expect, it, vi } from "vitest"
import { createAuthOptions } from "./options.server"
import { getAuthEnvironment, isDevelopmentAuthEnabled } from "./config.server"
import { ACCOUNT_REQUIRED, getLoginRedirect, isDigiteventUser } from "./policy"

afterEach(() => vi.unstubAllEnvs())

describe("Digitevent authentication policy", () => {
  it("accepts only verified exact Digitevent addresses", () => {
    expect(
      isDigiteventUser({ email: "Alice@Digitevent.com", emailVerified: true })
    ).toBe(true)
    for (const email of [
      "alice@gmail.com",
      "alice@digitevent.com.evil.test",
      "alice@sub.digitevent.com",
      "alice@notdigitevent.com",
      "alice@@digitevent.com",
      " alice@digitevent.com",
    ])
      expect(isDigiteventUser({ email, emailVerified: true })).toBe(false)
    expect(
      isDigiteventUser({ email: "alice@digitevent.com", emailVerified: false })
    ).toBe(false)
  })

  it("gates first and returning logins against the fresh Google profile", () => {
    const options = createAuthOptions({
      BETTER_AUTH_URL: "https://studio.example.com",
      BETTER_AUTH_SECRET: "test-secret-with-more-than-thirty-two-characters",
      GOOGLE_CLIENT_ID: "test",
      GOOGLE_CLIENT_SECRET: "test",
      DEV_AUTH_PASSWORD: "",
      devMode: false,
    })
    for (const action of ["create-user", "sign-in", "link-account"] as const) {
      const source = {
        method: "oauth",
        action,
        oauth: { providerId: "google", profile: { hd: "digitevent.com" } },
      }
      expect(
        options.user.validateUserInfo({
          user: { email: "alice@digitevent.com", emailVerified: true },
          source,
        })
      ).toBeUndefined()
      expect(
        options.user.validateUserInfo({
          user: { email: "alice@outside.com", emailVerified: true },
          source,
        })
      ).toMatchObject({ error: ACCOUNT_REQUIRED })
      expect(
        options.user.validateUserInfo({
          user: { email: "alice@digitevent.com", emailVerified: true },
          source: { ...source, oauth: { providerId: "google", profile: {} } },
        })
      ).toMatchObject({ error: ACCOUNT_REQUIRED })
    }
    expect(options.emailAndPassword.enabled).toBe(false)
  })

  it("never enables the developer login in production or on a public host", () => {
    vi.stubEnv("AUTH_DEV_MODE", "true")
    vi.stubEnv("BETTER_AUTH_URL", "http://localhost:3402")
    vi.stubEnv("NODE_ENV", "development")
    expect(isDevelopmentAuthEnabled()).toBe(true)
    vi.stubEnv("NODE_ENV", "production")
    expect(isDevelopmentAuthEnabled()).toBe(false)
    vi.stubEnv("GOOGLE_CLIENT_ID", "")
    vi.stubEnv("GOOGLE_CLIENT_SECRET", "")
    expect(getAuthEnvironment()).toBeNull()
    vi.stubEnv("NODE_ENV", "development")
    vi.stubEnv("BETTER_AUTH_URL", "https://studio.digitevent.com")
    expect(isDevelopmentAuthEnabled()).toBe(false)
  })

  it("rejects external, protocol-relative and encoded login redirects", () => {
    for (const path of [
      "https://evil.test",
      "//evil.test",
      "/\\evil.test",
      "/%2f%2fevil.test",
      "/login",
      "/api/auth/sign-out",
      "/teams?redirect=https://evil.test",
    ])
      expect(getLoginRedirect(path)).toBe("/")
    expect(getLoginRedirect("/m/mockup-123")).toBe("/m/mockup-123")
    expect(getLoginRedirect("/teams")).toBe("/teams")
  })
})
