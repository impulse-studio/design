import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { OptionSelect } from "@/components/shared/OptionSelect"
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiDownloadLine,
  RiArrowGoBackLine,
  RiArrowGoForwardLine,
} from "@remixicon/react"
import { SiteScenarioSelect } from "./ScenarioSelect"
import type { SiteScenario } from "@/features/sites/scenarios"
import type { Breakpoint } from "@/features/sites/schema"
import { MockupLinks } from "@/components/mockups/MockupLinks"

export type SiteMode = "navigation" | "dev" | "edit"

export function SiteToolbar({
  name,
  mockupId,
  notionUrl,
  githubUrl,
  scenarios,
  scenarioId,
  onCreateScenarios,
  scenariosBusy,
  breakpoint,
  busy,
  canEdit,
  canUndo,
  canRedo,
  onScenario,
  onBreakpoint,
  onBack,
  onForward,
  onUndo,
  onRedo,
  onExport,
}: {
  name: string
  mockupId: string
  notionUrl: string | null
  githubUrl: string | null
  scenarios: SiteScenario[]
  scenarioId: string
  onCreateScenarios: () => void
  scenariosBusy: boolean
  breakpoint: Breakpoint
  busy: boolean
  canEdit: boolean
  canUndo: boolean
  canRedo: boolean
  onScenario: (id: string) => void
  onBreakpoint: (value: Breakpoint) => void
  onBack: () => void
  onForward: () => void
  onUndo: () => void
  onRedo: () => void
  onExport: () => void
}) {
  return (
    <header className="site-toolbar min-h-[60px] flex items-center gap-3 py-2.5 px-4 border-b border-border flex-wrap">
      <Link to="/" aria-label="Retour au studio">
        <RiArrowLeftLine className="size-4" />
      </Link>
      <span className="site-project-name text-[13px] font-medium max-w-[160px] overflow-hidden text-ellipsis whitespace-nowrap">{name}</span>
      <MockupLinks
        id={mockupId}
        notionUrl={notionUrl}
        githubUrl={githubUrl}
        canEdit={canEdit}
      />
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Page précédente"
          onClick={onBack}
        >
          <RiArrowLeftLine />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Page suivante"
          onClick={onForward}
        >
          <RiArrowRightLine />
        </Button>
        <SiteScenarioSelect
          scenarios={scenarios}
          value={scenarioId}
          onChange={onScenario}
          onCreate={onCreateScenarios}
          disabled={!canEdit || busy || scenariosBusy}
        />
      </div>
      <OptionSelect
        label="Taille de l’aperçu"
        triggerClassName="w-auto"
        value={breakpoint}
        onValueChange={(value) => onBreakpoint(value as Breakpoint)}
        options={[
          { value: "base", label: "Desktop · 1280" },
          { value: "tablet", label: "Tablette · 834" },
          { value: "mobile", label: "Mobile · 390" },
        ]}
      />
      <div className="ml-auto flex gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Annuler"
          disabled={busy || !canEdit || !canUndo}
          onClick={onUndo}
        >
          <RiArrowGoBackLine />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Rétablir"
          disabled={busy || !canEdit || !canRedo}
          onClick={onRedo}
        >
          <RiArrowGoForwardLine />
        </Button>
        <Button variant="outline" size="sm" disabled={busy} onClick={onExport}>
          <RiDownloadLine data-icon="inline-start" />
          Exporter ZIP
        </Button>
      </div>
    </header>
  )
}
