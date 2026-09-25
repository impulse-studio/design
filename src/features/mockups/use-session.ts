import { useEffect, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import type { Editor } from "@/features/editor/store"
import { useOrpc } from "@/server/use-orpc"
import type { MockupRecord } from "./types"
import { useAutosave } from "./use-autosave"

export const mockupSessionKey = (
  record: Pick<MockupRecord, "id" | "revision"> & { canEdit: boolean }
) =>
  `${record.id}:${record.canEdit}:${record.canEdit ? "local" : record.revision}`

export const useMockupSessionBaseline = (initial: MockupRecord) => {
  const [baseline] = useState(initial)
  return baseline
}

export const useMockupSession = (editor: Editor, initial: MockupRecord) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const orpc = useOrpc()
  const persistence = useAutosave(editor, initial)

  useEffect(() => {
    const controller = new AbortController()
    const check = async () => {
      if (controller.signal.aborted || document.visibilityState !== "visible")
        return
      try {
        const remote = await queryClient.fetchQuery(
          orpc.mockups.getRevision.queryOptions({
            input: { id: initial.id },
            staleTime: 0,
          })
        )
        if (remote.revision <= persistence.getRevision()) return
        // Cleanup may abort while the request is in flight.
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (controller.signal.aborted) return
        if (editor.readOnly && persistence.isClean()) await router.invalidate()
        else
          editor.set({
            notice:
              "Une version plus récente existe. Votre brouillon local est conservé.",
          })
      } catch {
        // Network failures never interrupt the local editing session.
      }
    }
    const timer = window.setInterval(() => void check(), 2500)
    return () => {
      controller.abort()
      window.clearInterval(timer)
    }
  }, [
    editor,
    initial.id,
    orpc,
    persistence.recovery,
    persistence.revision,
    persistence.status,
    queryClient,
    router,
  ])

  return {
    status: persistence.status,
    recovery: persistence.recovery,
    recover: persistence.recover,
    discard: persistence.discard,
    retry: persistence.retry,
    waitForSave: persistence.waitForSave,
  }
}
