import { v4 as uuid } from "uuid"
import { createCanvasRuntime } from "./canvas-runtime"
import { createStore } from "@tanstack/react-store"
import { produce } from "immer"
import type { Draft } from "immer"
import type {
  AnyNode,
  FramePreset,
  MockupDoc,
  Node,
} from "@digit-ai-studio/shared"
import {
  childLists,
  detachedSnapshotSchema,
  findNode,
  validateDocument,
  walk,
} from "@digit-ai-studio/shared"
import type { EditorState, Snapshot, Viewport } from "./types"
import { framesOf, makeFrame } from "./document"
import { bounds, nodeRect } from "./geometry"
import {
  boxNode,
  entryFor,
  library,
  localVariantsOf,
  makeLibraryNode,
  textNode,
} from "./library"
import {
  detach,
  freshClone,
  insertionList,
  isEditable,
  topSelected,
} from "./tree"
import { materializeDetachedComponent } from "./editable-elements"
import { applyLocalVariantCommand } from "./local-variants"

export const createEditor = (initial: Snapshot, readOnly = false) => {
  const state = createStore<EditorState>({
    ...initial,
    selectedIds: [],
    hoveredId: null,
    enteredId: null,
    editingTextId: null,
    editingVariantId: null,
    detachRequest: null,
    viewport: { x: 0, y: 0, zoom: 0.5 },
    tool: "move",
    mode: "edit",
    tab: readOnly ? "layers" : "components",
    rightTab: readOnly ? "inspect" : "design",
    inspectorVisible: true,
    libraryVisible: true,
    layouts: {},
    past: [],
    future: [],
    transaction: null,
    transactionFuture: null,
    transactionSelection: null,
    notice: null,
  })
  const canvas = createCanvasRuntime(state.get().viewport)
  const set = (patch: Partial<EditorState>) =>
    state.setState((s) => ({
      ...s,
      ...patch,
      ...(readOnly
        ? {
            doc: s.doc,
            name: s.name,
            status: s.status,
            rightTab: "inspect" as const,
            editingTextId: null,
          }
        : {}),
    }))
  const change = (recipe: (doc: Draft<MockupDoc>) => void) => {
    const previous = state.get()
    if (previous.rightTab === "inspect") return
    const doc = produce(previous.doc, recipe)
    if (doc === previous.doc) return
    state.setState((s) => ({
      ...s,
      doc,
      past: s.transaction
        ? s.past
        : [...s.past, { doc: s.doc, name: s.name, status: s.status }].slice(
            -100
          ),
      future: [],
      notice: null,
    }))
  }
  const begin = () => {
    if (state.get().rightTab !== "inspect" && !state.get().transaction)
      set({
        transactionFuture: state.get().future,
        transactionSelection: state.get().selectedIds,
        transaction: {
          doc: state.get().doc,
          name: state.get().name,
          status: state.get().status,
        },
      })
  }
  const commit = () =>
    state.setState((s) => ({
      ...s,
      transaction: null,
      transactionFuture: null,
      transactionSelection: null,
      past:
        s.transaction &&
        (s.transaction.doc !== s.doc ||
          s.transaction.name !== s.name ||
          s.transaction.status !== s.status)
          ? [...s.past, s.transaction].slice(-100)
          : s.past,
    }))
  const cancel = () =>
    state.setState((s) =>
      s.transaction
        ? {
            ...s,
            ...s.transaction,
            selectedIds: s.transactionSelection ?? s.selectedIds,
            future: s.transactionFuture ?? s.future,
            transaction: null,
            transactionFuture: null,
            transactionSelection: null,
          }
        : s
    )
  const setEditorMode = (rightTab: EditorState["rightTab"]) => {
    canvas.cancel()
    commit()
    set({
      rightTab,
      mode: "edit",
      tool: "move",
      editingTextId: null,
      editingVariantId: null,
      inspectorVisible: true,
    })
  }
  const select = (id: string | null, additive = false) => {
    const selectedIds = id
      ? additive
        ? state.get().selectedIds.includes(id)
          ? state.get().selectedIds.filter((item) => item !== id)
          : [...state.get().selectedIds, id]
        : [id]
      : []
    const editingVariantId = state.get().editingVariantId
    const nextEditingVariantId =
      editingVariantId &&
      selectedIds.length > 0 &&
      selectedIds.every((selectedId) => {
        const selected = findNode(framesOf(state.get().doc), selectedId)?.node
        return (
          selected?.type === "component" &&
          selected.localVariant?.id === editingVariantId
        )
      })
        ? editingVariantId
        : null
    set({
      selectedIds,
      editingTextId: null,
      editingVariantId: nextEditingVariantId,
    })
  }
  const updateNodes = (
    ids: string[],
    recipe: (node: Draft<AnyNode>) => void,
    allowLocked = false
  ) =>
    change((doc) => {
      for (const id of ids) {
        const location = findNode(framesOf(doc), id)
        if (location && (allowLocked || isEditable(doc, id)))
          recipe(location.node)
      }
    })
  const updateSelection = (
    recipe: (node: Draft<AnyNode>) => void,
    allowLocked = false
  ) => {
    const current = state.get()
    if (!current.editingVariantId)
      return updateNodes(current.selectedIds, recipe, allowLocked)
    change((doc) => {
      applyLocalVariantCommand(doc, {
        type: "update",
        variantId: current.editingVariantId!,
        selectedIds: current.selectedIds,
        recipe,
      })
    })
  }
  const createLocalVariant = (nodeId: string) => {
    const location = findNode(framesOf(state.get().doc), nodeId)
    if (!location || location.node.type !== "component") return null
    const id = uuid()
    change((doc) => {
      applyLocalVariantCommand(doc, { type: "create", nodeId, variantId: id })
    })
    set({ selectedIds: [nodeId], editingVariantId: id })
    return id
  }
  const editLocalVariant = (id: string | null) => {
    if (!id) {
      set({ editingVariantId: null })
      return
    }
    const instances = localVariantsOf(state.get().doc).filter(
      (item) => item.variant.id === id
    )
    if (!instances.length) return
    const selectedIds = state.get().selectedIds.filter((nodeId) => {
      const node = findNode(framesOf(state.get().doc), nodeId)?.node
      return node?.type === "component" && node.localVariant?.id === id
    })
    const instanceIds: string[] = []
    for (const frame of framesOf(state.get().doc))
      walk(frame, (node) => {
        if (node.type === "component" && node.localVariant?.id === id)
          instanceIds.push(node.id)
      })
    set({
      editingVariantId: id,
      selectedIds: selectedIds.length ? selectedIds : instanceIds.slice(0, 1),
    })
  }
  const assignLocalVariant = (ids: string[], variantId: string | null) => {
    change((doc) => {
      applyLocalVariantCommand(doc, { type: "assign", nodeIds: ids, variantId })
    })
    set({ editingVariantId: null })
  }
  const insertLocalVariant = (variantId: string) => {
    const definition = localVariantsOf(state.get().doc).find(
      (item) => item.variant.id === variantId
    )
    if (!definition) return []
    const entry = entryFor(definition.component)
    const node = entry ? makeLibraryNode(entry) : null
    if (!node || node.type !== "component") return []
    node.localVariant = JSON.parse(
      JSON.stringify(definition.variant)
    ) as typeof definition.variant
    node.props = {}
    node.text = undefined
    return insertNodes([node])
  }
  const requestDetach = (nodeId: string) => {
    const location = findNode(framesOf(state.get().doc), nodeId)
    if (
      !location ||
      location.node.type !== "component" ||
      !isEditable(state.get().doc, nodeId)
    )
      return
    set({
      detachRequest: { nodeId, frameId: location.frame.id, requestId: uuid() },
    })
  }
  const detachComponent = (
    nodeId: string,
    input: unknown,
    requestId: string
  ) => {
    const pending = state.get().detachRequest
    if (
      !pending ||
      pending.nodeId !== nodeId ||
      pending.requestId !== requestId
    )
      return false
    const snapshot = detachedSnapshotSchema.safeParse(input)
    if (!snapshot.success) {
      set({
        detachRequest: null,
        notice: "Le rendu détaché contient une structure non autorisée.",
      })
      return false
    }
    let changed = false
    change((doc) => {
      const location = findNode(framesOf(doc), nodeId)
      if (!location || location.node.type !== "component") return
      const materialized = materializeDetachedComponent(
        location.node,
        snapshot.data,
        uuid
      )
      if (!materialized.length) return
      const list = location.parent
        ? childLists(location.parent).find((item) =>
            item.nodes.some((node) => node.id === nodeId)
          )?.nodes
        : framesOf(doc)
      const index = list?.findIndex((node) => node.id === nodeId) ?? -1
      if (!list || index < 0) return
      list.splice(index, 1, ...materialized)
      changed = true
    })
    // Immer executes the recipe synchronously, although static analysis cannot
    // observe the assignment made inside its callback.
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (changed) {
      set({
        selectedIds: [nodeId],
        editingVariantId: null,
        detachRequest: null,
      })
      return true
    }
    set({
      detachRequest: null,
      notice: "Impossible de détacher cette instance.",
    })
    return false
  }
  const undo = () => {
    canvas.cancel()
    if (state.get().rightTab === "inspect") return
    commit()
    state.setState((s) => {
      const previous = s.past.at(-1)
      return previous
        ? {
            ...s,
            ...previous,
            past: s.past.slice(0, -1),
            future: [
              { doc: s.doc, name: s.name, status: s.status },
              ...s.future,
            ],
            selectedIds: s.selectedIds.filter((id) =>
              findNode(framesOf(previous.doc), id)
            ),
          }
        : s
    })
  }
  const redo = () => {
    canvas.cancel()
    if (state.get().rightTab === "inspect") return
    commit()
    state.setState((s) => {
      const next = s.future.at(0)
      return next
        ? {
            ...s,
            ...next,
            past: [...s.past, { doc: s.doc, name: s.name, status: s.status }],
            future: s.future.slice(1),
            selectedIds: s.selectedIds.filter((id) =>
              findNode(framesOf(next.doc), id)
            ),
          }
        : s
    })
  }
  const rename = (name: string) => {
    if (state.get().rightTab === "inspect") return
    const value = name.trim()
    if (!value || value === state.get().name) return
    state.setState((s) => ({
      ...s,
      name: value,
      past: s.transaction
        ? s.past
        : [...s.past, { doc: s.doc, name: s.name, status: s.status }].slice(
            -100
          ),
      future: [],
    }))
  }
  const setStatus = (status: Snapshot["status"]) => {
    if (state.get().rightTab === "inspect") return
    if (state.get().status === status) return
    begin()
    set({ status })
    commit()
  }
  const addFrame = (
    preset: FramePreset = "desktop",
    position?: { x: number; y: number }
  ) => {
    if (state.get().rightTab === "inspect") return null
    const frames = framesOf(state.get().doc)
    const frame = makeFrame(
      preset,
      position?.x ??
        Math.max(
          0,
          ...frames.map(
            (f) => f.x + (nodeRect(state.get(), f)?.width ?? 1) + 80
          )
        ),
      position?.y ?? 0
    )
    change((doc) => {
      framesOf(doc).push(frame)
    })
    select(frame.id)
    set({ tool: "move" })
    return frame.id
  }
  const insertNodes = (
    nodes: Node[],
    targetId?: string,
    slot?: string,
    point?: { x: number; y: number }
  ) => {
    if (state.get().rightTab === "inspect") return []
    const added: string[] = []
    change((doc) => {
      const frames = framesOf(doc)
      if (!frames.length) frames.push(makeFrame())
      let target = findNode(
        frames,
        targetId ?? state.get().selectedIds.at(0) ?? frames[0].id
      )
      if (
        target &&
        (target.node.type === "text" ||
          target.node.type === "image" ||
          (target.node.type === "component" && !slot))
      )
        target = findNode(frames, target.parent?.id ?? target.frame.id)
      target ??= findNode(frames, frames[0].id)
      if (!target || !isEditable(doc, target.node.id)) return
      const list = insertionList(target.node, slot)
      if (!list) return
      const parentRect = nodeRect(state.get(), target.node)
      for (const original of nodes) {
        const node = freshClone(original)
        if (
          (target.node.type === "frame" || target.node.type === "box") &&
          !target.node.autoLayout
        )
          node.layout = {
            ...node.layout,
            position: {
              x: Math.round(
                (point?.x ?? (parentRect?.x ?? 0) + 40) - (parentRect?.x ?? 0)
              ),
              y: Math.round(
                (point?.y ?? (parentRect?.y ?? 0) + 40) - (parentRect?.y ?? 0)
              ),
            },
          }
        else node.layout = { ...node.layout, position: "flow" }
        list.push(node)
        added.push(node.id)
      }
    })
    set({ selectedIds: added, tool: "move", tab: "layers" })
    return added
  }
  const insert = (
    kind: string,
    targetId?: string,
    slot?: string,
    point?: { x: number; y: number }
  ) => {
    if (state.get().rightTab === "inspect") return []
    const entry = entryFor(kind)
    const node =
      kind === "box"
        ? boxNode()
        : kind === "text"
          ? textNode()
          : entry
            ? makeLibraryNode(entry)
            : null
    if (!node) return []
    try {
      const probe = makeFrame()
      probe.children = [node]
      validateDocument(
        {
          ...state.get().doc,
          pages: [{ ...state.get().doc.pages[0], frames: [probe] }],
        },
        library
      )
      return insertNodes([node], targetId, slot, point)
    } catch (error) {
      set({
        notice:
          error instanceof Error
            ? error.message
            : "Ce composant nécessite une configuration.",
      })
      return []
    }
  }
  const remove = () => {
    if (state.get().rightTab === "inspect") return
    const ids = topSelected(state.get().doc, state.get().selectedIds)
    change((doc) => {
      for (const id of ids) if (isEditable(doc, id)) detach(doc, id)
    })
    set({ selectedIds: [], enteredId: null })
  }
  const duplicate = (offset = true) => {
    if (state.get().rightTab === "inspect") return
    const added: string[] = []
    change((doc) => {
      for (const id of topSelected(doc, state.get().selectedIds)) {
        if (!isEditable(doc, id)) continue
        const location = findNode(framesOf(doc), id)!
        const copy = freshClone(location.node)
        if (copy.type === "frame") {
          copy.x += offset
            ? (nodeRect(state.get(), location.node)?.width ?? 1) + 80
            : 0
          framesOf(doc).push(copy)
        } else if (location.parent) {
          if (copy.layout?.position && copy.layout.position !== "flow") {
            copy.layout.position.x += offset ? 16 : 0
            copy.layout.position.y += offset ? 16 : 0
          }
          const list = childLists(location.parent).find((item) =>
            item.nodes.some((n) => n.id === id)
          )!.nodes
          list.splice(list.findIndex((n) => n.id === id) + 1, 0, copy)
        }
        added.push(copy.id)
      }
    })
    set({ selectedIds: added })
  }
  const moveNodes = (
    ids: string[],
    targetId: string,
    slot = "children",
    index = Infinity
  ) =>
    change((doc) => {
      const target = findNode(framesOf(doc), targetId)
      if (!target || !isEditable(doc, targetId)) return
      const roots = topSelected(doc, ids)
      if (target.path.some((node) => roots.includes(node.id))) return
      const list = insertionList(
        target.node,
        slot === "children" ? undefined : slot
      )
      if (!list) return
      const moving: Node[] = []
      let nextIndex = index
      for (const id of roots) {
        const location = findNode(framesOf(doc), id)
        if (!location || location.node.type === "frame" || !isEditable(doc, id))
          continue
        const oldIndex = list.findIndex((node) => node.id === id)
        if (oldIndex >= 0 && oldIndex < index) nextIndex--
        const node = location.node
        if (
          (target.node.type === "frame" || target.node.type === "box") &&
          !target.node.autoLayout &&
          location.parent?.id !== target.node.id
        ) {
          const measured = nodeRect(state.get(), node)
          const parentRect = nodeRect(state.get(), target.node)
          const position = node.layout?.position
          const absolute =
            location.parent?.type === "frame" && position && position !== "flow"
              ? {
                  x: location.frame.x + position.x,
                  y: location.frame.y + position.y,
                }
              : measured
          node.layout = {
            ...node.layout,
            position: {
              x: Math.round(
                (absolute?.x ?? (parentRect?.x ?? 0) + 40) -
                  (parentRect?.x ?? 0)
              ),
              y: Math.round(
                (absolute?.y ?? (parentRect?.y ?? 0) + 40) -
                  (parentRect?.y ?? 0)
              ),
            },
          }
        }
        detach(doc, id)
        if (
          (target.node.type === "frame" || target.node.type === "box") &&
          target.node.autoLayout
        )
          node.layout = { ...node.layout, position: "flow" }
        else if (target.node.type !== "frame" && target.node.type !== "box")
          node.layout = { ...node.layout, position: "flow" }
        moving.push(node)
      }
      list.splice(Math.min(list.length, Math.max(0, nextIndex)), 0, ...moving)
    })
  const group = () => {
    const s = state.get()
    if (s.rightTab === "inspect") return
    const ids = topSelected(s.doc, s.selectedIds)
    const locations = ids
      .map((id) => findNode(framesOf(s.doc), id))
      .filter((item) => item !== null)
    if (
      !locations.length ||
      locations.some(
        (item) =>
          !item.parent ||
          item.parent.id !== locations[0].parent?.id ||
          !isEditable(s.doc, item.node.id)
      )
    )
      return
    const groupNode = boxNode()
    if (groupNode.type !== "box") return
    change((doc) => {
      const parent = findNode(framesOf(doc), locations[0].parent!.id)!.node
      const list = childLists(parent).find((entry) =>
        entry.nodes.some((node) => node.id === ids[0])
      )!.nodes
      if (!ids.every((id) => list.some((node) => node.id === id))) return
      const position = Math.min(
        ...ids.map((id) => list.findIndex((node) => node.id === id))
      )
      groupNode.children = list.filter((node) => ids.includes(node.id))
      const first = groupNode.children[0]
      groupNode.layout = {
        width: { mode: "hug" },
        height: { mode: "hug" },
        position:
          (parent.type === "frame" || parent.type === "box") &&
          parent.autoLayout
            ? "flow"
            : (first.layout?.position ?? "flow"),
      }
      groupNode.children.forEach((node) => {
        node.layout = { ...node.layout, position: "flow" }
      })
      for (const id of ids) detach(doc, id)
      list.splice(position, 0, groupNode)
    })
    select(groupNode.id)
  }
  const wrapSelectionInAutoLayout = (direction?: "column" | "row" | "grid") => {
    const s = state.get()
    if (s.rightTab === "inspect") return false
    const ids = topSelected(s.doc, s.selectedIds)
    const locations = ids
      .map((id) => findNode(framesOf(s.doc), id))
      .filter((item) => item !== null)
    const parentId = locations[0]?.parent?.id
    if (
      !parentId ||
      !locations.length ||
      locations.some(
        (item) =>
          item.parent?.id !== parentId ||
          item.node.type === "frame" ||
          !isEditable(s.doc, item.node.id)
      )
    ) {
      set({ notice: "Sélectionnez des éléments d'une même frame." })
      return false
    }
    const sourceList = childLists(locations[0].parent!).find((entry) =>
      entry.nodes.some((node) => node.id === ids[0])
    )?.nodes
    if (
      !sourceList ||
      !ids.every((id) => sourceList.some((node) => node.id === id))
    ) {
      set({ notice: "Sélectionnez des éléments d'une même frame." })
      return false
    }
    const rects = locations.map((item) => nodeRect(s, item.node))
    const selectionBounds = bounds(rects.filter((rect) => rect !== null))
    const parentRect = nodeRect(s, locations[0].parent!)
    const resolvedDirection =
      direction ??
      (rects.length > 1 &&
      rects[0] &&
      rects[1] &&
      Math.abs(rects[1].x - rects[0].x) > Math.abs(rects[1].y - rects[0].y)
        ? "row"
        : "column")
    const ordered = [...locations].sort((a, b) => {
      const left = nodeRect(s, a.node)
      const right = nodeRect(s, b.node)
      return resolvedDirection === "row"
        ? (left?.x ?? 0) - (right?.x ?? 0) || (left?.y ?? 0) - (right?.y ?? 0)
        : (left?.y ?? 0) - (right?.y ?? 0) || (left?.x ?? 0) - (right?.x ?? 0)
    })
    const orderedRects = ordered.map((item) => nodeRect(s, item.node))
    const gaps = orderedRects.slice(1).map((rect, index) => {
      const previous = orderedRects[index]
      if (!rect || !previous) return 0
      return resolvedDirection === "row"
        ? rect.x - previous.x - previous.width
        : rect.y - previous.y - previous.height
    })
    const gap = Math.max(0, Math.round(gaps.length ? Math.min(...gaps) : 0))
    const wrapper = boxNode()
    if (wrapper.type !== "box") return false
    wrapper.name = "Frame auto layout"
    wrapper.style = {}
    wrapper.autoLayout = {
      direction: resolvedDirection,
      gap,
      padding: [0, 0, 0, 0],
      align: "start",
      ...(resolvedDirection === "grid" ? { gridColumns: 2 } : {}),
    }
    wrapper.layout = {
      width: { mode: "hug" },
      height: { mode: "hug" },
      position: {
        x: Math.round((selectionBounds?.x ?? 0) - (parentRect?.x ?? 0)),
        y: Math.round((selectionBounds?.y ?? 0) - (parentRect?.y ?? 0)),
      },
    }
    change((doc) => {
      const parent = findNode(framesOf(doc), parentId)?.node
      if (!parent) return
      const list = childLists(parent).find((entry) =>
        entry.nodes.some((node) => node.id === ids[0])
      )?.nodes
      if (!list || !ids.every((id) => list.some((node) => node.id === id)))
        return
      const position = Math.min(
        ...ids.map((id) => list.findIndex((node) => node.id === id))
      )
      wrapper.children = ordered.map((item, index) => {
        const node = list.find((entry) => entry.id === item.node.id)!
        const rect = orderedRects[index]
        node.layout = {
          ...node.layout,
          width: rect
            ? { mode: "fixed", value: Math.max(1, Math.round(rect.width)) }
            : node.layout?.width,
          height: rect
            ? { mode: "fixed", value: Math.max(1, Math.round(rect.height)) }
            : node.layout?.height,
          position: "flow",
        }
        return node
      })
      for (const id of ids) detach(doc, id)
      if (
        (parent.type === "frame" || parent.type === "box") &&
        parent.autoLayout
      )
        wrapper.layout = { ...wrapper.layout, position: "flow" }
      list.splice(position, 0, wrapper)
    })
    select(wrapper.id)
    return true
  }
  const ungroup = () => {
    if (state.get().rightTab === "inspect") return
    const id = state.get().selectedIds[0]
    if (!id) return
    change((doc) => {
      const location = findNode(framesOf(doc), id)
      if (
        !location?.parent ||
        location.node.type !== "box" ||
        !isEditable(doc, id)
      )
        return
      const list = childLists(location.parent).find((entry) =>
        entry.nodes.some((node) => node.id === id)
      )!.nodes
      const index = list.findIndex((node) => node.id === id)
      if (
        (location.parent.type === "frame" || location.parent.type === "box") &&
        !location.parent.autoLayout
      ) {
        const parent = location.parent
        const parentRect = nodeRect(state.get(), parent)
        for (const child of location.node.children) {
          const rect = nodeRect(state.get(), child)
          child.layout = {
            ...child.layout,
            position: {
              x: Math.round(
                (rect?.x ?? parentRect?.x ?? 0) - (parentRect?.x ?? 0)
              ),
              y: Math.round(
                (rect?.y ?? parentRect?.y ?? 0) - (parentRect?.y ?? 0)
              ),
            },
          }
        }
      }
      if (
        (location.parent.type === "frame" || location.parent.type === "box") &&
        location.parent.autoLayout
      )
        for (const child of location.node.children)
          child.layout = { ...child.layout, position: "flow" }
      list.splice(index, 1, ...location.node.children)
    })
    select(null)
  }
  const setViewport = (viewport: Viewport) => {
    canvas.setViewport(viewport)
    const next = canvas.viewport.get(),
      previous = state.get().viewport
    if (
      next.x !== previous.x ||
      next.y !== previous.y ||
      next.zoom !== previous.zoom
    )
      set({ viewport: next })
  }
  const zoomAt = (point: { x: number; y: number }, factor: number) => {
    canvas.zoomAt(point, factor)
    setViewport(canvas.viewport.get())
  }
  const replace = (doc: MockupDoc) => {
    if (state.get().rightTab === "inspect") return
    validateDocument(doc, library)
    change((draft) => {
      draft.pages = doc.pages
      draft.libVersion = doc.libVersion
    })
    select(null)
  }
  return {
    readOnly,
    state,
    canvas,
    set,
    setEditorMode,
    change,
    begin,
    commit,
    cancel,
    select,
    updateNodes,
    updateSelection,
    createLocalVariant,
    editLocalVariant,
    assignLocalVariant,
    insertLocalVariant,
    requestDetach,
    detachComponent,
    undo,
    redo,
    rename,
    setStatus,
    addFrame,
    insert,
    insertNodes,
    remove,
    duplicate,
    moveNodes,
    group,
    wrapSelectionInAutoLayout,
    ungroup,
    setViewport,
    zoomAt,
    replace,
  }
}
export type Editor = ReturnType<typeof createEditor>
