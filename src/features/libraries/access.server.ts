import { getDatabase } from "@/db/client.server"
import type { Database, Transaction } from "@/db/types"
import { loadRecord } from "@/features/mockups/repository.server"
import {
  findLibraryMembership,
  findProjectOrganization,
} from "./repository.server"

export const requireLibraryAccess = async (
  organizationId: string,
  userId: string,
  write = false,
  db: Database | Transaction = getDatabase()
) => {
  const row = await findLibraryMembership(organizationId, userId, db)
  if (!row || (write && row.role !== "owner" && !row.canManageLibraries))
    throw new Error("Accès aux bibliothèques non autorisé.")
  return row
}
export const projectOrganization = async (id: string, userId: string) => {
  await loadRecord(id, userId)
  const row = await findProjectOrganization(id)
  if (!row?.organizationId) throw new Error("Équipe du projet introuvable.")
  return row.organizationId
}
