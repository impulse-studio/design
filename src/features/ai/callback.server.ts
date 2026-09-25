import { persistSiteProposal } from "@/features/sites/repository.server"
import { and, desc, eq, lt, sql } from "drizzle-orm"
import { getDatabase } from "@/db/client.server"
import { aiCallbackReceipts, aiConversations, aiRuns } from "@/db/schema"
import { aiCatalog } from "./catalog"
import { verifyCallback } from "./callback-auth"
import { callbackRequestSchema } from "@/validators/ai/callback"
import { persistProposal, requireConversation } from "./repository.server"
import { handleGenerationCommand } from "./generation.server"

export const handleWorkerCallback = async (request: Request) => {
  try {
    if (Number(request.headers.get("content-length")) > 5_000_000)
      return new Response(null, { status: 413 })
    const body = await request.text()
    if (body.length > 5_000_000) return new Response(null, { status: 413 })
    if (!verifyCallback(request, body))
      return new Response(null, { status: 401 })
    const input = callbackRequestSchema.parse(JSON.parse(body))
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
      await handleGenerationCommand({
        type: "recover",
        conversationId: conversation.id,
        triggerRunId: input.triggerRunId,
      })
      return Response.json({ ok: true })
    }
    const run = await db
      .select()
      .from(aiRuns)
      .where(
        and(
          eq(aiRuns.id, input.runId),
          eq(aiRuns.conversationId, conversation.id),
          eq(aiRuns.userId, conversation.userId)
        )
      )
      .then((rows) => rows.at(0))
    if (!run) return new Response(null, { status: 404 })
    if (input.action === "begin") {
      const outcome = await handleGenerationCommand({
        type: "begin",
        runId: run.id,
        triggerRunId: input.triggerRunId,
      })
      if (outcome.kind === "waiting") return Response.json({ waiting: true })
      if (outcome.kind !== "admitted")
        return Response.json({ interrupted: true })
      return Response.json({
        context: outcome.run.context,
        model: outcome.run.model,
        provider: outcome.run.provider,
        catalogue: aiCatalog,
      })
    }
    // Old workers cannot change a newer turn, and stopped/terminal runs cannot become active again.
    if (
      input.action === "proposal" &&
      (run.status !== "running" || run.triggerRunId !== input.triggerRunId)
    )
      return new Response(null, { status: 409 })
    if (
      input.action === "proposal" &&
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
          messages: input.messages,
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
      const outcome = await handleGenerationCommand({
        type: "heartbeat",
        runId: run.id,
        triggerRunId: input.triggerRunId,
        answer: input.answer,
      })
      if (outcome.kind === "obsolete")
        return new Response(null, { status: 409 })
    } else {
      const outcome = await handleGenerationCommand({
        type: "complete",
        runId: run.id,
        triggerRunId: input.triggerRunId,
        answer: input.answer,
        status: input.status,
        inputTokens: input.inputTokens,
        outputTokens: input.outputTokens,
      })
      if (outcome.kind === "obsolete")
        return new Response(null, { status: 409 })
    }
    return Response.json({ ok: true })
  } catch {
    // Never echo signatures, documents, provider exceptions or request bodies.
    return Response.json({ error: "Callback refusé." }, { status: 403 })
  }
}
