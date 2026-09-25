import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  boolean,
  uniqueIndex,
} from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import type { UIMessage } from "ai"

import type { ProposalInput } from "@/validators/ai/operations"
import type { AiRunStatus, RunContext } from "@/features/ai/types"

import { user } from "@/db/schema/auth/schema"

import { mockups } from "@/db/schema/mockups/schema"

// Legacy connection preferences retained for migration compatibility; no credentials.
export const aiConnections = pgTable("ai_connections", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  enabled: boolean("enabled").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const aiConversations = pgTable(
  "ai_conversations",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    mockupId: text("mockup_id")
      .notNull()
      .references(() => mockups.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    transcript: jsonb("transcript").$type<UIMessage[]>().notNull().default([]),
    transcriptState: jsonb("transcript_state").$type<unknown>(),
    lastEventId: text("last_event_id"),
    triggerSessionId: text("trigger_session_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("ai_conversations_owner_idx").on(
      table.userId,
      table.mockupId,
      table.updatedAt
    ),
  ]
)

export const aiRuns = pgTable(
  "ai_runs",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => aiConversations.id, { onDelete: "cascade" }),
    requestId: text("request_id").notNull(),
    model: text("model").notNull(),
    provider: text("provider").notNull().default("legacy"),
    triggerRunId: text("trigger_run_id"),
    startedAt: timestamp("started_at", { withTimezone: true }),
    inputTokens: integer("input_tokens"),
    outputTokens: integer("output_tokens"),
    prompt: text("prompt").notNull(),
    answer: text("answer").notNull().default(""),
    context: jsonb("context").$type<RunContext>().notNull(),
    status: text("status").$type<AiRunStatus>().notNull().default("queued"),
    error: text("error"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("ai_runs_idempotency_idx").on(table.userId, table.requestId),
    uniqueIndex("ai_runs_active_user_idx")
      .on(table.userId)
      .where(sql`${table.status} IN ('queued', 'running')`),
    index("ai_runs_conversation_idx").on(table.conversationId, table.createdAt),
    index("ai_runs_queue_idx").on(table.status, table.createdAt),
  ]
)

export const aiProposals = pgTable(
  "ai_proposals",
  {
    id: text("id").primaryKey(),
    runId: text("run_id")
      .notNull()
      .references(() => aiRuns.id, { onDelete: "cascade" }),
    toolCallId: text("tool_call_id").notNull(),
    input: jsonb("input").$type<ProposalInput>().notNull(),
    baseRevision: integer("base_revision").notNull(),
    baseHash: text("base_hash").notNull(),
    resultHash: text("result_hash").notNull(),
    status: text("status")
      .$type<"pending" | "applied" | "rejected">()
      .notNull()
      .default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("ai_proposals_tool_idx").on(table.runId, table.toolCallId),
  ]
)

// Short-lived nonce receipts; never stores callback bodies, prompts or credentials.
export const aiCallbackReceipts = pgTable(
  "ai_callback_receipts",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (table) => [index("ai_callback_receipts_expiry_idx").on(table.expiresAt)]
)
