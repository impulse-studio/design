import { v4 as uuid } from "uuid"
import type { AiAction } from "@/validators/ai/actions"
import { aiRequest } from "./client"

type ConversationRequest = <TResult>(
  path: string,
  body?: AiAction
) => Promise<TResult>

export type ConversationSubmission = {
  conversationId?: string | null
  model: string
  prompt: string
  docHash: string
  selectedIds: string[]
  activeRoute?: string
}

export type ConversationDispatch = (input: {
  conversationId: string
  runId: string
  prompt: string
}) => Promise<void>

export const createConversationSession = ({
  targetId,
  startRemoteSession,
  request = aiRequest,
}: {
  targetId: string
  startRemoteSession: boolean
  request?: ConversationRequest
}) => {
  let pending:
    | {
        key: string
        requestId: string
        conversationId: string
        sessionStarted: boolean
      }
    | undefined

  return {
    reset: () => {
      pending = undefined
    },
    send: async (
      input: ConversationSubmission,
      dispatch: ConversationDispatch
    ) => {
      const key = JSON.stringify([
        targetId,
        input.prompt,
        input.model,
        input.docHash,
        input.selectedIds,
        input.activeRoute,
      ])
      if (pending?.key !== key) {
        const conversationId =
          input.conversationId ??
          (
            await request<{ id: string }>("action", {
              action: "conversation",
              mockupId: targetId,
            })
          ).id
        pending = {
          key,
          requestId: uuid(),
          conversationId,
          sessionStarted: false,
        }
      }

      if (startRemoteSession && !pending.sessionStarted) {
        await request("action", {
          action: "session",
          conversationId: pending.conversationId,
        })
        pending.sessionStarted = true
      }

      const admitted = await request<{ id: string }>("action", {
        action: "send",
        conversationId: pending.conversationId,
        requestId: pending.requestId,
        model: input.model,
        prompt: input.prompt,
        docHash: input.docHash,
        selectedIds: input.selectedIds,
        activeRoute: input.activeRoute,
      })
      const result = {
        conversationId: pending.conversationId,
        runId: admitted.id,
      }
      await dispatch({ ...result, prompt: input.prompt })
      pending = undefined
      return result
    },
    stop: (runId: string) =>
      request("action", { action: "stop", runId }).then(() => undefined),
  }
}
