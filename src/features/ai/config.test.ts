import { afterEach, describe, expect, it, vi } from "vitest"
import { readAiConfiguration, requireModel } from "./config.server"
import { signCallback, verifyCallback } from "./callback-auth"

afterEach(() => vi.unstubAllEnvs())
describe("configuration centrale et authentification des workers", () => {
  it("n’affiche que les fournisseurs activés et ne change jamais de modèle implicitement", () => {
    vi.stubEnv("TRIGGER_SECRET_KEY", "server-only")
    vi.stubEnv("AI_CALLBACK_SECRET", "x".repeat(32))
    vi.stubEnv(
      "AI_MODELS",
      JSON.stringify([
        { id: "openai:model-a", displayName: "OpenAI" },
        { id: "anthropic:model-b", displayName: "Anthropic" },
      ])
    )
    vi.stubEnv("AI_ENABLED_PROVIDERS", "anthropic")
    vi.stubEnv("AI_DEFAULT_MODEL", "anthropic:model-b")
    expect(readAiConfiguration().models).toEqual([
      {
        id: "anthropic:model-b",
        model: "anthropic:model-b",
        provider: "anthropic",
        displayName: "Anthropic",
        isDefault: true,
      },
    ])
    expect(() => requireModel("openai:model-a")).toThrow("indisponible")
    expect(JSON.stringify(readAiConfiguration())).not.toContain("server-only")
    vi.stubEnv("AI_MODELS", "invalid")
    expect(readAiConfiguration().available).toBe(false)
  })
  it("refuse les callbacks altérés, expirés ou sans signature", () => {
    vi.stubEnv("AI_CALLBACK_SECRET", "x".repeat(32))
    const body = JSON.stringify({ chatId: "private-chat", action: "complete" })
    const request = new Request("https://studio.test/api/ai/callback", {
      method: "POST",
      headers: signCallback(body),
      body,
    })
    expect(verifyCallback(request, body)).toBe(true)
    expect(verifyCallback(request, body + " ")).toBe(false)
    expect(verifyCallback(new Request(request.url), body)).toBe(false)
    const expired = new Request(request.url, {
      headers: signCallback(body, String(Date.now() - 120_000)),
    })
    expect(verifyCallback(expired, body)).toBe(false)
  })
})
