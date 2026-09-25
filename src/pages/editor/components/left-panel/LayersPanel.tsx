import { useState } from "react"
import { RiAddLine, RiSearchLine, RiArtboard2Line } from "@remixicon/react"
import { walk, nodeLabel } from "@digit-ai-studio/shared"
import { useEditor, useEditorState } from "@/features/editor/context"
import { framesOf } from "@/features/editor/document"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"
import { LayerRow } from "./LayerRow"

export function LayersPanel() {
  const editor = useEditor(),
    inspect = useEditorState((s) => s.rightTab === "inspect"),
    frames = useEditorState((s) => framesOf(s.doc)),
    [query, setQuery] = useState("")
  const visible = frames.filter((frame) => {
    const matches: string[] = []
    walk(frame, (node) => {
      if (nodeLabel(node).toLowerCase().includes(query.toLowerCase()))
        matches.push(node.id)
    })
    return matches.length > 0
  })
  return (
    <div className="editor-layers h-full flex flex-col min-h-0">
      <div className="editor-pages flex flex-col gap-2.5 py-4 px-3 [&_>_span]:text-[11px] [&_>_span]:font-medium">
        <span>Pages</span>
        <Button variant="secondary" size="sm" className="w-full justify-start">
          <RiArtboard2Line data-icon="inline-start" />
          Page 1
        </Button>
      </div>
      <Separator />
      <div className="flex items-center justify-between px-3 pt-3">
        <span className="text-xs font-medium">Calques</span>
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label="Ajouter une frame"
          disabled={inspect}
          onClick={() => editor.addFrame()}
        >
          <RiAddLine />
        </Button>
      </div>
      <div className="p-3">
        <InputGroup>
          <InputGroupAddon>
            <RiSearchLine />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Rechercher un calque…"
            aria-label="Rechercher un calque"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </InputGroup>
      </div>
      <div
        className="editor-layers-tree flex-1 min-h-0 overflow-auto pb-5 [scrollbar-width:thin]"
        role="tree"
        aria-label="Calques"
        aria-multiselectable
      >
        {visible.map((frame) => (
          <LayerRow key={frame.id} node={frame} />
        ))}
      </div>
    </div>
  )
}
