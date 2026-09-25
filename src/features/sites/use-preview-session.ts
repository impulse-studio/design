import { v4 as uuid } from "uuid"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  disposeSiteRuntime,
  startSiteRuntime,
  syncSiteRuntime,
} from "./runtime"
import type { SiteRuntimeStatus } from "./runtime"
import { previewMessageSchema } from "@/validators/sites/preview"
import type {
  PreviewInventoryEntry,
  PreviewRect,
} from "@/validators/sites/preview"
import { sourceElementName } from "./element-name"
import type { SourceElement } from "./source"
import type { SiteRecord } from "@/features/sites/types"

export type SitePreviewTarget = {
  id: string
  domTag: string
  sourceTag: string
  rect: PreviewRect
}

export type PreviewCommand = {
  type: "back" | "forward"
  sequence: number
} | null

type PreviewSessionOptions = {
  record: SiteRecord
  sourceElements: SourceElement[]
  editing: boolean
  path: string
  selection: string | null
  command: PreviewCommand
  onSelect: (id: string, count: number, domTag: string | null) => void
  onInventory: (elements: PreviewInventoryEntry[]) => void
  onRoute: (path: string) => void
  onError: (message: string) => void
  onStatus: (status: SiteRuntimeStatus) => void
}

export const useSitePreviewSession = (options: PreviewSessionOptions) => {
  const iframe = useRef<HTMLIFrameElement>(null)
  const token = useRef(uuid())
  const started = useRef(false)
  const ready = useRef(false)
  const mounted = useRef(true)
  const pendingCommand = useRef<Exclude<PreviewCommand, null> | null>(null)
  const [url, setUrl] = useState("")
  const [status, setStatus] = useState<SiteRuntimeStatus>({
    stage: "initializing",
    message: "Initialisation…",
  })
  const [loading, setLoading] = useState(true)
  const [hover, setHover] = useState<SitePreviewTarget | null>(null)
  const [selectionTarget, setSelectionTarget] =
    useState<SitePreviewTarget | null>(null)
  const sourceById = useMemo(
    () =>
      new Map(options.sourceElements.map((element) => [element.id, element])),
    [options.sourceElements]
  )
  const latest = useRef(options)
  latest.current = options

  const publishStatus = (next: SiteRuntimeStatus) => {
    setStatus(next)
    latest.current.onStatus(next)
  }
  const send = (message: Record<string, unknown>) =>
    iframe.current?.contentWindow?.postMessage(
      {
        source: "digit-host",
        token: token.current,
        revision: options.record.revision,
        ...message,
      },
      url ? new URL(url).origin : "*"
    )
  const targetFor = (
    id: string,
    domTag: string | undefined,
    rect: SitePreviewTarget["rect"]
  ): SitePreviewTarget => {
    const source = sourceById.get(id)
    const actualTag = domTag ?? "élément"
    return {
      id,
      domTag: actualTag,
      sourceTag: source ? sourceElementName(source) : actualTag,
      rect,
    }
  }

  useEffect(() => {
    let disposed = false
    ready.current = false
    setLoading(true)
    setHover(null)
    setSelectionTarget(null)
    token.current = uuid()
    const preview = {
      token: token.current,
      revision: options.record.revision,
      path: latest.current.path,
      editing: latest.current.editing,
      hostOrigin: window.location.origin,
    }
    if (started.current)
      publishStatus({ stage: "starting", message: "Mise à jour du site…" })
    const run = started.current
      ? syncSiteRuntime(options.record.doc, preview)
      : startSiteRuntime(options.record.doc, preview, (next) => {
          if (mounted.current) publishStatus(next)
        })
    void run
      .then((nextUrl) => {
        if (disposed) return
        started.current = true
        setUrl(nextUrl)
        publishStatus({ stage: "ready", message: "Prêt" })
      })
      .catch((error) => {
        if (disposed) return
        const message = error instanceof Error ? error.message : String(error)
        publishStatus({ stage: "error", message })
        latest.current.onError(message)
        setLoading(false)
      })
    return () => {
      disposed = true
    }
  }, [options.record.doc, options.record.revision])

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      started.current = false
      ready.current = false
      void disposeSiteRuntime()
    }
  }, [])

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (
        event.source !== iframe.current?.contentWindow ||
        !url ||
        event.origin !== new URL(url).origin
      )
        return
      const result = previewMessageSchema.safeParse(event.data)
      if (
        !result.success ||
        result.data.token !== token.current ||
        result.data.revision !== options.record.revision
      )
        return
      const message = result.data
      if (message.type === "ready") {
        ready.current = true
        setLoading(false)
        send({ type: "mode", editing: latest.current.editing })
        send({ type: "navigate", path: latest.current.path })
        send({ type: "select", id: latest.current.selection })
        if (pendingCommand.current) {
          send({ type: pendingCommand.current.type })
          pendingCommand.current = null
        }
      }
      if (message.type === "hover")
        setHover(
          message.id && message.rect
            ? targetFor(message.id, message.tag, message.rect)
            : null
        )
      if (message.type === "selection") {
        setSelectionTarget(
          message.id && message.rect
            ? targetFor(message.id, message.tag, message.rect)
            : null
        )
        latest.current.onSelect(
          message.id ?? "",
          message.count ?? 0,
          message.tag ?? null
        )
      }
      if (message.type === "inventory")
        latest.current.onInventory(message.elements ?? [])
      if (message.type === "route" && message.path)
        latest.current.onRoute(message.path)
      if (message.type === "error") {
        setLoading(false)
        latest.current.onError(message.message ?? "Erreur dans le site.")
      }
    }
    window.addEventListener("message", receive)
    return () => window.removeEventListener("message", receive)
  }, [options.record.revision, sourceById, url])

  useEffect(() => {
    if (ready.current) send({ type: "mode", editing: options.editing })
    if (!options.editing) setHover(null)
  }, [options.editing])
  useEffect(() => {
    if (ready.current) send({ type: "navigate", path: options.path })
  }, [options.path])
  useEffect(() => {
    if (ready.current) send({ type: "select", id: options.selection })
  }, [options.selection])
  useEffect(() => {
    if (!options.command) return
    if (ready.current) send({ type: options.command.type })
    else pendingCommand.current = options.command
  }, [options.command])

  return { iframe, url, status, loading, hover, selectionTarget }
}
