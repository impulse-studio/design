import "dotenv/config"
import { z } from "zod"

export const environmentSchema = z.object({
  BETTER_AUTH_URL: z.url().refine((value) => {
    const url = new URL(value)
    return (
      ["http:", "https:"].includes(url.protocol) &&
      url.pathname === "/" &&
      !url.search &&
      !url.hash &&
      !url.username &&
      !url.password
    )
  }),
  BETTER_AUTH_SECRET: z.string().min(32),
  GOOGLE_CLIENT_ID: z.string().trim().default(""),
  GOOGLE_CLIENT_SECRET: z.string().trim().default(""),
  DEV_AUTH_PASSWORD: z.string().default(""),
})
