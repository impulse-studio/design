import { RiArrowLeftLine, RiArrowRightLine, RiMoreLine } from "@remixicon/react"
import { Button } from "@/components/ui/button"
import { OptionSelect } from "@/components/shared/OptionSelect"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Breakpoint } from "@/validators/sites/document"
import type { SiteScenario } from "@/validators/sites/scenarios"
import { SiteScenarioSelect } from "./ScenarioSelect"

export function SitePreviewToolbar({
  scenarios,
  scenarioId,
  onScenario,
  onCreateScenarios,
  scenariosBusy,
  breakpoint,
  onBreakpoint,
  onBack,
  onForward,
  canEdit,
  busy,
}: {
  scenarios: SiteScenario[]
  scenarioId: string
  onScenario: (id: string) => void
  onCreateScenarios: () => void
  scenariosBusy: boolean
  breakpoint: Breakpoint
  onBreakpoint: (value: Breakpoint) => void
  onBack: () => void
  onForward: () => void
  canEdit: boolean
  busy: boolean
}) {
  return (
    <div
      role="toolbar"
      aria-label="Contrôles de l’aperçu"
      className="flex min-h-12 shrink-0 flex-wrap items-center gap-2 border-b border-border/60 bg-background px-3 py-1.5 text-muted-foreground"
    >
      <div className="flex items-center">
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
      </div>
      {scenarios.length > 0 && (
        <SiteScenarioSelect
          scenarios={scenarios}
          value={scenarioId}
          onChange={onScenario}
          onCreate={onCreateScenarios}
          disabled={!canEdit || busy || scenariosBusy}
        />
      )}
      <div className="ml-auto flex items-center gap-1">
        <OptionSelect
          label="Taille de l’aperçu"
          triggerClassName="w-auto border-transparent bg-transparent text-xs shadow-none"
          value={breakpoint}
          onValueChange={(value) => {
            if (value === "base" || value === "tablet" || value === "mobile")
              onBreakpoint(value)
          }}
          options={[
            { value: "base", label: "Desktop · 1280" },
            { value: "tablet", label: "Tablette · 834" },
            { value: "mobile", label: "Mobile · 390" },
          ]}
        />
        {scenarios.length === 0 && canEdit && (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Options de l’aperçu"
                />
              }
            >
              <RiMoreLine />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                disabled={busy || scenariosBusy}
                onClick={onCreateScenarios}
              >
                Ajouter des scénarios
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}
