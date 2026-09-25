import { useEffect, useMemo, useRef, useState } from "react"
import { compileSite } from "@/features/sites/compile"
import { previewHtml, previewMessageSchema } from "@/features/sites/bridge"
import type { PreviewInventoryEntry } from "@/features/sites/bridge"
import { sourceElementName } from "@/features/sites/element-name"
import type { SourceElement } from "@/features/sites/source"
import type { SiteRecord } from "@/features/sites/schema"
import { Spinner } from "@/components/ui/spinner"
import { SitePreviewOverlay } from "./PreviewOverlay"
import type { SitePreviewTarget } from "./PreviewOverlay"

export function SitePreview({
  record,
  sourceElements,
  editing,
  path,
  width,
  selection,
  command,
  onSelect,
  onInventory,
  onRoute,
  onError,
}: {
  record: SiteRecord
  sourceElements: SourceElement[]
  editing: boolean
  path: string
  width: number
  selection: string | null
  command: { type: "back" | "forward"; sequence: number } | null
  onSelect: (id: string, count: number, domTag: string | null) => void
  onInventory: (elements: PreviewInventoryEntry[]) => void
  onRoute: (path: string) => void
  onError: (message: string) => void
}) {
  const iframe = useRef<HTMLIFrameElement>(null),
    token = useRef(crypto.randomUUID()),
    [html, setHtml] = useState(""),
    [loading, setLoading] = useState(true),
    [hover, setHover] = useState<SitePreviewTarget | null>(null),
    [selectedTarget, setSelectedTarget] = useState<SitePreviewTarget | null>(
      null
    )
  const sourceById = useMemo(
    () => new Map(sourceElements.map((element) => [element.id, element])),
    [sourceElements]
  )
  const targetFor = (
    id: string,
    domTag: string | undefined,
    rect: NonNullable<typeof selectedTarget>["rect"]
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
  const latest = useRef({
    editing,
    path,
    selection,
    onSelect,
    onInventory,
    onRoute,
    onError,
  })
  latest.current = {
    editing,
    path,
    selection,
    onSelect,
    onInventory,
    onRoute,
    onError,
  }
  const send = (message: Record<string, unknown>) =>
    iframe.current?.contentWindow?.postMessage(
      {
        source: "digit-host",
        token: token.current,
        revision: record.revision,
        ...message,
      },
      "*"
    )
  useEffect(() => {
    let disposed = false
    setLoading(true)
    token.current = crypto.randomUUID()
    void compileSite(record.doc, {
      token: token.current,
      revision: record.revision,
      path: latest.current.path,
      editing: latest.current.editing,
    })
      .then((code) => {
        if (!disposed) setHtml(previewHtml(code))
      })
      .catch((error) => {
        if (!disposed) {
          latest.current.onError(String(error))
          setLoading(false)
        }
      })
    return () => {
      disposed = true
    }
  }, [record.doc, record.revision])
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (
        event.source !== iframe.current?.contentWindow ||
        event.origin !== "null"
      )
        return
      const result = previewMessageSchema.safeParse(event.data)
      if (
        !result.success ||
        result.data.token !== token.current ||
        result.data.revision !== record.revision
      )
        return
      const message = result.data
      if (message.type === "ready") {
        setLoading(false)
        send({ type: "mode", editing: latest.current.editing })
        send({ type: "navigate", path: latest.current.path })
        send({ type: "select", id: latest.current.selection })
      }
      if (message.type === "hover")
        setHover(
          message.id && message.rect
            ? targetFor(message.id, message.tag, message.rect)
            : null
        )
      if (message.type === "selection") {
        setSelectedTarget(
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
  }, [record.revision, sourceById])
  useEffect(() => {
    send({ type: "mode", editing })
    if (!editing) setHover(null)
  }, [editing])
  useEffect(() => send({ type: "navigate", path }), [path])
  useEffect(() => send({ type: "select", id: selection }), [selection])
  useEffect(() => {
    if (command) send({ type: command.type })
  }, [command])
  return (
    <div className="site-preview-area flex-1 min-h-0 overflow-auto p-6 block max-[1100px]:p-3">
      <div className="site-preview-device relative mx-auto h-full bg-white border border-border rounded-lg overflow-hidden relative" style={{ width }}>
        {loading && (
          <div className="site-preview-loading absolute [inset:0] flex justify-center items-center gap-2 bg-background text-[12px] z-[1]" role="status">
            <Spinner /> Compilation du site…
          </div>
        )}
        <iframe
          ref={iframe}
          title="Aperçu du site React"
          sandbox="allow-scripts allow-modals"
          referrerPolicy="no-referrer"
          srcDoc={html}
          className="site-preview-frame block w-full h-full border-0 min-h-[500px]"
        />
        {editing && (
          <SitePreviewOverlay hover={hover} selection={selectedTarget} />
        )}
      </div>
    </div>
  )
}
