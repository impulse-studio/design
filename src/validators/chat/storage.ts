import { z } from "zod"

import {
  attachmentSchema,
  effortSchema,
  messageSchema,
} from "@/validators/chat/messages"

const draftSchema = z.object({
  text: z.string(),
  attachments: z.array(attachmentSchema).max(5),
})

export const savedSchema = z.object({
  version: z.literal(1),
  model: z.string(),
  effort: effortSchema,
  drafts: z.object({ disconnected: draftSchema, demo: draftSchema }),
  messages: z.array(messageSchema),
})
