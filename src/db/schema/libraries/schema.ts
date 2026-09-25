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

import type { LibrarySnapshot } from "@/validators/libraries/payload"
import { user } from "@/db/schema/auth/schema"
import { organization } from "@/db/schema/teams/schema"

export const teamLibraries = pgTable(
  "team_libraries",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    framework: text("framework").notNull(),
    version: integer("version").notNull().default(0),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("team_libraries_organization_idx").on(table.organizationId)]
)

export const libraryVersions = pgTable(
  "library_versions",
  {
    id: text("id").primaryKey(),
    libraryId: text("library_id")
      .notNull()
      .references(() => teamLibraries.id, { onDelete: "cascade" }),
    version: integer("version").notNull(),
    snapshot: jsonb("snapshot").$type<LibrarySnapshot>().notNull(),
    createdBy: text("created_by").references(() => user.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("library_versions_number_idx").on(
      table.libraryId,
      table.version
    ),
  ]
)

export const libraryConnections = pgTable(
  "library_connections",
  {
    id: text("id").primaryKey(),
    libraryId: text("library_id")
      .notNull()
      .references(() => teamLibraries.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull().unique(),
    claimed: boolean("claimed").notNull().default(false),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }),
    lastSuccessAt: timestamp("last_success_at", { withTimezone: true }),
    error: text("error"),
    digest: text("digest"),
  },
  (table) => [index("library_connections_library_idx").on(table.libraryId)]
)
