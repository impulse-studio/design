import { z } from "zod"
import { studioAiAccess } from "./access.server"
import {
  createConversation,
  decideProposal,
  enqueueRun,
  getSnapshot,
  prepareProposal,
} from "./repository.server"
import { readAiConfiguration, requireModel } from "./config.server"
import { handleWorkerCallback } from "./callback.server"
import { proxyInput, proxyOutput } from "./transport.server"
import { expireRuns, interruptRuns, startSession } from "./trigger.server"

import { actionSchema, querySchema } from "./actions"

const headers = { "Cache-Control": "no-store" }
const json = (data: unknown) => Response.json(data, { headers })
const errorResponse = async (error: unknown) => {
  if (error instanceof Response)
    return Response.json(
      { error: await error.clone().text() },
      { status: error.status, headers }
    )
  const safe =
    error instanceof Error &&
    /^(Conversation introuvable|Maquette introuvable|Cette maquette|La maquette|Cette proposition|Proposition introuvable|La sauvegarde|Enregistrez|Une génération|Créez une|Identifiant d’envoi|Modèle indisponible)/.test(
      error.message
    )
  return Response.json(
    {
      error:
        error instanceof z.ZodError
          ? "La demande est invalide."
          : safe
            ? error.message
            : "Impossible de terminer la demande. Réessayez.",
    },
    { status: error instanceof z.ZodError ? 400 : 409, headers }
  )
}
export const handleAiGet = async (request: Request) => {
  try {
    const { userId } = await studioAiAccess.requireUser()
    const url = new URL(request.url)
    await expireRuns()
    if (url.pathname.endsWith("/configuration"))
      return json(readAiConfiguration())
    if (url.pathname.endsWith("/transport/out"))
      return await proxyOutput(request, userId)
    const query = querySchema.parse(Object.fromEntries(url.searchParams))
    const initial = await getSnapshot(
      userId,
      query.mockupId,
      query.conversationId
    )
    if (url.pathname.endsWith("/state")) return json(initial)
    if (!url.pathname.endsWith("/events"))
      return new Response(null, { status: 404 })
    const encoder = new TextEncoder()
    let cancelled = false,
      timer: ReturnType<typeof setTimeout> | undefined
    const isClosed = () => cancelled || request.signal.aborted
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        let previous = ""
        const emit = (snapshot: typeof initial) => {
          const data = JSON.stringify(snapshot)
          if (data !== previous) {
            controller.enqueue(
              encoder.encode(`event: snapshot\ndata: ${data}\n\n`)
            )
            previous = data
          } else controller.enqueue(encoder.encode(": heartbeat\n\n"))
        }
        emit(initial)
        const tick = async () => {
          if (isClosed()) return
          try {
            // Recheck both session and membership while the stream remains open.
            const current = await studioAiAccess.requireUser()
            if (current.userId !== userId) throw new Error("Session terminée")
            await expireRuns()
            const snapshot = await getSnapshot(
              userId,
              query.mockupId,
              query.conversationId
            )
            if (isClosed()) return
            emit(snapshot)
            timer = setTimeout(() => void tick(), 1200)
          } catch {
            if (!isClosed()) {
              controller.enqueue(
                encoder.encode("event: unavailable\ndata: {}\n\n")
              )
              controller.close()
              cancelled = true
            }
          }
        }
        timer = setTimeout(() => void tick(), 1200)
        request.signal.addEventListener(
          "abort",
          () => {
            cancelled = true
            clearTimeout(timer)
            try {
              controller.close()
            } catch {
              /* Already closed. */
            }
          },
          { once: true }
        )
      },
      cancel() {
        cancelled = true
        clearTimeout(timer)
      },
    })
    return new Response(stream, {
      headers: {
        ...headers,
        "Content-Type": "text/event-stream",
        "X-Accel-Buffering": "no",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    return errorResponse(error)
  }
}
export const handleAiPost = async (request: Request) => {
  if (new URL(request.url).pathname.endsWith("/callback"))
    return handleWorkerCallback(request)
  try {
    const expectedOrigin = new URL(process.env.BETTER_AUTH_URL ?? request.url)
      .origin
    if (
      request.headers.get("origin") !== expectedOrigin ||
      !request.headers.get("content-type")?.startsWith("application/json")
    )
      return Response.json(
        { error: "Origine de la demande invalide." },
        { status: 403, headers }
      )
    const { userId } = await studioAiAccess.requireUser()
    if (Number(request.headers.get("content-length")) > 100_000)
      return new Response(null, { status: 413 })
    if (new URL(request.url).pathname.endsWith("/transport/in"))
      return await proxyInput(request, userId)
    const raw = await request.text()
    if (raw.length > 100_000) return new Response(null, { status: 413 })
    const input = actionSchema.parse(JSON.parse(raw))
    await expireRuns()
    switch (input.action) {
      case "session":
        return json(await startSession(userId, input.conversationId))
      case "conversation":
        return json(await createConversation(userId, input.mockupId))
      case "send": {
        const model = requireModel(input.model)
        return json(
          await enqueueRun(userId, { ...input, provider: model.provider })
        )
      }
      case "stop":
        await interruptRuns(userId, input.runId)
        return json({ ok: true })
      case "prepare":
        return json(
          await prepareProposal(userId, input.proposalId, input.docHash)
        )
      case "decide":
        await decideProposal(userId, input.proposalId, input.decision)
        return json({ ok: true })
    }
  } catch (error) {
    return errorResponse(error)
  }
}
