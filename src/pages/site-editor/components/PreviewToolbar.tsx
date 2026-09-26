import { RiArrowLeftLine, RiArrowRightLine } from "@remixicon/react"
import { Button } from "@/components/ui/button"
import { OptionSelect } from "@/components/shared/OptionSelect"
import type { Breakpoint } from "@/validators/sites/document"
import type { SiteScenario } from "@/validators/sites/scenarios"
import { SiteScenarioSelect } from "./ScenarioSelect"

export function SitePreviewToolbar({
  scenarios,
  scenarioId,
  onScenario,
  breakpoint,
  onBreakpoint,
  onBack,
  onForward,
}: {
  scenarios: SiteScenario[]
  scenarioId: string
  onScenario: (id: string) => void
  breakpoint: Breakpoint
  onBreakpoint: (value: Breakpoint) => void
  onBack: () => void
  onForward: () => void
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
      </div>
    </div>
  )
}
