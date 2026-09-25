import { useEffect, useRef } from "react"
import { usePanelRef } from "react-resizable-panels"

const ANIMATING_ATTRIBUTE = "data-panel-animating"
const ANIMATION_FALLBACK_MS = 400

/**
 * Keeps a collapsible panel mounted and syncs it with a visibility flag.
 * Programmatic toggles mark the group so CSS can tween its flex-grow;
 * pointer drags stay immediate.
 */
export const useCollapsiblePanel = (
  visible: boolean,
  onVisibleChange: (visible: boolean) => void
) => {
  const panelRef = usePanelRef()
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (elementRef.current) elementRef.current.inert = !visible
  }, [visible])

  useEffect(() => {
    const panel = panelRef.current,
      element = elementRef.current,
      group = element?.parentElement
    if (!panel || visible !== panel.isCollapsed()) return
    let timeout = 0
    const done = () => {
      window.clearTimeout(timeout)
      group?.removeAttribute(ANIMATING_ATTRIBUTE)
      element?.removeEventListener("transitionend", onEnd)
    }
    const onEnd = (event: TransitionEvent) => {
      if (event.target === element && event.propertyName === "flex-grow") done()
    }
    if (element && group) {
      group.setAttribute(ANIMATING_ATTRIBUTE, "")
      element.addEventListener("transitionend", onEnd)
      timeout = window.setTimeout(done, ANIMATION_FALLBACK_MS)
    }
    if (visible) panel.expand()
    else panel.collapse()
    return done
  }, [visible, panelRef])

  const onResize = () => {
    const collapsed = panelRef.current?.isCollapsed()
    if (collapsed !== undefined && collapsed === visible)
      onVisibleChange(!collapsed)
  }

  return { panelRef, elementRef, onResize }
}
