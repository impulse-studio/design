import { OptionSelect } from "@/components/shared/OptionSelect"
import { Button } from "@/components/ui/button"
import type { SiteScenario } from "@/features/sites/scenarios"

export function SiteScenarioSelect({
  scenarios,
  value,
  onChange,
  onCreate,
  disabled,
}: {
  scenarios: SiteScenario[]
  value: string
  onChange: (id: string) => void
  onCreate: () => void
  disabled: boolean
}) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="text-xs text-muted-foreground">Scénario</span>
      {scenarios.length ? (
        <OptionSelect
          label="Scénario de la maquette"
          value={value}
          onValueChange={onChange}
          options={scenarios.map((scenario) => ({
            value: scenario.id,
            label: scenario.name,
          }))}
        />
      ) : (
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={onCreate}
        >
          Ajouter des scénarios
        </Button>
      )}
    </div>
  )
}
