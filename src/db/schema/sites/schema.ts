import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core"

import type { SiteDocument, SiteProposal } from "@/validators/sites/document"

import { mockups } from "@/db/schema/mockups/schema"
import { aiRuns } from "@/db/schema/ai/schema"

// File-backed React projects coexist with legacy mockup documents.
export const siteProjects = pgTable("site_projects", {
  id: text("id")
    .primaryKey()
    .references(() => mockups.id, { onDelete: "cascade" }),
  doc: jsonb("doc").$type<SiteDocument>().notNull(),
  revision: integer("revision").notNull().default(0),
})

export const siteVersions = pgTable(
  "site_versions",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => siteProjects.id, { onDelete: "cascade" }),
    revision: integer("revision").notNull(),
    doc: jsonb("doc").$type<SiteDocument>().notNull(),
    summary: text("summary").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("site_version_revision_idx").on(
      table.projectId,
      table.revision
    ),
  ]
)

export const siteProposals = pgTable(
  "site_proposals",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => siteProjects.id, { onDelete: "cascade" }),
    runId: text("run_id")
      .notNull()
      .references(() => aiRuns.id, { onDelete: "cascade" }),
    toolCallId: text("tool_call_id").notNull(),
    baseRevision: integer("base_revision").notNull(),
    input: jsonb("input").$type<SiteProposal>().notNull(),
    status: text("status").notNull().default("pending"),
  },
  (table) => [
    uniqueIndex("site_proposal_call_idx").on(table.runId, table.toolCallId),
  ]
)
