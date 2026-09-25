import type { GeometryPreview } from "@digit-ai-studio/shared"

/** Temporary DOM overrides preserve Vue/component state and never modify the document. */
export const createGeometryPreview = (
  getRoot: () => HTMLElement | null,
  frameId: string
) => {
  const originals = new Map<HTMLElement, string | null>()
  const targets = new Map<string, HTMLElement[]>()
  let session = 0,
    sequence = 0,
    active = false
  const restore = () => {
    for (const [element, style] of originals) {
      if (style === null) element.removeAttribute("style")
      else element.setAttribute("style", style)
    }
    originals.clear()
    targets.clear()
    active = false
  }
  const reset = () => {
    restore()
    session = 0
    sequence = 0
  }
  const apply = (
    nextSession: number,
    nextSequence: number,
    patches: GeometryPreview[]
  ) => {
    if (
      nextSession < session ||
      (nextSession === session && nextSequence <= sequence)
    )
      return false
    if (nextSession !== session) restore()
    session = nextSession
    sequence = nextSequence
    if (!patches.length) {
      restore()
      return true
    }
    active = true
    const measurable = (element: Element): HTMLElement[] =>
      element instanceof HTMLElement
        ? getComputedStyle(element).display === "contents"
          ? Array.from(element.children).flatMap(measurable)
          : [element]
        : []
    for (const patch of patches) {
      let elements = targets.get(patch.nodeId)
      if (!elements) {
        const root = getRoot()
        const wrapper = root?.querySelector(
          `[data-editor-node="${CSS.escape(patch.nodeId)}"]`
        )
        elements =
          patch.nodeId === frameId && root
            ? [root]
            : wrapper
              ? Array.from(wrapper.children).flatMap(measurable)
              : []
        targets.set(patch.nodeId, elements)
      }
      for (const element of elements) {
        if (!originals.has(element))
          originals.set(element, element.getAttribute("style"))
        if (patch.width !== undefined) {
          element.style.width = `${patch.width}px`
          element.style.flexGrow = "0"
          element.style.flexShrink = "0"
        }
        if (patch.height !== undefined)
          element.style.height = `${patch.height}px`
        if (patch.nodeId !== frameId) {
          if (patch.x !== undefined) element.style.left = `${patch.x}px`
          if (patch.y !== undefined) element.style.top = `${patch.y}px`
          if (patch.translateX !== undefined || patch.translateY !== undefined)
            element.style.translate = `${patch.translateX ?? 0}px ${patch.translateY ?? 0}px`
        }
      }
    }
    return true
  }
  return {
    apply,
    reset,
    get active() {
      return active
    },
    get session() {
      return session
    },
    get sequence() {
      return sequence
    },
    get ids() {
      return new Set(targets.keys())
    },
  }
}
