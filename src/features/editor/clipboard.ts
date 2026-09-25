import { clipboardSchema } from "@/validators/editor"

import { findNode, validateDocument } from "@digit-ai-studio/shared"
import type { Editor } from "./store"
import { library } from "./library"
import { framesOf } from "./document"
import { freshClone, topSelected } from "./tree"

let fallback = ""
export const copySelection = async (editor: Editor) => {
  const state = editor.state.get()
  const nodes = topSelected(state.doc, state.selectedIds).map(
    (id) => findNode(framesOf(state.doc), id)!.node
  )
  fallback = JSON.stringify({ type: "digit-nodes", nodes })
  try {
    await navigator.clipboard.writeText(fallback)
  } catch {
    editor.set({ notice: "Copié dans le presse-papiers de l’éditeur." })
  }
}
export const pasteSelection = async (editor: Editor) => {
  let text = fallback
  try {
    text = await navigator.clipboard.readText()
  } catch {
    /* The in-app clipboard works without permission. */
  }
  try {
    const parsed = clipboardSchema.safeParse(JSON.parse(text))
    if (!parsed.success) return
    editor.begin()
    for (const node of parsed.data.nodes) {
      if (node.type === "frame") {
        const frame = freshClone(node)
        frame.x += 80
        frame.y += 80
        editor.change((doc) => {
          framesOf(doc).push(frame)
        })
        editor.select(frame.id)
      } else editor.insertNodes([node])
    }
    validateDocument(editor.state.get().doc, library)
    editor.commit()
  } catch {
    editor.cancel()
    editor.set({
      notice: "Le presse-papiers ne contient pas de calques Digit valides.",
    })
  }
}
