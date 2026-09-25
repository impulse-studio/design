import { useMemo } from "react"
import { elementsOf } from "@/features/sites/source"
import type { SiteElementStatus } from "@/features/sites/source"
import { readScenarios, scenarioDocument } from "@/features/sites/scenarios"
import type { SiteRecord } from "@/features/sites/schema"

export function useSiteEditorPageData({
  initial,
  record,
  scenarioId,
  selection,
}: {
  initial: SiteRecord
  record: SiteRecord
  scenarioId: string
  selection: string | null
}) {
  const config = useMemo(() => readScenarios(record.doc), [record.doc])
  const activeScenario =
    config?.scenarios.find((item) => item.id === scenarioId) ??
    config?.scenarios.find((item) => item.id === config.defaultId)
  const previewRecord = useMemo(
    () => ({
      ...record,
      doc: scenarioDocument(record.doc, activeScenario?.id ?? ""),
    }),
    [record, activeScenario?.id]
  )
  const elements = useMemo(() => elementsOf(record.doc), [record.doc])
  const element = elements.find((item) => item.id === selection) ?? null
  const baselineElements = useMemo(() => elementsOf(initial.doc), [initial.doc])
  const baselineById = useMemo(
    () => new Map(baselineElements.map((item) => [item.id, item.signature])),
    [baselineElements]
  )
  const statusById = useMemo(
    () =>
      new Map(
        elements.map((item) => {
          const baseline = baselineById.get(item.id)
          const status: SiteElementStatus =
            baseline === undefined
              ? "new"
              : baseline === item.signature
                ? "same"
                : "modified"
          return [item.id, status]
        })
      ),
    [baselineById, elements]
  )
  const elementStatus = element ? (statusById.get(element.id) ?? null) : null

  return {
    config,
    activeScenario,
    previewRecord,
    elements,
    element,
    statusById,
    elementStatus,
  }
}
