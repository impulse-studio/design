import { v4 as uuid } from "uuid"

import { getDatabase } from "@/db/client.server"

import { SiteFailure } from "@/features/sites/errors"
import { normalizeSources } from "@/features/sites/source"
import { commitSiteVersion } from "@/features/sites/versioning.server"
import { applyLibrary, compareLibrary } from "./merge"
import { discoverComponents } from "./import"
import { librarySnapshotSchema } from "@/validators/libraries/payload"
import {
  importLibrarySchema,
  libraryUpdateSchema,
} from "@/validators/libraries/requests"
import { requireLibraryAccess, projectOrganization } from "./access.server"
import {
  listLibraryRecords,
  persistLibrarySnapshot,
  findLibraryVersion,
  findLibraryProject,
} from "./repository.server"

export const listLibraries = async (organizationId: string, userId: string) => {
  const access = await requireLibraryAccess(organizationId, userId)
  const items = await listLibraryRecords(organizationId)
  return {
    organizationId,
    canManage: access.role === "owner" || access.canManageLibraries,
    items,
  }
}

export const publishLibrary = async (
  organizationId: string,
  userId: string,
  raw: unknown
) => {
  await requireLibraryAccess(organizationId, userId, true)
  const input = importLibrarySchema.parse(raw)
  const payload = {
    ...input.payload,
    components: input.payload.components.length
      ? input.payload.components
      : discoverComponents(input.payload.files, input.payload.framework),
  }
  const libraryId = input.libraryId ?? uuid()
  const snapshot = librarySnapshotSchema.parse({
    id: uuid(),
    libraryId,
    name: input.name,
    version: input.expectedVersion + 1,
    payload,
  })
  return getDatabase().transaction(async (tx) => {
    await requireLibraryAccess(organizationId, userId, true, tx)
    await persistLibrarySnapshot(tx, organizationId, userId, input, snapshot)
    return snapshot
  })
}

const readAccessibleLibraryVersion = async (
  versionId: string,
  organizationId: string,
  userId: string
) => {
  await requireLibraryAccess(organizationId, userId)
  return findLibraryVersion(versionId, organizationId)
}

export const previewLibraryUpdate = async (userId: string, raw: unknown) => {
  const input = libraryUpdateSchema.parse(raw)
  const organizationId = await projectOrganization(input.projectId, userId)
  const snapshot = await readAccessibleLibraryVersion(
    input.versionId,
    organizationId,
    userId
  )
  const project = await findLibraryProject(input.projectId)
  if (!project || project.revision !== input.expectedRevision)
    throw new SiteFailure(
      "conflict",
      "Le projet a changé. Rechargez la comparaison."
    )
  return {
    snapshot,
    differences: compareLibrary(normalizeSources(project.doc), snapshot),
  }
}

export const installLibrary = async (userId: string, raw: unknown) => {
  const input = libraryUpdateSchema.parse(raw)
  const { snapshot } = await previewLibraryUpdate(userId, input)
  const organizationId = await projectOrganization(input.projectId, userId)
  return commitSiteVersion({
    id: input.projectId,
    userId,
    expectedRevision: input.expectedRevision,
    prepare: async (tx, current) => {
      const access = await requireLibraryAccess(
        organizationId,
        userId,
        false,
        tx
      )
      if (!["owner", "admin", "member"].includes(access.role))
        throw new SiteFailure("forbidden", "Projet en lecture seule.")
      return {
        doc: applyLibrary(current.doc, snapshot, input.resolutions),
        summary: `${snapshot.name} · version ${snapshot.version}`,
      }
    },
  })
}
