import { auth } from "@trigger.dev/sdk"
import { chat } from "@trigger.dev/sdk/ai"
import { eq } from "drizzle-orm"
import { getDatabase } from "@/db/client.server"
import { aiConversations } from "@/db/schema"
import { requireConversation } from "./repository.server"
import { handleGenerationCommand } from "./generation.server"

const CHAT_TASK_ID = "studio-chat"
const upstreamBase = "https://api.trigger.dev"
export const startSession = async (userId: string, chatId: string) => {
  await requireConversation(userId, chatId)
  const result = await chat.createStartSessionAction(CHAT_TASK_ID)({ chatId })
  await getDatabase()
    .update(aiConversations)
    .set({ triggerSessionId: result.sessionId })
    .where(eq(aiConversations.id, chatId))
  // Deliberately not a Trigger credential. The browser only talks to our cookie-authenticated proxy.
  return {
    publicAccessToken: "studio-session",
    pendingVersion: result.pendingVersion,
  }
}
export const triggerFetch = async (
  chatId: string,
  endpoint: "in" | "out",
  init: RequestInit,
  search = ""
) => {
  const token = await auth.createPublicToken({
    scopes: { read: { sessions: chatId }, write: { sessions: chatId } },
    expirationTime: "10m",
  })
  const headers = new Headers(init.headers)
  headers.set("Authorization", `Bearer ${token}`)
  return fetch(
    `${upstreamBase}/realtime/v1/sessions/${encodeURIComponent(chatId)}/${endpoint === "in" ? "in/append" : "out"}${search}`,
    { ...init, headers, redirect: "error" }
  )
}
export const interruptRuns = async (userId: string, runId: string) => {
  const outcome = await handleGenerationCommand({
    type: "interrupt",
    userId,
    runId,
  })
  if (outcome.kind !== "interrupted") return
  for (const row of outcome.runs) {
    await triggerFetch(row.conversationId, "in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Part-Id": `stop-${row.id}`,
      },
      body: JSON.stringify({ kind: "stop" }),
      signal: AbortSignal.timeout(10_000),
    }).catch(() => undefined)
  }
}
/** Expired leases never replay a model request; worker heartbeats fail closed. */
export const expireRuns = async () => {
  await handleGenerationCommand({ type: "expire" })
}
