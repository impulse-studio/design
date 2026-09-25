import { childLists, findNode, walk } from "@digit-ai-studio/shared"
import type { AnyNode, GeometryPreview, Rect } from "@digit-ai-studio/shared"
import type { Draft } from "immer"
import { produce } from "immer"
import { framesOf } from "./document"
import { geometryIndex } from "./geometry-index"
import { freshClone } from "./tree"
import type { EditorState } from "./types"
import type { CanvasDraft, CanvasPreview, Guide } from "./canvas-runtime"

export const duplicateGestureDraft = (
  state: EditorState,
  ids: string[]
): CanvasDraft => {
  const selectedIds: string[] = [],
    layouts = { ...state.layouts }
  const doc = produce(state.doc, (draft) => {
    for (const id of ids) {
      const location = findNode(framesOf(draft), id)
      if (!location) continue
      const copy = freshClone(location.node)
      const originals: AnyNode[] = [],
        clones: AnyNode[] = []
      walk(location.node, (node) => originals.push(node))
      walk(copy, (node) => clones.push(node))
      const frameId = copy.type === "frame" ? copy.id : location.frame.id
      const originalLayout = state.layouts[location.frame.id]
      const rects = {
        ...(copy.type === "frame" ? {} : layouts[frameId]?.rects),
      }
      originals.forEach((node, i) => {
        rects[clones[i].id] = originalLayout?.rects[node.id]
      })
      layouts[frameId] = {
        ...originalLayout,
        contentHeight: originalLayout?.contentHeight ?? 900,
        rects,
      }
      if (copy.type === "frame") framesOf(draft).push(copy)
      else if (location.parent) {
        const list = childLists(location.parent).find((entry) =>
          entry.nodes.some((node) => node.id === id)
        )!.nodes
        list.splice(list.findIndex((node) => node.id === id) + 1, 0, copy)
      }
      selectedIds.push(copy.id)
    }
  })
  return { doc, selectedIds, layouts }
}

export const snapCandidates = (state: EditorState, ids: string[]) => {
  const selected = new Set(ids)
  return geometryIndex(state).entries.flatMap((entry) =>
    !entry.hidden &&
    !entry.path.some((node) => selected.has(node.id)) &&
    entry.rect
      ? [entry.rect]
      : []
  )
}

export const transformGesture = ({
  initial,
  ids,
  rect,
  kind,
  handle = "se",
  dx,
  dy,
  shift,
  alt,
  session,
  candidates,
}: {
  initial: EditorState
  ids: string[]
  rect: Rect
  kind: "move" | "resize"
  handle?: string
  dx: number
  dy: number
  shift: boolean
  alt: boolean
  session: number
  candidates: Rect[]
}): { preview: CanvasPreview; guides: Guide[]; patches: GeometryPreview[] } => {
  const guides: Guide[] = [],
    index = geometryIndex(initial)
  if (kind === "move") {
    if (shift) {
      if (Math.abs(dx) > Math.abs(dy)) dy = 0
      else dx = 0
    }
    if (!alt)
      for (const axis of ["x", "y"] as const) {
        // Snapping must not break the axis constraint.
        if (shift && ((axis === "x" && dx === 0) || (axis === "y" && dy === 0)))
          continue
        const size = axis === "x" ? "width" : "height",
          offset = axis === "x" ? dx : dy
        let best = 6 / initial.viewport.zoom,
          snap = 0,
          value: number | null = null
        for (const other of candidates)
          for (const edge of [
            other[axis],
            other[axis] + other[size] / 2,
            other[axis] + other[size],
          ])
            for (const own of [
              rect[axis],
              rect[axis] + rect[size] / 2,
              rect[axis] + rect[size],
            ]) {
              const diff = edge - own - offset
              if (Math.abs(diff) < best) {
                best = Math.abs(diff)
                snap = diff
                value = edge
              }
            }
        if (value !== null) {
          guides.push({ axis, value })
          if (axis === "x") dx += snap
          else dy += snap
        }
      }
  }
  let width = Math.max(
    1,
    rect.width +
      (handle.includes("w") ? -dx : handle.includes("e") ? dx : 0) *
        (alt ? 2 : 1)
  )
  let height = Math.max(
    1,
    rect.height +
      (handle.includes("n") ? -dy : handle.includes("s") ? dy : 0) *
        (alt ? 2 : 1)
  )
  if (shift || ids.every((id) => index.byId.get(id)?.node.lockAspectRatio)) {
    const ratio = rect.width / Math.max(1, rect.height)
    if (handle === "n" || handle === "s") width = height * ratio
    else height = width / ratio
  }
  const x = alt
    ? rect.x + (rect.width - width) / 2
    : handle.includes("w")
      ? rect.x + rect.width - width
      : rect.x
  const y = alt
    ? rect.y + (rect.height - height) / 2
    : handle.includes("n")
      ? rect.y + rect.height - height
      : rect.y
  const preview: CanvasPreview = { session, rects: {}, frames: {} },
    patches: GeometryPreview[] = []
  for (const id of ids) {
    const entry = index.byId.get(id)
    if (!entry?.rect) continue
    const node = entry.node,
      r = entry.rect
    const next =
      kind === "move"
        ? { ...r, x: r.x + dx, y: r.y + dy }
        : {
            x: x + ((r.x - rect.x) * width) / Math.max(1, rect.width),
            y: y + ((r.y - rect.y) * height) / Math.max(1, rect.height),
            width: Math.max(
              1,
              Math.round((r.width * width) / Math.max(1, rect.width))
            ),
            height: Math.max(
              1,
              Math.round((r.height * height) / Math.max(1, rect.height))
            ),
          }
    next.x = Math.round(next.x)
    next.y = Math.round(next.y)
    preview.rects[id] = next
    const patch: GeometryPreview = { nodeId: id }
    if (kind === "resize") {
      patch.width = next.width
      patch.height = next.height
    }
    if (node.type === "frame") {
      patch.x = next.x
      patch.y = next.y
    } else if (node.layout?.position && node.layout.position !== "flow") {
      patch.x = node.layout.position.x + next.x - r.x
      patch.y = node.layout.position.y + next.y - r.y
    } else if (kind === "move") {
      patch.translateX = next.x - r.x
      patch.translateY = next.y - r.y
    }
    patches.push(patch)
    // Artboard positions belong exclusively to the shell, never to the renderer.
    if (node.type !== "frame" || kind === "resize")
      (preview.frames[entry.frame.id] ??= []).push(patch)
  }
  return { preview, guides, patches }
}

export const applyGeometryPatch = (
  node: Draft<AnyNode>,
  patch: GeometryPreview
) => {
  if (node.type === "frame") {
    if (patch.x !== undefined) node.x = patch.x
    if (patch.y !== undefined) node.y = patch.y
    if (patch.width !== undefined) node.width = patch.width
    if (patch.height !== undefined) node.height = patch.height
    if (patch.width !== undefined || patch.height !== undefined)
      delete node.preset
  } else {
    node.layout ??= {}
    if (patch.width !== undefined)
      node.layout.width = { mode: "fixed", value: patch.width }
    if (patch.height !== undefined)
      node.layout.height = { mode: "fixed", value: patch.height }
    if (patch.x !== undefined && patch.y !== undefined)
      node.layout.position = { x: patch.x, y: patch.y }
  }
}
