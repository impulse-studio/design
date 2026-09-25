import { v4 as uuid } from "uuid"
import type { AiRunRow } from "@/db/schema/ai"
import { findSite } from "@/features/sites/repository.server"
import { createHash } from "node:crypto"
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm"
import { getDatabase } from "@/db/client.server"
import { aiConversations, aiProposals, aiRuns } from "@/db/schema"
import { prepareMockupProposal } from "@/features/mockups/proposal"
import { projectGenerationConversation } from "@/features/chat/projection"
import { studioAiAccess } from "./access.server"
import { canonicalDocument } from "./operations"
import type { AiSnapshot, RunContext } from "./types"
import {
  activeGenerationStatuses,
  claimNextGeneration,
} from "./generation.server"
import { AiFailure } from "./errors"

export const documentHash = (doc: unknown) =>
  createHash("sha256").update(canonicalDocument(doc)).digest("hex")
const activeStatuses = activeGenerationStatuses
export const claimRun = claimNextGeneration
export const requireConversation = async (userId: string, id: string) => {
  const row = await getDatabase()
    .select()
    .from(aiConversations)
    .where(and(eq(aiConversations.id, id), eq(aiConversations.userId, userId)))
    .then((rows) => rows.at(0))
  if (!row) throw new AiFailure("not_found", "Conversation introuvable.")
  await studioAiAccess.requireMockup(userId, row.mockupId, "read")
  return row
}
export const createConversation = async (userId: string, mockupId: string) => {
  await studioAiAccess.requireMockup(userId, mockupId, "read")
  const id = uuid()
  await getDatabase()
    .insert(aiConversations)
    .values({ id, userId, mockupId, title: "Nouvelle conversation" })
  return { id }
}
export const getSnapshot = async (
  userId: string,
  mockupId: string,
  conversationId?: string
): Promise<AiSnapshot> => {
  await studioAiAccess.requireMockup(userId, mockupId, "read")
  const conversations = await getDatabase()
    .select()
    .from(aiConversations)
    .where(
      and(
        eq(aiConversations.userId, userId),
        eq(aiConversations.mockupId, mockupId)
      )
    )
    .orderBy(desc(aiConversations.updatedAt))
    .limit(100)
  const id = conversationId ?? conversations.at(0)?.id
  if (id && !conversations.some((row) => row.id === id))
    throw new AiFailure("not_found", "Conversation introuvable.")
  const runs = id
    ? await getDatabase()
        .select()
        .from(aiRuns)
        .where(and(eq(aiRuns.userId, userId), eq(aiRuns.conversationId, id)))
        .orderBy(asc(aiRuns.createdAt))
        .limit(200)
    : []
  const proposals = runs.length
    ? await getDatabase()
        .select()
        .from(aiProposals)
        .where(
          inArray(
            aiProposals.runId,
            runs.map((run) => run.id)
          )
        )
        .orderBy(asc(aiProposals.createdAt))
    : []
  const last = runs.at(-1)
  return {
    sessionStarted: Boolean(
      conversations.find((row) => row.id === id)?.triggerSessionId
    ),
    uiMessages: conversations.find((row) => row.id === id)?.transcript ?? [],
    lastEventId:
      conversations.find((row) => row.id === id)?.lastEventId ?? undefined,
    usage: runs.map((run) => ({
      provider: run.provider,
      model: run.model,
      inputTokens: run.inputTokens,
      outputTokens: run.outputTokens,
      createdAt: run.createdAt.toISOString(),
    })),
    conversations: conversations.map((row) => ({
      id: row.id,
      title: row.title,
      updatedAt: row.updatedAt.toISOString(),
    })),
    conversationId: id ?? null,
    messages: projectGenerationConversation(runs),
    proposals: proposals.map((row) => ({
      ...row.input,
      id: row.id,
      runId: row.runId,
      baseRevision: row.baseRevision,
      baseHash: row.baseHash,
      resultHash: row.resultHash,
      status: row.status,
    })),
    run: last ? { id: last.id, status: last.status, error: last.error } : null,
  }
}
export const enqueueRun = async (
  userId: string,
  input: {
    conversationId: string
    requestId: string
    model: string
    provider?: string
    prompt: string
    docHash: string
    selectedIds: string[]
    activeRoute?: string
  }
) => {
  const conversation = await requireConversation(userId, input.conversationId)
  const record = await studioAiAccess.requireMockup(
    userId,
    conversation.mockupId,
    "read"
  )
  const project = await findSite(record.id)
  if (project && !record.canEdit)
    throw new AiFailure("forbidden", "Cette maquette est en lecture seule.")
  const hash = documentHash(project?.doc ?? record.doc)
  return getDatabase().transaction(async (tx) => {
    await tx.execute(
      sql`SELECT pg_advisory_xact_lock(hashtext(${`digit-ai:${userId}`}))`
    )
    await tx.execute(
      sql`SELECT pg_advisory_xact_lock(hashtext(${`ai-conversation:${conversation.id}`}))`
    )
    const existing = await tx
      .select()
      .from(aiRuns)
      .where(
        and(eq(aiRuns.userId, userId), eq(aiRuns.requestId, input.requestId))
      )
      .then((rows) => rows.at(0))
    if (existing) {
      if (
        existing.conversationId !== input.conversationId ||
        existing.prompt !== input.prompt ||
        existing.model !== input.model ||
        existing.context.hash !== input.docHash ||
        canonicalDocument(existing.context.selectedIds) !==
          canonicalDocument(input.selectedIds)
      )
        throw new AiFailure("conflict", "Identifiant d’envoi déjà utilisé.")
      return { id: existing.id }
    }
    if (hash !== input.docHash)
      throw new AiFailure(
        "conflict",
        "Enregistrez la maquette avant d’envoyer le message. Une modification ou un conflit est en attente."
      )
    const active = await tx
      .select({ id: aiRuns.id })
      .from(aiRuns)
      .where(
        and(
          eq(aiRuns.userId, userId),
          inArray(aiRuns.status, [...activeStatuses])
        )
      )
      .then((rows) => rows.at(0))
    if (active)
      throw new AiFailure(
        "conflict",
        "Une génération est déjà en cours pour votre compte."
      )
    const count = await tx
      .select({ count: sql<number>`count(*)::int` })
      .from(aiRuns)
      .where(eq(aiRuns.conversationId, conversation.id))
    if (count[0].count >= 200)
      throw new AiFailure(
        "limit",
        "Créez une nouvelle conversation pour continuer."
      )
    const context: RunContext = {
      doc: record.doc,
      revision: project?.revision ?? record.revision,
      ...(project
        ? {
            project: project.doc,
            projectId: project.id,
            activeRoute: input.activeRoute ?? "/",
          }
        : {}),
      hash,
      selectedIds: input.selectedIds,
    }
    const id = uuid()
    await tx.insert(aiRuns).values({
      id,
      userId,
      conversationId: conversation.id,
      requestId: input.requestId,
      model: input.model,
      provider: input.provider ?? "legacy",
      prompt: input.prompt,
      context,
    })
    await tx
      .update(aiConversations)
      .set({
        title: count[0].count ? conversation.title : input.prompt.slice(0, 80),
        updatedAt: new Date(),
      })
      .where(eq(aiConversations.id, conversation.id))
    return { id }
  })
}
export const persistProposal = async (
  run: AiRunRow,
  callId: string,
  args: unknown
) => {
  const active = await getDatabase()
    .select()
    .from(aiRuns)
    .where(and(eq(aiRuns.id, run.id), eq(aiRuns.status, "running")))
    .then((rows) => rows.at(0))
  if (!active) throw new AiFailure("conflict", "Génération arrêtée.")
  const { doc: result, input } = prepareMockupProposal(run.context.doc, args)
  const id = uuid()
  await getDatabase()
    .insert(aiProposals)
    .values({
      id,
      runId: run.id,
      toolCallId: callId,
      input,
      baseRevision: run.context.revision,
      baseHash: run.context.hash,
      resultHash: documentHash(result),
    })
    .onConflictDoNothing()
  const saved = await getDatabase()
    .select()
    .from(aiProposals)
    .where(
      and(eq(aiProposals.runId, run.id), eq(aiProposals.toolCallId, callId))
    )
    .then((rows) => rows[0])
  return {
    proposalId: saved.id,
    status: "pending",
    message:
      "Proposition validée. Elle sera appliquée uniquement par l’utilisateur avec le bouton Appliquer.",
  }
}
const requireProposal = async (userId: string, id: string) => {
  const row = await getDatabase()
    .select({
      proposal: aiProposals,
      run: aiRuns,
      conversation: aiConversations,
    })
    .from(aiProposals)
    .innerJoin(aiRuns, eq(aiRuns.id, aiProposals.runId))
    .innerJoin(aiConversations, eq(aiConversations.id, aiRuns.conversationId))
    .where(and(eq(aiProposals.id, id), eq(aiRuns.userId, userId)))
    .then((rows) => rows.at(0))
  if (!row) throw new AiFailure("not_found", "Proposition introuvable.")
  return row
}
export const prepareProposal = async (
  userId: string,
  id: string,
  currentHash: string
) => {
  const { proposal, run, conversation } = await requireProposal(userId, id)
  const record = await studioAiAccess.requireMockup(
    userId,
    conversation.mockupId,
    "write"
  )
  if (proposal.status !== "pending")
    throw new AiFailure("conflict", "Cette proposition a déjà été traitée.")
  const savedHash = documentHash(record.doc)
  // A lost acknowledgement must not reapply the same edit after a reload.
  if (savedHash === proposal.resultHash && currentHash === proposal.resultHash)
    return {
      doc: record.doc,
      baseHash: proposal.baseHash,
      resultHash: proposal.resultHash,
      alreadyApplied: true,
    }
  if (
    record.revision !== proposal.baseRevision ||
    savedHash !== proposal.baseHash ||
    currentHash !== proposal.baseHash
  )
    throw new AiFailure(
      "conflict",
      "La maquette a changé. Demandez une nouvelle proposition."
    )
  const { doc } = prepareMockupProposal(run.context.doc, proposal.input)
  return {
    doc,
    baseHash: proposal.baseHash,
    resultHash: proposal.resultHash,
    alreadyApplied: false,
  }
}
export const decideProposal = async (
  userId: string,
  id: string,
  decision: "applied" | "rejected"
) => {
  const { proposal, conversation } = await requireProposal(userId, id)
  const record = await studioAiAccess.requireMockup(
    userId,
    conversation.mockupId,
    "write"
  )
  if (
    decision === "applied" &&
    documentHash(record.doc) !== proposal.resultHash
  )
    throw new AiFailure(
      "conflict",
      "La sauvegarde de la proposition n’est pas terminée."
    )
  await getDatabase()
    .update(aiProposals)
    .set({ status: decision })
    .where(and(eq(aiProposals.id, id), eq(aiProposals.status, "pending")))
}
