import "dotenv/config"
import { z } from "zod"

const environmentSchema = z.object({
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

export type AuthEnvironment = z.infer<typeof environmentSchema> & {
  devMode: boolean
}

export const isDevelopmentAuthEnabled = () => {
  if (
    process.env.NODE_ENV !== "development" ||
    process.env.AUTH_DEV_MODE !== "true"
  )
    return false
  try {
    return ["localhost", "127.0.0.1", "[::1]"].includes(
      new URL(process.env.BETTER_AUTH_URL ?? "").hostname
    )
  } catch {
    return false
  }
}

export const getAuthEnvironment = (): AuthEnvironment | null => {
  const result = environmentSchema.safeParse(process.env)
  if (!result.success) return null
  const devMode = isDevelopmentAuthEnabled()
  if (
    devMode
      ? result.data.DEV_AUTH_PASSWORD.length < 32
      : !result.data.GOOGLE_CLIENT_ID || !result.data.GOOGLE_CLIENT_SECRET
  )
    return null
  return { ...result.data, devMode }
}
