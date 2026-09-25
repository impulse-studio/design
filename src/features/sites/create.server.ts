import { v4 as uuid } from "uuid"

import { getDatabase } from "@/db/client.server"
import { mockups } from "@/db/schema"
import { emptyDocument } from "@/features/editor/document"
import type { SiteKind } from "@/validators/sites/kind"
import { createSiteDocument } from "./scaffold.server"
import { initializeSiteVersion } from "./versioning.server"

export type CreateSiteInput = {
  name: string
  organizationId: string
  kind?: SiteKind
}

export type CreatedSite = {
  id: string
  revision: 0
  doc: Awaited<ReturnType<typeof createSiteDocument>>
}

export const createSite = async ({
  name,
  organizationId,
  kind = "react-vite",
}: CreateSiteInput): Promise<CreatedSite> => {
  const id = uuid()
  let doc = await createSiteDocument(kind)

  await getDatabase().transaction(async (tx) => {
    await tx.insert(mockups).values({
      id,
      name,
      organizationId,
      doc: emptyDocument(),
    })
    doc = await initializeSiteVersion(tx, id, doc)
  })

  return { id, revision: 0, doc }
}
