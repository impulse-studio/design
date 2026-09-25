import { z } from "zod"

export const siteKindSchema = z.enum(["react-vite", "vue-vite"])

export type SiteKind = z.infer<typeof siteKindSchema>
