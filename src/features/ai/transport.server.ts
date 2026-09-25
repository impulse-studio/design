import { z } from "zod"
import { and, eq } from "drizzle-orm"
import { getDatabase } from "@/db/client.server"
import { aiRuns } from "@/db/schema"
import { studioAiAccess } from "./access.server"
import { requireConversation } from "./repository.server"
import { triggerFetch } from "./trigger.server"

const inputSchema = z.object({
  kind: z.literal("message"),
  payload: z.object({
    chatId: z.string(),
    trigger: z.literal("submit-message"),
    runId: z.string().uuid(),
    message: z.object({
      id: z.string(),
      role: z.literal("user"),
      parts: z
        .array(z.object({ type: z.literal("text"), text: z.string() }).strict())
        .length(1),
    }),
  }),
})

export const proxyInput = async (request: Request, userId: string) => {
  const raw = await request.text()
  if (raw.length > 100_000) return new Response(null, { status: 413 })
  const input = inputSchema.parse(JSON.parse(raw)).payload
  const conversation = await requireConversation(userId, input.chatId)
  const run = await getDatabase()
    .select()
    .from(aiRuns)
    .where(
      and(
        eq(aiRuns.id, input.runId),
        eq(aiRuns.userId, userId),
        eq(aiRuns.conversationId, conversation.id)
      )
    )
    .then((rows) => rows.at(0))
  if (
    !run ||
    run.prompt !== input.message.parts[0].text ||
    input.message.id !== `${run.id}:user`
  )
    throw new Response("Envoi invalide.", { status: 409 })
  if (!["queued", "running"].includes(run.status))
    throw new Response("Génération terminée.", { status: 409 })
  // Never forward client history, model overrides, tools, metadata or arbitrary payload fields.
  const body = JSON.stringify({
    kind: "message",
    payload: {
      chatId: conversation.id,
      trigger: "submit-message",
      message: input.message,
      metadata: { runId: run.id },
    },
  })
  const upstream = await triggerFetch(conversation.id, "in", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Part-Id": run.id },
    body,
    signal: AbortSignal.timeout(15_000),
  })
  if (!upstream.ok)
    return Response.json(
      { error: "Le service IA est temporairement indisponible." },
      { status: 503 }
    )
  const result = z
    .object({
      seq: z.number().optional(),
      pendingVersion: z.boolean().optional(),
    })
    .passthrough()
    .parse(await upstream.json())
  // Only these transport fields are public, never upstream credentials or diagnostics.
  return Response.json({
    seq: result.seq,
    pendingVersion: result.pendingVersion,
  })
}
export const proxyOutput = async (request: Request, userId: string) => {
  const url = new URL(request.url)
  const chatId = z.string().uuid().parse(url.searchParams.get("chatId"))
  const conversation = await requireConversation(userId, chatId)
  if (!conversation.triggerSessionId) return new Response(null, { status: 204 })
  const search = new URLSearchParams()
  for (const key of [
    "lastEventId",
    "sinceInSeq",
    "timeout",
    "timeoutInSeconds",
  ]) {
    const value = url.searchParams.get(key)
    if (value && value.length < 200) search.set(key, value)
  }
  const controller = new AbortController()
  const abort = () => controller.abort()
  request.signal.addEventListener("abort", abort, { once: true })
  let timer: ReturnType<typeof setInterval> | undefined
  const clean = () => {
    clearInterval(timer)
    controller.abort()
    request.signal.removeEventListener("abort", abort)
  }
  try {
    const headers = new Headers()
    const lastId = request.headers.get("last-event-id")
    if (lastId && lastId.length < 200) headers.set("last-event-id", lastId)
    if (request.headers.get("x-peek-settled") === "1")
      headers.set("x-peek-settled", "1")
    const upstream = await triggerFetch(
      chatId,
      "out",
      { headers, signal: controller.signal },
      `?${search}`
    )
    if (!upstream.ok || !upstream.body) {
      clean()
      return new Response(null, { status: upstream.status === 204 ? 204 : 503 })
    }
    const reader = upstream.body.getReader()
    // The cookie session and membership are re-read for the lifetime of the SSE connection.
    timer = setInterval(() => {
      void (async () => {
        const current = await studioAiAccess.requireUser()
        if (current.userId !== userId) throw new Error("Session changed")
        await requireConversation(userId, chatId)
      })().catch(clean)
    }, 1200)
    const stream = new ReadableStream<Uint8Array>({
      async pull(output) {
        try {
          const next = await reader.read()
          if (next.done) {
            clean()
            output.close()
          } else output.enqueue(next.value)
        } catch {
          clean()
          output.error(new Error("Flux interrompu."))
        }
      },
      async cancel() {
        clean()
        await reader.cancel().catch(() => undefined)
      },
    })
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-store",
        "X-Accel-Buffering": "no",
      },
    })
  } catch {
    clean()
    return new Response(null, { status: 503 })
  }
}
