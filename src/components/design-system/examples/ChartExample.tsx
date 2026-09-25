import source from "./ChartExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { BarChart, Bar, CartesianGrid, XAxis } from "recharts"

export function ChartExample() {
  const data = [
    { day: "Lun", screens: 12 },
    { day: "Mar", screens: 19 },
    { day: "Mer", screens: 16 },
    { day: "Jeu", screens: 28 },
    { day: "Ven", screens: 23 },
    { day: "Sam", screens: 8 },
    { day: "Dim", screens: 11 },
  ]
  return (
    <div className="w-full max-w-lg">
      <ChartContainer
        config={{ screens: { label: "Écrans", color: "var(--chart-1)" } }}
        className="h-44 w-full"
      >
        <BarChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="day" tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="screens"
            fill="var(--color-screens)"
            radius={[3, 3, 0, 0]}
            isAnimationActive={false}
          />
        </BarChart>
      </ChartContainer>
      <p className="body-copy text-[13px] leading-[1.55] mt-3 text-center">Écrans créés cette semaine</p>
    </div>
  )
}
// @example:end

export const getCode = createExampleCode(source)
