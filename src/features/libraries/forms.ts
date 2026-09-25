import { z } from "zod"
import { siteKindSchema } from "@/features/sites/schema"
export const libraryFormSchema = z.object({name:z.string().trim().min(1,"Indiquez un nom.").max(100),framework:siteKindSchema})
export const createSiteFormSchema = z.object({name:z.string().trim().min(1,"Indiquez un nom.").max(200),kind:siteKindSchema})
export const frameworkOptions=[{value:"react-vite",label:"React + Vite"},{value:"vue-vite",label:"Vue + Vite"}]
