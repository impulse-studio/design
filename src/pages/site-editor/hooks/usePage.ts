import { useEffect, useState } from "react"
import { readScenarios } from "@/features/sites/scenarios"
import { useSiteEditor } from "@/features/sites/use-editor"
import { useSiteExport } from "@/features/sites/use-export"
import type { PreviewInventoryEntry } from "@/validators/sites/preview"
import type { Breakpoint } from "@/validators/sites/document"
import type { SiteRecord } from "@/features/sites/types"
import type { SiteRuntimeStatus } from "@/features/sites/runtime"
import { useSiteEditorPageData } from "./usePageData"
import { useSiteEditorShortcuts } from "./useShortcuts"
import type { SiteMode } from "@/pages/site-editor/components/Toolbar"

export type SiteEditorPageProps = {
  initial: SiteRecord
  mockupId: string
  name: string
  notionUrl: string | null
  githubUrl: string | null
  canEdit: boolean
}

export function useSiteEditorPage({
  initial,
  mockupId,
  name,
  notionUrl,
  githubUrl,
  canEdit,
}: SiteEditorPageProps) {
  const editor = useSiteEditor(initial, canEdit)
  const [mode, setMode] = useState<SiteMode>("navigation")
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [panel, setPanel] = useState("files")
  const [file, setFile] = useState<string | null>(null)
  const [fileLine, setFileLine] = useState<number | null>(null)
  const [scenarioId, setScenarioId] = useState("")
  const [path, setPath] = useState(() => {
    const config = readScenarios(initial.doc)
    return (
      config?.scenarios.find((item) => item.id === config.defaultId)?.path ??
      "/"
    )
  })
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("base")
  const [selection, setSelection] = useState<string | null>(null)
  const [count, setCount] = useState(1)
  const [selectedDomTag, setSelectedDomTag] = useState<string | null>(null)
  const [renderedElements, setRenderedElements] = useState<
    PreviewInventoryEntry[]
  >([])
  const [runtimeError, setRuntimeError] = useState<string | null>(null)
  const [runtimeStatus, setRuntimeStatus] = useState<SiteRuntimeStatus>({
    stage: "initializing",
    message: "Initialisation…",
  })
  const [command, setCommand] = useState<{
    type: "back" | "forward"
    sequence: number
  } | null>(null)

  const pageData = useSiteEditorPageData({
    initial,
    record: editor.record,
    scenarioId,
    selection,
  })
  const siteExport = useSiteExport(pageData.previewRecord.doc, name)

  useEffect(() => {
    if (pageData.activeScenario) setPath(pageData.activeScenario.path)
    setSelection(null)
    setCount(0)
    setSelectedDomTag(null)
    setRenderedElements([])
    setRuntimeError(null)
    setCommand(null)
  }, [pageData.activeScenario?.id, pageData.activeScenario?.path])

  useEffect(() => {
    setRuntimeError(null)
    setRenderedElements([])
  }, [editor.record.revision])
  useSiteEditorShortcuts(editor)
  const runtimeBusy = runtimeStatus.stage !== "ready"

  const selectScenario = (id: string) => {
    setFile(null)
    setFileLine(null)
    const next = pageData.config?.scenarios.find((item) => item.id === id)
    if (next) setPath(next.path)
    setScenarioId(id)
  }
  const changeMode = (next: SiteMode) => {
    setFile(null)
    setFileLine(null)
    setMode(next)
  }
  const reload = () => {
    void editor
      .reload()
      .catch(() => editor.setError("Rechargement impossible."))
  }
  const selectPreviewElement = (
    id: string,
    occurrences: number,
    domTag: string | null
  ) => {
    setSelection(id || null)
    setCount(occurrences)
    setSelectedDomTag(domTag)
  }
  const selectInspectorElement = (id: string) => {
    setSelection(id)
    setCount(1)
    setSelectedDomTag(null)
  }
  const openFile = (filePath: string, line: number | null = null) => {
    setFile(filePath)
    setFileLine(line)
  }
  const selectFile = (selectedPath: string) => openFile(selectedPath)
  const closeFile = () => {
    setFile(null)
    setFileLine(null)
  }
  const routeChanged = (nextPath: string) => {
    if (nextPath !== path) {
      setSelection(null)
      setCount(0)
      setSelectedDomTag(null)
      setRenderedElements([])
    }
    setPath(nextPath)
  }
  const changeSelection = (id: string | null) => {
    setSelection(id)
    setSelectedDomTag(null)
  }

  return {
    sidebarVisible,
    toolbar: {
      sidebarVisible,
      onToggleSidebar: () => setSidebarVisible((visible) => !visible),
      name,
      mockupId,
      notionUrl,
      githubUrl,
      busy: editor.busy || runtimeBusy,
      canEdit,
      canUndo: editor.canUndo,
      canRedo: editor.canRedo,
      onUndo: editor.undo,
      onRedo: editor.redo,
      ...siteExport,
    },
    sidebar: {
      record: editor.record,
      canEdit,
      onUpdated: editor.reload,
      panel,
      onPanelChange: setPanel,
      doc: editor.record.doc,
      file,
      onSelectFile: selectFile,
    },
    workspace: {
      previewToolbar: {
        scenarios: pageData.config?.scenarios ?? [],
        scenarioId: pageData.activeScenario?.id ?? "",
        breakpoint,
        onScenario: selectScenario,
        onBreakpoint: setBreakpoint,
        onBack: () => setCommand({ type: "back", sequence: Date.now() }),
        onForward: () => setCommand({ type: "forward", sequence: Date.now() }),
      },
      onSaveFile: editor.saveFile,
      record: editor.record,
      previewRecord: pageData.previewRecord,
      sourceElements: pageData.elements,
      mode,
      onMode: changeMode,
      breakpoint,
      path,
      file,
      fileLine,
      selection,
      command,
      busy: editor.busy,
      error: editor.error || runtimeError,
      canEdit,
      onReload: reload,
      onCloseFile: closeFile,
      onSelectElement: selectPreviewElement,
      onInventory: setRenderedElements,
      onRoute: routeChanged,
      onError: setRuntimeError,
      onRuntimeStatus: setRuntimeStatus,
    },
    inspector: {
      mode,
      elements: pageData.elements,
      renderedElements,
      element: pageData.element,
      domTag: selectedDomTag,
      count,
      elementStatus: pageData.elementStatus,
      statusById: pageData.statusById,
      selection,
      breakpoint,
      revision: editor.record.revision,
      doc: editor.record.doc,
      busy: editor.busy || runtimeBusy,
      canEdit,
      onSelectElement: selectInspectorElement,
      onOpenFile: openFile,
      onEdit: editor.edit,
      onSelectionChange: changeSelection,
    },
  }
}
