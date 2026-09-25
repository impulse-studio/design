import { useCallback, useEffect, useRef } from "react"
import { findNode } from "@digit-ai-studio/shared"
import { useEditor } from "./context"
import { framesOf } from "./document"
import { bounds, fitViewport, nodeRect } from "./geometry"

export const useCanvasViewport = () => {
  const editor = useEditor()
  const surface = useRef<HTMLDivElement>(null)
  const initialFit = useRef(false)
  const fit = useCallback(
    (selection = false) => {
      if (!surface.current) return
      const state = editor.state.get()
      const nodes = selection
        ? state.selectedIds.flatMap((id) => {
            const node = findNode(framesOf(state.doc), id)?.node
            return node ? [node] : []
          })
        : framesOf(state.doc).filter((node) => !node.hidden)
      const rect = bounds(
        nodes.flatMap((node) => {
          const value = nodeRect(state, node)
          return value ? [value] : []
        })
      )
      if (rect)
        editor.setViewport(
          fitViewport(
            rect,
            surface.current.clientWidth,
            surface.current.clientHeight
          )
        )
    },
    [editor]
  )
  const zoomTo = useCallback(
    (zoom: number) => {
      if (!surface.current) return
      editor.zoomAt(
        {
          x: surface.current.clientWidth / 2,
          y: surface.current.clientHeight / 2,
        },
        zoom / editor.canvas.viewport.get().zoom
      )
    },
    [editor]
  )
  useEffect(() => {
    const element = surface.current
    if (!element) return
    const observer = new ResizeObserver(() => {
      if (
        initialFit.current ||
        element.clientWidth < 120 ||
        element.clientHeight < 200
      )
        return
      initialFit.current = true
      fit()
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [fit])
  return { surface, fit, zoomTo }
}
