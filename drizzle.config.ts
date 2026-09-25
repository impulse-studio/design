import "dotenv/config"
import { defineConfig } from "drizzle-kit"

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://digit:digit_dev@localhost:5433/digit_ai_studio",
  },
})
