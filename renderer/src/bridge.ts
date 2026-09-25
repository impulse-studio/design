import { shellMessageSchema } from "@digit-ai-studio/shared"
import type {
  Rect,
  RendererMessage,
  ShellMessage,
} from "@digit-ai-studio/shared"

export const frameId =
  new URLSearchParams(location.search).get("frameId") ?? "standalone"
let revision = 0
export const setRevision = (value: number) => {
  revision = value
}
type Payload = RendererMessage extends infer T
  ? T extends RendererMessage
    ? Omit<T, "source" | "frameId" | "revision">
    : never
  : never
export const post = (message: Payload) => {
  if (window.parent !== window)
    window.parent.postMessage(
      { ...message, source: "digit-renderer", frameId, revision },
      location.origin
    )
}
export const onShellMessage = (handler: (message: ShellMessage) => void) => {
  const listener = (event: MessageEvent) => {
    if (event.origin !== location.origin || event.source !== window.parent)
      return
    const parsed = shellMessageSchema.safeParse(event.data)
    if (
      !parsed.success ||
      parsed.data.frameId !== frameId ||
      parsed.data.revision < revision
    )
      return
    setRevision(parsed.data.revision)
    handler(parsed.data)
  }
  window.addEventListener("message", listener)
  return () => window.removeEventListener("message", listener)
}
const measurableElements = (element: Element): HTMLElement[] => {
  if (!(element instanceof HTMLElement)) return []
  return getComputedStyle(element).display === "contents"
    ? Array.from(element.children).flatMap(measurableElements)
    : [element]
}
const readComputedStyle = (element: HTMLElement) => {
  const style = getComputedStyle(element)
  return Object.fromEntries(
    [
      "display",
      "position",
      "width",
      "height",
      "padding-top",
      "padding-right",
      "padding-bottom",
      "padding-left",
      "gap",
      "color",
      "background-color",
      "border-color",
      "border-width",
      "opacity",
      "font-size",
      "font-weight",
      "border-radius",
    ].map((key) => [key, style.getPropertyValue(key)])
  )
}
export const collectLayout = (root: HTMLElement, ids?: ReadonlySet<string>) => {
  const rects: Record<string, Rect> = {},
    computed: Record<string, Record<string, string>> = {}
  for (const wrapper of root.querySelectorAll<HTMLElement>(
    "[data-editor-node]"
  )) {
    const id = wrapper.dataset.editorNode!
    if (ids && !ids.has(id)) continue
    const elements = Array.from(wrapper.children).flatMap(measurableElements)
    const boxes = elements
      .flatMap((element) => Array.from(element.getClientRects()))
      .filter((box) => box.width || box.height)
    if (!boxes.length) continue
    const x = Math.min(...boxes.map((box) => box.x)),
      y = Math.min(...boxes.map((box) => box.y))
    rects[id] = {
      x: x + window.scrollX,
      y: y + window.scrollY,
      width: Math.max(...boxes.map((box) => box.right)) - x,
      height: Math.max(...boxes.map((box) => box.bottom)) - y,
    }
    if (!ids) computed[id] = readComputedStyle(elements[0])
  }
  if (!ids) computed[frameId] = readComputedStyle(root)
  return { rects, computed }
}
