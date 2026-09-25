import type { Alignment } from "./arrange"
import { useEffect } from "react"
import { childLists, findNode } from "@digit-ai-studio/shared"
import { useEditor } from "./context"
import { framesOf } from "./document"
import { copySelection, pasteSelection } from "./clipboard"
import { isEditable, topSelected } from "./tree"
import { alignSelection, orderSelection } from "./arrange"
import { addAutoLayoutToSelection, setAutoLayout } from "./auto-layout"

export const useShortcuts = (
  fit: (selection?: boolean) => void,
  zoomTo: (zoom: number) => void,
  openLibrary?: () => void
) => {
  const editor = useEditor()
  useEffect(() => {
    let nudging = false
    const finishNudge = () => {
      if (nudging) {
        nudging = false
        editor.commit()
      }
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing) return
      const target = event.target instanceof HTMLElement ? event.target : null
      if (
        target?.closest(
          "input,textarea,select,[contenteditable=true],[role=combobox],[role=slider],[role=spinbutton],[role=dialog],[role=menu],[role=listbox]"
        )
      )
        return
      if (
        target?.closest("button,[role=tab],[role=treeitem]") &&
        (event.key.startsWith("Arrow") ||
          event.key === "Enter" ||
          event.code === "Space")
      )
        return
      const key = event.key.toLowerCase(),
        mod = event.metaKey || event.ctrlKey,
        s = editor.state.get()
      if (key === "escape") {
        event.preventDefault()
        const editing =
          s.editingTextId ||
          s.transaction ||
          s.tool !== "move" ||
          s.mode === "preview"
        editor.cancel()
        nudging = false
        editor.set({
          mode: "edit",
          editingTextId: null,
          tool: "move",
          enteredId: null,
        })
        if (!editing) editor.select(null)
        return
      }
      if (!mod && !event.altKey && event.shiftKey && key === "d") {
        event.preventDefault()
        if (!event.repeat)
          editor.setEditorMode(s.rightTab === "inspect" ? "design" : "inspect")
        return
      }
      if (!mod && !event.altKey && event.shiftKey && key === "p") {
        event.preventDefault()
        if (event.repeat) return
        editor.commit()
        editor.set({
          mode: s.mode === "preview" ? "edit" : "preview",
          editingTextId: null,
        })
        return
      }
      if (
        !mod &&
        !event.altKey &&
        (key === "+" || key === "=" || key === "-")
      ) {
        event.preventDefault()
        zoomTo(s.viewport.zoom * (key === "-" ? 1 / 1.25 : 1.25))
        return
      }
      if (
        !mod &&
        !event.altKey &&
        event.shiftKey &&
        ["Digit0", "Digit1", "Digit2"].includes(event.code)
      ) {
        event.preventDefault()
        if (event.code === "Digit0") zoomTo(1)
        else fit(event.code === "Digit2")
        return
      }
      if (mod && key === "0") {
        event.preventDefault()
        zoomTo(1)
        return
      }
      if (s.mode === "preview") return
      if (mod && key === "c") {
        event.preventDefault()
        void copySelection(editor)
        return
      }
      if (mod && key === "a") {
        event.preventDefault()
        const entered = s.enteredId
          ? findNode(framesOf(s.doc), s.enteredId)?.node
          : null
        editor.set({
          selectedIds: (entered
            ? childLists(entered).flatMap((list) => list.nodes)
            : framesOf(s.doc)
          )
            .filter((n) => !n.hidden && (s.rightTab === "inspect" || !n.locked))
            .map((n) => n.id),
        })
        return
      }
      if (
        !mod &&
        !event.altKey &&
        !event.shiftKey &&
        (key === "v" || key === "h")
      ) {
        editor.set({ tool: key === "v" ? "move" : "hand" })
        return
      }
      // Inspection allows selection, copying and navigation, never document edits.
      if (s.rightTab === "inspect") {
        if (
          (mod && ["x", "v", "z", "d", "g"].includes(key)) ||
          key === "backspace" ||
          key === "delete"
        )
          event.preventDefault()
        return
      }
      if (!mod && event.shiftKey && key === "a") {
        const selected = s.selectedIds.map(
          (id) => findNode(framesOf(s.doc), id)?.node
        )
        if (!selected.length || selected.some((node) => !node)) return
        event.preventDefault()
        if (event.altKey) {
          if (
            selected.every(
              (node) => node?.type === "frame" || node?.type === "box"
            )
          )
            setAutoLayout(editor, null)
        } else addAutoLayoutToSelection(editor)
        return
      }
      if (event.altKey && !mod && !event.shiftKey) {
        const alignment: Partial<Record<string, Alignment>> = {
          a: "left",
          h: "center",
          d: "right",
          w: "top",
          v: "middle",
          s: "bottom",
        }
        const code = event.code.replace("Key", "").toLowerCase()
        if (alignment[code]) {
          event.preventDefault()
          alignSelection(editor, alignment[code])
          return
        }
      }
      if (
        mod &&
        (event.code === "BracketLeft" || event.code === "BracketRight")
      ) {
        event.preventDefault()
        orderSelection(
          editor,
          event.code === "BracketRight"
            ? event.shiftKey
              ? "front"
              : "forward"
            : event.shiftKey
              ? "back"
              : "backward"
        )
        return
      }
      if (mod && key === "x") {
        event.preventDefault()
        const ids = [...s.selectedIds]
        void copySelection(editor).then(() => {
          if (editor.state.get().selectedIds.join() === ids.join())
            editor.remove()
        })
        return
      }
      if (event.shiftKey && mod && (key === "h" || key === "l")) {
        event.preventDefault()
        editor.updateSelection((node) => {
          if (key === "h") node.hidden = !node.hidden
          else node.locked = !node.locked
        }, true)
        return
      }
      if (mod && key === "z") {
        event.preventDefault()
        event.shiftKey ? editor.redo() : editor.undo()
        return
      }
      if (mod && key === "d") {
        event.preventDefault()
        editor.duplicate()
        return
      }
      if (mod && key === "v") {
        event.preventDefault()
        void pasteSelection(editor)
        return
      }
      if (mod && key === "g") {
        event.preventDefault()
        event.shiftKey ? editor.ungroup() : editor.group()
        return
      }
      if (key === "delete" || key === "backspace") {
        event.preventDefault()
        editor.remove()
        return
      }
      if (
        !mod &&
        !event.altKey &&
        event.key.startsWith("Arrow") &&
        s.selectedIds.length
      ) {
        event.preventDefault()
        if (!nudging) {
          editor.begin()
          nudging = true
        }
        const step = event.shiftKey ? 10 : 1
        editor.updateNodes(topSelected(s.doc, s.selectedIds), (node) => {
          const dx =
              event.key === "ArrowRight"
                ? step
                : event.key === "ArrowLeft"
                  ? -step
                  : 0,
            dy =
              event.key === "ArrowDown"
                ? step
                : event.key === "ArrowUp"
                  ? -step
                  : 0
          if (node.type === "frame") {
            node.x += dx
            node.y += dy
          } else if (node.layout?.position && node.layout.position !== "flow") {
            node.layout.position.x += dx
            node.layout.position.y += dy
          }
        })
        return
      }
      if (!mod && !event.altKey && !event.shiftKey) {
        if (key === "f") editor.set({ tool: "frame" })
        if (key === "r") editor.set({ tool: "box" })
        if (key === "t") editor.set({ tool: "text" })
        if (key === "i") {
          if (openLibrary) openLibrary()
          else editor.set({ tab: "components", libraryVisible: true })
        }
        if (key === "enter" && s.selectedIds.length === 1) {
          const node = findNode(framesOf(s.doc), s.selectedIds[0])?.node
          if (node && isEditable(s.doc, node.id))
            editor.set({
              enteredId: node.id,
              editingTextId:
                node.type === "text" ||
                (node.type === "component" && node.text !== undefined)
                  ? node.id
                  : null,
            })
        }
      }
    }
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key.startsWith("Arrow")) finishNudge()
    }
    window.addEventListener("keydown", onKey)
    window.addEventListener("keyup", onKeyUp)
    window.addEventListener("blur", finishNudge)
    return () => {
      finishNudge()
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("keyup", onKeyUp)
      window.removeEventListener("blur", finishNudge)
    }
  }, [editor, fit, openLibrary, zoomTo])
}
