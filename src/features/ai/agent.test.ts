import { createSiteDocument } from "@/features/sites/document.fixture"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { MockLanguageModelV3, simulateReadableStream } from "ai/test"
import { mockChatAgent } from "@trigger.dev/sdk/ai/test"
import { studioChat } from "../../trigger/studio-chat"

const mocks = vi.hoisted(() => ({
  callback: vi.fn(),
  openai: vi.fn(),
  anthropic: vi.fn(),
}))
vi.mock("./callback-auth", () => ({ workerCallback: mocks.callback }))
vi.mock("@ai-sdk/openai", () => ({ createOpenAI: () => mocks.openai }))
vi.mock("@ai-sdk/anthropic", () => ({ createAnthropic: () => mocks.anthropic }))
const runId = "3bfaaae2-faf7-4cb0-8a36-abefbcc7a370"
beforeEach(() => {
  vi.stubEnv("OPENAI_API_KEY", "test")
  vi.stubEnv("ANTHROPIC_API_KEY", "test")
  vi.clearAllMocks()
})
afterEach(() => vi.unstubAllEnvs())
describe("agent Trigger avec AI SDK réel et fournisseurs simulés", () => {
  it.each([["openai", false], ["anthropic", false], ["openai", true], ["anthropic", true]] as const)(
    "stream et persiste un tour %s (projet React : %s)",
    async (provider, site) => {
      const model = new MockLanguageModelV3({
        doStream: async () => ({
          stream: simulateReadableStream({
            chunks: [
              { type: "text-start", id: "text-1" },
              { type: "text-delta", id: "text-1", delta: "Bonjour" },
              { type: "text-end", id: "text-1" },
              {
                type: "finish",
                finishReason: { unified: "stop", raw: "stop" },
                usage: {
                  inputTokens: {
                    total: 12,
                    noCache: 12,
                    cacheRead: 0,
                    cacheWrite: 0,
                  },
                  outputTokens: { total: 3, text: 3, reasoning: 0 },
                },
              },
            ],
          }),
        }),
      })
      mocks[provider].mockReturnValue(model)
      mocks.callback.mockImplementation(
        async (_chatId: string, action: string) => {
          if (action === "load") return { messages: [], state: null }
          if (action === "begin")
            return {
              model: `${provider}:test-model`,
              provider,
              context: { doc: { pages: [] }, selectedIds: [], ...(site ? {project: createSiteDocument(), projectId: runId, activeRoute: "/"} : {}) },
              catalogue: [],
            }
          return { ok: true }
        }
      )
      const harness = mockChatAgent(studioChat, {
        chatId: "private",
        clientData: { runId },
        preload: false,
      })
      try {
        const turn = await harness.sendMessage({
          id: `${runId}:user`,
          role: "user",
          parts: [{ type: "text", text: "Bonjour" }],
        })
        expect(turn.chunks).toContainEqual(
          expect.objectContaining({ type: "text-delta", delta: "Bonjour" })
        )
        expect(mocks[provider]).toHaveBeenCalledWith("test-model")
        expect(model.doStreamCalls[0].tools?.map((item) => item.name)).toEqual([
          site ? "propose_site_changes" : "propose_mockup_changes",
        ])
        expect(mocks.callback).toHaveBeenCalledWith(
          "private",
          "complete",
          expect.objectContaining({
            status: "completed",
            inputTokens: 12,
            outputTokens: 3,
            answer: "Bonjour",
          })
        )
      } finally {
        await harness.close()
      }
      expect(
        mocks.callback.mock.calls.some(
          ([, action, data]) =>
            action === "save" &&
            data.messages.some(
              (message: { role: string }) => message.role === "assistant"
            )
        )
      ).toBe(true)
    }
  )
})
