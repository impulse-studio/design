import { vueTemplate } from "./vue-template"
import type { SiteKind } from "./schema"
import template from "@/generated/site-template.json"
import { siteDocumentSchema } from "./schema"
import { normalizeSources } from "./source"

export const createSiteDocument = (kind: SiteKind = "react-vite") =>
  normalizeSources(siteDocumentSchema.parse(kind === "vue-vite" ? vueTemplate : template))
