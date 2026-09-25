import { persistSiteProposal } from "@/features/sites/repository.server"
import { z } from "zod"
import { and, desc, eq, inArray, lt, sql } from "drizzle-orm"
import { getDatabase } from "@/db/client.server"
import { aiCallbackReceipts, aiConversations, aiRuns } from "@/db/schema"
import { aiCatalog } from "./catalog"
import { verifyCallback } from "./callback-auth"
import {
  claimRun,
  persistProposal,
  requireConversation,
} from "./repository.server"

const messageSchema = z
  .object({
    id: z.string().max(200),
    role: z.enum(["system", "user", "assistant"]),
    parts: z.array(z.object({ type: z.string() }).passthrough()).max(500),
  })
  .passthrough()
const callbackSchema = z
  .object({
    chatId: z.string().uuid(),
    eventId: z.string().uuid(),
    action: z.enum([
      "load",
      "save",
      "begin",
      "heartbeat",
      "proposal",
      "complete",
      "recover",
    ]),
    runId: z.string().uuid().optional(),
    triggerRunId: z.string().max(200).optional(),
    answer: z.string().max(100_000).optional(),
    messages: z.array(messageSchema).max(500).optional(),
    state: z.unknown().optional(),
    lastEventId: z.string().max(200).optional(),
    status: z.enum(["completed", "failed", "interrupted"]).optional(),
    inputTokens: z.number().int().nonnegative().nullable().optional(),
    outputTokens: z.number().int().nonnegative().nullable().optional(),
    callId: z.string().max(200).optional(),
    input: z.unknown().optional(),
  })
  .strict()

export const handleWorkerCallback = async (request: Request) => {
  try {
    if (Number(request.headers.get("content-length")) > 5_000_000)
      return new Response(null, { status: 413 })
    const body = await request.text()
    if (body.length > 5_000_000) return new Response(null, { status: 413 })
    if (!verifyCallback(request, body))
      return new Response(null, { status: 401 })
    const input = callbackSchema.parse(JSON.parse(body))
    const db = getDatabase()
    await db
      .delete(aiCallbackReceipts)
      .where(lt(aiCallbackReceipts.expiresAt, new Date()))
    const accepted = await db
      .insert(aiCallbackReceipts)
      .values({ id: input.eventId, expiresAt: new Date(Date.now() + 120_000) })
      .onConflictDoNothing()
      .returning({ id: aiCallbackReceipts.id })
    if (!accepted.length) return new Response(null, { status: 409 })
    const conversation = await db
      .select()
      .from(aiConversations)
      .where(eq(aiConversations.id, input.chatId))
      .then((rows) => rows.at(0))
    if (!conversation) return new Response(null, { status: 404 })
    await requireConversation(conversation.userId, conversation.id)
    if (input.action === "load")
      return Response.json({
        messages: conversation.transcript,
        state: conversation.transcriptState,
        cursors: { lastOutEventId: conversation.lastEventId ?? undefined },
      })
    if (input.action === "recover") {
      // Never re-dispatch an in-flight user turn after an ambiguous process failure.
      await db
        .update(aiRuns)
        .set({
          status: "interrupted",
          error: "Génération interrompue après redémarrage.",
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(aiRuns.conversationId, conversation.id),
            eq(aiRuns.triggerRunId, input.triggerRunId ?? ""),
            inArray(aiRuns.status, ["queued", "running"])
          )
        )
      return Response.json({ ok: true })
    }
    const run = await db
      .select()
      .from(aiRuns)
      .where(
        and(
          eq(aiRuns.id, input.runId ?? ""),
          eq(aiRuns.conversationId, conversation.id),
          eq(aiRuns.userId, conversation.userId)
        )
      )
      .then((rows) => rows.at(0))
    if (!run) return new Response(null, { status: 404 })
    if (input.action === "begin") {
      if (Date.now() - run.createdAt.getTime() > 600_000)
        return Response.json({ interrupted: true })
      if (run.status !== "queued") return Response.json({ interrupted: true })
      const claimed = await claimRun(run.id)
      if (!claimed) return Response.json({ waiting: true })
      await db
        .update(aiRuns)
        .set({ triggerRunId: input.triggerRunId })
        .where(eq(aiRuns.id, run.id))
      return Response.json({
        context: run.context,
        model: run.model,
        provider: run.provider,
        catalogue: aiCatalog,
      })
    }
    // Old workers cannot change a newer turn, and stopped/terminal runs cannot become active again.
    if (
      input.action !== "save" &&
      ((run.status !== "running" &&
        !(input.action === "complete" && run.status === "interrupted")) ||
        run.triggerRunId !== input.triggerRunId)
    )
      return new Response(null, { status: 409 })
    if (
      input.action !== "save" &&
      run.startedAt &&
      Date.now() - run.startedAt.getTime() > 600_000
    )
      return new Response(null, { status: 409 })
    if (input.action === "save") {
      await db.transaction(async (tx) => {
        await tx.execute(
          sql`SELECT pg_advisory_xact_lock(hashtext(${`ai-conversation:${conversation.id}`}))`
        )
        const latest = await tx
          .select({ id: aiRuns.id })
          .from(aiRuns)
          .where(eq(aiRuns.conversationId, conversation.id))
          .orderBy(desc(aiRuns.createdAt))
          .limit(1)
        if (latest[0]?.id !== run.id) return
        if (run.triggerRunId && input.triggerRunId !== run.triggerRunId)
          throw new Error("Obsolete worker")
        const { validateUIMessages } = await import("ai")
        const messages = await validateUIMessages({
          messages: input.messages ?? [],
        })
        await tx
          .update(aiConversations)
          .set({
            transcript: messages,
            transcriptState: input.state,
            lastEventId: input.lastEventId,
          })
          .where(eq(aiConversations.id, conversation.id))
      })
    } else if (input.action === "proposal") {
      if (!input.callId) return new Response(null, { status: 400 })
      try {
        return Response.json(
          await (run.context.project
            ? persistSiteProposal(run, input.callId, input.input)
            : persistProposal(run, input.callId, input.input))
        )
      } catch {
        return Response.json({
          error:
            "Proposition invalide : vérifiez les opérations, composants, propriétés et verrouillages du document.",
        })
      }
    } else if (input.action === "heartbeat") {
      await db
        .update(aiRuns)
        .set({ answer: input.answer ?? run.answer, updatedAt: new Date() })
        .where(and(eq(aiRuns.id, run.id), eq(aiRuns.status, "running")))
    } else {
      const status =
        run.status === "interrupted"
          ? "interrupted"
          : (input.status ?? "failed")
      await db
        .update(aiRuns)
        .set({
          answer: input.answer ?? run.answer,
          status,
          inputTokens: input.inputTokens ?? null,
          outputTokens: input.outputTokens ?? null,
          error:
            status === "completed"
              ? null
              : status === "interrupted"
                ? "Génération interrompue."
                : "Le fournisseur n’a pas pu terminer la réponse. Vérifiez les limites API du studio.",
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(aiRuns.id, run.id),
            inArray(aiRuns.status, ["running", "interrupted"])
          )
        )
    }
    return Response.json({ ok: true })
  } catch {
    // Never echo signatures, documents, provider exceptions or request bodies.
    return Response.json({ error: "Callback refusé." }, { status: 403 })
  }
}
