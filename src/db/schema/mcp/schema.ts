import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { user } from "@/db/schema/auth/schema"

export const mcpRevocationCleanup = pgTable(
  "mcp_revocation_cleanup",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    clientId: text("client_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("mcp_revocation_cleanup_user_client_idx").on(
      table.userId,
      table.clientId
    ),
  ]
)
