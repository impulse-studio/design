import { hashPassword } from "better-auth/crypto"
import { isNull } from "drizzle-orm"
import { getDatabase } from "@/db/client.server"
import {
  account,
  member,
  mockups,
  organization,
  projects,
  user,
} from "@/db/schema"
import { getAuthEnvironment } from "./config.server"

export const DEV_USER_ID = "digit-local-developer"
export const DEV_USER_EMAIL = "dev@digitevent.com"
export const DEV_TEAM_ID = "digit-local-team"

export const seedDevelopmentAccount = async () => {
  const env = getAuthEnvironment()
  if (!env?.devMode) throw new Error("Compte de développement indisponible.")
  const databaseURL =
    process.env.DATABASE_URL ??
    "postgresql://digit:digit_dev@localhost:5433/digit_ai_studio"
  if (
    !["localhost", "127.0.0.1", "[::1]"].includes(new URL(databaseURL).hostname)
  )
    throw new Error("Le compte de développement nécessite une base locale.")
  const password = await hashPassword(env.DEV_AUTH_PASSWORD)
  await getDatabase().transaction(async (db) => {
    await db
      .insert(user)
      .values({
        id: DEV_USER_ID,
        email: DEV_USER_EMAIL,
        name: "Développeur local",
        emailVerified: true,
      })
      .onConflictDoNothing({ target: user.id })
    await db
      .insert(account)
      .values({
        id: "digit-local-credentials",
        accountId: DEV_USER_ID,
        userId: DEV_USER_ID,
        providerId: "credential",
        password,
      })
      .onConflictDoUpdate({
        target: account.id,
        set: { password, updatedAt: new Date() },
      })
    await db
      .insert(organization)
      .values({
        id: DEV_TEAM_ID,
        name: "Digitevent · Développement",
        slug: "digitevent-dev",
      })
      .onConflictDoNothing({ target: organization.id })
    await db
      .insert(member)
      .values({
        id: "digit-local-owner",
        organizationId: DEV_TEAM_ID,
        userId: DEV_USER_ID,
        role: "owner",
      })
      .onConflictDoNothing()
    // Keep pre-authentication local mockups accessible to their developer.
    await db
      .update(projects)
      .set({ organizationId: DEV_TEAM_ID })
      .where(isNull(projects.organizationId))
    await db
      .update(mockups)
      .set({ organizationId: DEV_TEAM_ID })
      .where(isNull(mockups.organizationId))
  })
  return { email: DEV_USER_EMAIL, password: env.DEV_AUTH_PASSWORD }
}
