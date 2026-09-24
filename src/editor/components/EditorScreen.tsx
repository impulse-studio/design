import type { MockupDoc } from "@digit-ai-studio/shared"
import { RiArrowLeftSLine } from "@remixicon/react"
import { Link } from "@tanstack/react-router"
import { useState } from "react"

import { Panel, PanelBody, PanelHeader } from "@/components/studio"

import { LEFT_PANEL_WIDTH, RIGHT_PANEL_WIDTH } from "../constants"
import { EditorProvider } from "../context"
import { createEditorStore } from "../store"
import { useShortcuts } from "../useShortcuts"
import { Canvas } from "./Canvas"
import { InspectorPanel } from "./inspector/InspectorPanel"
import { LayersPanel } from "./LayersPanel"
import { Toolbar } from "./Toolbar"

function EditorLayout({ name }: { name: string }) {
  useShortcuts()
  return (
    <div className="flex h-svh w-full overflow-hidden bg-background text-foreground">
      <Panel side="left" width={LEFT_PANEL_WIDTH}>
        <PanelHeader>
          <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground" aria-label="Retour">
            <RiArrowLeftSLine className="size-4" />
          </Link>
          <span className="truncate font-semibold">{name}</span>
        </PanelHeader>
        <PanelBody>
          <LayersPanel />
        </PanelBody>
      </Panel>
      <div className="relative flex min-w-0 flex-1">
        <Canvas />
        <Toolbar />
      </div>
      <Panel side="right" width={RIGHT_PANEL_WIDTH}>
        <InspectorPanel />
      </Panel>
    </div>
  )
}

export function EditorScreen({ name, doc }: { name: string; doc: MockupDoc }) {
  const [store] = useState(() => createEditorStore(doc))
  return (
    <EditorProvider store={store}>
      <EditorLayout name={name} />
    </EditorProvider>
  )
}
