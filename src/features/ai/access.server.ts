import { readCurrentUser } from "@/features/auth/session.server"
import { loadRecord } from "@/features/mockups/repository.server"

/** The only integration point with studio identity and permissions. No anonymous fallback. */
export const studioAiAccess = {
  requireUser: async () => {
    const user = await readCurrentUser()
    if (!user)
      throw new Response("Connexion au studio requise.", { status: 401 })
    return { userId: user.id }
  },
  requireMockup: async (
    userId: string,
    mockupId: string,
    action: "read" | "write"
  ) => {
    const record = await loadRecord(mockupId, userId)
    if (action === "write" && !record.canEdit)
      throw new Response("Maquette en lecture seule.", { status: 403 })
    return record
  },
}
