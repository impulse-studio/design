import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

import { organization } from "@/db/schema/teams/schema"

export const projects = pgTable(
  "projects",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    ownerId: text("owner_id"),
    organizationId: text("organization_id").references(() => organization.id, {
      onDelete: "restrict",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("projects_owner_updated_idx")
      .on(table.ownerId, table.updatedAt.desc())
      .where(sql`${table.deletedAt} IS NULL`),
  ]
)
