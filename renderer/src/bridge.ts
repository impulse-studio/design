import { MESSAGE_SOURCE, type Rect, type RendererMessage, type ShellMessage } from "@digit-ai-studio/shared"

export function post(message: RendererMessage): void {
  if (window.parent === window) return
  window.parent.postMessage({ source: MESSAGE_SOURCE.renderer, ...message }, location.origin)
}

export function onShellMessage(handler: (message: ShellMessage) => void): () => void {
  const listener = (event: MessageEvent) => {
    if (event.origin !== location.origin || event.source !== window.parent) return
    if (event.data?.source !== MESSAGE_SOURCE.studio) return
    handler(event.data as ShellMessage)
  }
  window.addEventListener("message", listener)
  return () => window.removeEventListener("message", listener)
}

// Node boxes in frame coordinates. Components that forward attrs to several roots report their first one.
export function collectRects(root: HTMLElement): Record<string, Rect> {
  const rects: Record<string, Rect> = {}
  for (const el of root.querySelectorAll<HTMLElement>("[data-node-id]")) {
    const id = el.dataset.nodeId!
    if (rects[id]) continue
    const r = el.getBoundingClientRect()
    rects[id] = { x: r.x + window.scrollX, y: r.y + window.scrollY, width: r.width, height: r.height }
  }
  return rects
}
