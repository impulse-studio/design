import "dotenv/config"
import { createServerOnlyFn } from "@tanstack/react-start"
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

let database: ReturnType<typeof drizzle<typeof schema>> | undefined
export const getDatabase = createServerOnlyFn(() => {
  if (!database) {
    const pool = new Pool({
      connectionString:
        process.env.DATABASE_URL ??
        "postgresql://digit:digit_dev@localhost:5433/digit_ai_studio",
      max: 5,
      connectionTimeoutMillis: 3000,
    })
    database = drizzle(pool, { schema })
  }
  return database
})
