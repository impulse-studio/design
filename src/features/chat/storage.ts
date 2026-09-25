import { z } from "zod"
import { CHAT_MODELS } from "./catalog"
import { initialChatState, interruptMessage } from "./reducer"
import { attachmentSchema, effortSchema, messageSchema } from "./types"
import type { ChatState } from "./types"

const draftSchema = z.object({
  text: z.string(),
  attachments: z.array(attachmentSchema).max(5),
})
const savedSchema = z.object({
  version: z.literal(1),
  model: z.string(),
  effort: effortSchema,
  drafts: z.object({ disconnected: draftSchema, demo: draftSchema }),
  messages: z.array(messageSchema),
})
export const chatStorageKey = (mockupId: string) =>
  `digit:chat-ui:v1:${mockupId}`
export const serializeChat = (state: ChatState) =>
  JSON.stringify(
    {
      version: 1,
      model: state.model,
      effort: state.effort,
      drafts: state.drafts,
      messages: state.messages,
    },
    (key, value: unknown) => (key === "blobUrl" ? undefined : value)
  )

export const restoreChat = (
  serialized: string | null,
  legacyDraft = ""
): ChatState => {
  const initial = initialChatState()
  if (!serialized)
    return {
      ...initial,
      drafts: {
        ...initial.drafts,
        disconnected: { text: legacyDraft, attachments: [] },
      },
    }
  try {
    // Never restore object URLs from another browser session, including hand-edited storage.
    const parsed = savedSchema.safeParse(
      JSON.parse(serialized, (key, value: unknown) =>
        key === "blobUrl" ? undefined : value
      )
    )
    if (!parsed.success)
      return {
        ...initial,
        notice:
          "L’historique local est illisible. Un nouveau fil a été ouvert.",
      }
    const { model, effort, drafts, messages } = parsed.data
    return {
      ...initial,
      model: CHAT_MODELS.some((item) => item.value === model)
        ? model
        : initial.model,
      effort,
      drafts,
      messages: messages.map(interruptMessage),
    }
  } catch {
    return {
      ...initial,
      notice: "L’historique local est illisible. Un nouveau fil a été ouvert.",
    }
  }
}
