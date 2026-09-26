import { OptionSelect } from "@/components/shared/OptionSelect"
import type { SiteScenario } from "@/validators/sites/scenarios"

export function SiteScenarioSelect({
  scenarios,
  value,
  onChange,
}: {
  scenarios: SiteScenario[]
  value: string
  onChange: (id: string) => void
}) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="text-xs text-muted-foreground">Scénario</span>
      <OptionSelect
        label="Scénario de la maquette"
        value={value}
        onValueChange={onChange}
        options={scenarios.map((scenario) => ({
          value: scenario.id,
          label: scenario.name,
        }))}
      />
    </div>
  )
}
