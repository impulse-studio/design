import type { AiRunRow } from "@/db/schema/ai"
import { and, asc, eq, inArray, lt, or, sql } from "drizzle-orm"
import { getDatabase } from "@/db/client.server"
import { aiRuns } from "@/db/schema"

export const activeGenerationStatuses = ["queued", "running"] as const

type GenerationCommand =
  | { type: "begin"; runId: string; triggerRunId: string }
  | {
      type: "heartbeat"
      runId: string
      triggerRunId: string
      answer: string
    }
  | {
      type: "complete"
      runId: string
      triggerRunId: string
      answer?: string
      status: "completed" | "failed" | "interrupted"
      inputTokens: number | null
      outputTokens: number | null
    }
  | { type: "recover"; conversationId: string; triggerRunId: string }
  | { type: "interrupt"; userId: string; runId: string }
  | { type: "expire"; now?: Date }

export type GenerationOutcome =
  | { kind: "admitted"; run: AiRunRow }
  | { kind: "waiting" }
  | { kind: "interrupted"; runs: Array<AiRunRow> }
  | { kind: "accepted" }
  | { kind: "obsolete" }

export const claimNextGeneration = async (
  runId?: string,
  triggerRunId?: string
) =>
  getDatabase().transaction(async (tx) => {
    const now = new Date()
    await tx.execute(sql`SELECT pg_advisory_xact_lock(714032)`)
    await tx
      .update(aiRuns)
      .set({
        status: "interrupted",
        error:
          "La connexion au serveur a été interrompue. Vous pouvez envoyer un nouveau message.",
        updatedAt: now,
      })
      .where(
        and(
          eq(aiRuns.status, "running"),
          lt(aiRuns.updatedAt, new Date(now.getTime() - 60_000))
        )
      )
    const running = await tx
      .select({ id: aiRuns.id })
      .from(aiRuns)
      .where(eq(aiRuns.status, "running"))
    if (running.length >= 2) return null
    const next = await tx
      .select()
      .from(aiRuns)
      .where(
        and(
          eq(aiRuns.status, "queued"),
          runId ? eq(aiRuns.id, runId) : undefined
        )
      )
      .orderBy(asc(aiRuns.createdAt))
      .limit(1)
      .for("update", { skipLocked: true })
      .then((rows) => rows.at(0))
    if (!next) return null
    return tx
      .update(aiRuns)
      .set({
        status: "running",
        startedAt: now,
        updatedAt: now,
        ...(triggerRunId ? { triggerRunId } : {}),
      })
      .where(and(eq(aiRuns.id, next.id), eq(aiRuns.status, "queued")))
      .returning()
      .then((rows) => rows.at(0) ?? null)
  })

export const handleGenerationCommand = async (
  command: GenerationCommand
): Promise<GenerationOutcome> => {
  const db = getDatabase()
  if (command.type === "begin") {
    const existing = await db
      .select()
      .from(aiRuns)
      .where(eq(aiRuns.id, command.runId))
      .then((rows) => rows.at(0))
    if (!existing || existing.status !== "queued")
      return { kind: "interrupted", runs: existing ? [existing] : [] }
    if (Date.now() - existing.createdAt.getTime() > 600_000) {
      const runs = await db
        .update(aiRuns)
        .set({
          status: "interrupted",
          error:
            "Génération interrompue. Vous pouvez envoyer un nouveau message.",
          updatedAt: new Date(),
        })
        .where(and(eq(aiRuns.id, existing.id), eq(aiRuns.status, "queued")))
        .returning()
      return { kind: "interrupted", runs }
    }
    const run = await claimNextGeneration(command.runId, command.triggerRunId)
    if (run) return { kind: "admitted", run }
    const current = await db
      .select({ status: aiRuns.status })
      .from(aiRuns)
      .where(eq(aiRuns.id, command.runId))
      .then((rows) => rows.at(0))
    return current?.status === "queued"
      ? { kind: "waiting" }
      : { kind: "interrupted", runs: [] }
  }

  if (command.type === "recover") {
    const runs = await db
      .update(aiRuns)
      .set({
        status: "interrupted",
        error: "Génération interrompue après redémarrage.",
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(aiRuns.conversationId, command.conversationId),
          eq(aiRuns.triggerRunId, command.triggerRunId),
          inArray(aiRuns.status, [...activeGenerationStatuses])
        )
      )
      .returning()
    return { kind: "interrupted", runs }
  }

  if (command.type === "interrupt") {
    const runs = await db
      .update(aiRuns)
      .set({
        status: "interrupted",
        error: "Génération arrêtée.",
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(aiRuns.userId, command.userId),
          eq(aiRuns.id, command.runId),
          inArray(aiRuns.status, [...activeGenerationStatuses])
        )
      )
      .returning()
    return { kind: "interrupted", runs }
  }

  if (command.type === "expire") {
    const now = command.now ?? new Date()
    const runs = await db
      .update(aiRuns)
      .set({
        status: "interrupted",
        error:
          "Génération interrompue. Vous pouvez envoyer un nouveau message.",
        updatedAt: now,
      })
      .where(
        or(
          and(
            eq(aiRuns.status, "running"),
            or(
              lt(aiRuns.updatedAt, new Date(now.getTime() - 60_000)),
              lt(aiRuns.startedAt, new Date(now.getTime() - 600_000))
            )
          ),
          and(
            eq(aiRuns.status, "queued"),
            lt(aiRuns.createdAt, new Date(now.getTime() - 600_000))
          )
        )
      )
      .returning()
    return { kind: "interrupted", runs }
  }

  const current = await db
    .select()
    .from(aiRuns)
    .where(eq(aiRuns.id, command.runId))
    .then((rows) => rows.at(0))
  if (
    !current ||
    current.triggerRunId !== command.triggerRunId ||
    (current.startedAt && Date.now() - current.startedAt.getTime() > 600_000) ||
    (current.status !== "running" &&
      !(command.type === "complete" && current.status === "interrupted"))
  )
    return { kind: "obsolete" }

  if (command.type === "heartbeat") {
    const updated = await db
      .update(aiRuns)
      .set({ answer: command.answer || current.answer, updatedAt: new Date() })
      .where(
        and(
          eq(aiRuns.id, current.id),
          eq(aiRuns.status, "running"),
          eq(aiRuns.triggerRunId, command.triggerRunId)
        )
      )
      .returning({ id: aiRuns.id })
    return updated.length ? { kind: "accepted" } : { kind: "obsolete" }
  }

  const status =
    current.status === "interrupted" ? "interrupted" : command.status
  const updated = await db
    .update(aiRuns)
    .set({
      answer: command.answer ?? current.answer,
      status,
      inputTokens: command.inputTokens,
      outputTokens: command.outputTokens,
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
        eq(aiRuns.id, current.id),
        eq(aiRuns.triggerRunId, command.triggerRunId),
        inArray(aiRuns.status, ["running", "interrupted"])
      )
    )
    .returning({ id: aiRuns.id })
  return updated.length ? { kind: "accepted" } : { kind: "obsolete" }
}
