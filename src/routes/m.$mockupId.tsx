import { demoDoc } from "@digit-ai-studio/shared"
import { createFileRoute } from "@tanstack/react-router"

import { EditorScreen } from "@/editor/components/EditorScreen"

// Mockups are loaded from the database in M2; until then every id opens the demo.
export const Route = createFileRoute("/m/$mockupId")({
  ssr: false,
  component: MockupEditor,
})

function MockupEditor() {
  return <EditorScreen name="Relance des invités (démo)" doc={demoDoc} />
}
