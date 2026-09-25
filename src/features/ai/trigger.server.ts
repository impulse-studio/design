import { auth } from "@trigger.dev/sdk"
import { chat } from "@trigger.dev/sdk/ai"
import { and, eq, inArray, lt, or } from "drizzle-orm"
import { getDatabase } from "@/db/client.server"
import { aiConversations, aiRuns } from "@/db/schema"
import { activeStatuses, requireConversation } from "./repository.server"

export const CHAT_TASK_ID = "studio-chat"
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
  const rows = await getDatabase()
    .update(aiRuns)
    .set({
      status: "interrupted",
      error: "Génération arrêtée.",
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(aiRuns.userId, userId),
        eq(aiRuns.id, runId),
        inArray(aiRuns.status, [...activeStatuses])
      )
    )
    .returning()
  for (const row of rows) {
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
  await getDatabase()
    .update(aiRuns)
    .set({
      status: "interrupted",
      error: "Génération interrompue. Vous pouvez envoyer un nouveau message.",
      updatedAt: new Date(),
    })
    .where(
      or(
        and(
          eq(aiRuns.status, "running"),
          or(
            lt(aiRuns.updatedAt, new Date(Date.now() - 60_000)),
            lt(aiRuns.startedAt, new Date(Date.now() - 600_000))
          )
        ),
        and(
          eq(aiRuns.status, "queued"),
          lt(aiRuns.createdAt, new Date(Date.now() - 600_000))
        )
      )
    )
}
