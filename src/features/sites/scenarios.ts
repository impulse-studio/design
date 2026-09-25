import { z } from "zod"
import type { SiteDocument } from "./schema"

export const scenariosPath = "src/scenarios.json"
export const scenariosSchema = z
  .object({
    defaultId: z.string().min(1),
    scenarios: z
      .array(
        z.object({
          id: z.string().min(1).max(100),
          name: z.string().min(1).max(150),
          description: z.string().max(500).optional(),
          path: z
            .string()
            .regex(/^\/(?!\/)[^<>\s?#]*$/)
            .default("/"),
          data: z.record(z.string(), z.json()),
        })
      )
      .min(1)
      .max(30),
  })
  .superRefine((value, context) => {
    const ids = value.scenarios.map((scenario) => scenario.id)
    if (new Set(ids).size !== ids.length || !ids.includes(value.defaultId)) {
      context.addIssue({
        code: "custom",
        message:
          "Les scénarios doivent avoir des identifiants uniques et un scénario par défaut valide.",
      })
    }
  })
export type SiteScenario = z.infer<typeof scenariosSchema>["scenarios"][number]

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
