import { createClientOnlyFn } from "@tanstack/react-start"
import type { SiteDocument } from "@/validators/sites/document"

type SiteRuntimeStage =
  "initializing" | "installing" | "starting" | "ready" | "error"

export type SiteRuntimeStatus = {
  stage: SiteRuntimeStage
  message: string
}

export type SitePreviewContext = {
  token: string
  revision: number
  path: string
  editing: boolean
  hostOrigin: string
}

export const startSiteRuntime = createClientOnlyFn(
  async (
    doc: SiteDocument,
    preview: SitePreviewContext | undefined,
    onStatus: (status: SiteRuntimeStatus) => void
  ) => {
    const runtime = await import("./runtime.client")
    return runtime.siteRuntime.start(doc, preview, onStatus)
  }
)

export const syncSiteRuntime = createClientOnlyFn(
  async (doc: SiteDocument, preview?: SitePreviewContext) => {
    const runtime = await import("./runtime.client")
    return runtime.siteRuntime.sync(doc, preview)
  }
)

export const validateSiteRuntime = createClientOnlyFn(
  async (doc: SiteDocument) => {
    const runtime = await import("./runtime.client")
    return runtime.siteRuntime.validate(doc)
  }
)

export const disposeSiteRuntime = createClientOnlyFn(async () => {
  const runtime = await import("./runtime.client")
  return runtime.siteRuntime.dispose()
})

export const prepareSiteExport = createClientOnlyFn(
  async (
    doc: SiteDocument,
    onStage: (stage: "installing" | "building") => void
  ) => {
    const runtime = await import("./runtime.client")
    return runtime.siteRuntime.prepareExport(doc, onStage)
  }
)
