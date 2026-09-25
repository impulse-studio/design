import {
  index,
  integer,
  jsonb,
  pgTable,
  pgEnum,
  text,
  timestamp,
} from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

import type { MockupDoc } from "@digit-ai-studio/shared"

import { organization } from "@/db/schema/teams/schema"
import { projects } from "@/db/schema/projects/schema"

export const mockupStatus = pgEnum("mockup_status", [
  "draft",
  "in_progress",
  "in_review",
  "approved",
])

export const mockups = pgTable(
  "mockups",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id").references(() => organization.id, {
      onDelete: "restrict",
    }),
    projectId: text("project_id").references(() => projects.id, {
      onDelete: "set null",
    }),
    name: text("name").notNull(),
    notionUrl: text("notion_url"),
    githubUrl: text("github_url"),
    status: mockupStatus("status").notNull().default("draft"),
    revision: integer("revision").notNull().default(0),
    doc: jsonb("doc").$type<MockupDoc>().notNull(),
    libVersion: text("lib_version").notNull().default("dev"),
    thumbnailUrl: text("thumbnail_url"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("mockups_organization_updated_idx").on(
      table.organizationId,
      table.updatedAt.desc()
    ),
    index("mockups_updated_idx")
      .on(table.updatedAt.desc())
      .where(sql`${table.deletedAt} IS NULL`),
    index("mockups_project_updated_idx")
      .on(table.projectId, table.updatedAt.desc())
      .where(sql`${table.deletedAt} IS NULL`),
  ]
)
