import { scenariosSchema } from "@/validators/sites/scenarios"

import type { SiteDocument } from "@/validators/sites/document"

export const scenariosPath = "src/scenarios.json"

export const readScenarios = (doc: SiteDocument) => {
  const content = doc.files[scenariosPath]
  if (!content) return null
  return scenariosSchema.parse(JSON.parse(content))
}

export const scenarioDocument = (
  doc: SiteDocument,
  id: string
): SiteDocument => {
  const config = readScenarios(doc)
  if (!config || !config.scenarios.some((scenario) => scenario.id === id))
    return doc
  return {
    ...doc,
    files: {
      ...doc.files,
      [scenariosPath]: JSON.stringify({ ...config, defaultId: id }, null, 2),
    },
  }
}
