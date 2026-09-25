import { useEffect, useState } from "react"
import type { ComponentProps } from "react"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react"
import { Slider } from "@/components/ui/slider"
import { cn } from "cn"
import styles from "./range-slider.module.css"

export type RangeSliderProps = Omit<
  ComponentProps<typeof Slider>,
  "value" | "defaultValue" | "orientation" | "children" | "className"
> & {
  value?: number
  defaultValue?: number
  showTicks?: boolean
  className?: string
}

// Be UI range-slider visuals composed over the project's shadcn control.
export function RangeSlider({
  value,
  defaultValue = 50,
  min = 0,
  max = 100,
  step = 1,
  showTicks = true,
  disabled,
  className,
  onValueChange,
  ...props
}: RangeSliderProps) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const [dragging, setDragging] = useState(false)
  const current = value ?? internalValue
  const percent =
    max > min
      ? Math.min(100, Math.max(0, ((current - min) / (max - min)) * 100))
      : 0
  const reduce = useReducedMotion()
  const target = useMotionValue(percent)
  const smooth = useSpring(target, { stiffness: 400, damping: 35, mass: 0.7 })
  const position = reduce ? target : smooth
  const thumbLeft = useTransform(
    position,
    (p) => `calc(${p}% + ${8 - p * 0.2}px)`
  )
  const fillX = useTransform(position, (p) =>
    p >= 100 ? "0%" : `calc(${p - 100}% + ${14 - 0.16 * p}px)`
  )
  useEffect(() => {
    target.set(percent)
  }, [percent, target])
  const steps =
    step > 0 ? Math.floor(Number(((max - min) / step).toFixed(6))) : 0
  const ticks =
    showTicks && steps > 0 && steps <= 50
      ? Array.from(
          { length: steps + 1 },
          (_, index) => ((index * step) / (max - min)) * 100
        )
      : []
  return (
    <div
      className={cn(
        "relative h-10 w-full rounded-lg bg-muted",
        disabled && "opacity-50",
        styles.root,
        className
      )}
      onPointerDownCapture={() => {
        if (!disabled) setDragging(true)
      }}
      onPointerUpCapture={() => setDragging(false)}
      onPointerCancelCapture={() => setDragging(false)}
      onLostPointerCapture={() => setDragging(false)}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0.5 inset-y-0 overflow-hidden rounded-lg"
      >
        <motion.div
          className="absolute inset-0 rounded-lg bg-foreground/15"
          style={{ x: fillX }}
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-2.5 inset-y-0"
      >
        {ticks.map((tick) => (
          <span
            key={tick}
            className="absolute top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/25"
            style={{ left: `${tick}%` }}
          />
        ))}
      </div>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute top-2 h-6 w-1 rounded-full bg-foreground"
        style={{ left: thumbLeft }}
        animate={{ scaleY: dragging && !disabled ? 1.35 : 1 }}
        transition={
          reduce
            ? { duration: 0 }
            : { type: "spring", stiffness: 500, damping: 14, mass: 0.7 }
        }
      />
      <Slider
        {...props}
        thumbProps={{
          "aria-label": props["aria-label"],
          "aria-labelledby": props["aria-labelledby"],
        }}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        value={[current]}
        onValueChange={(next, details) => {
          const number = Array.isArray(next) ? next[0] : next
          if (value === undefined) setInternalValue(number)
          onValueChange?.(number, details)
        }}
        className={styles.control}
      />
    </div>
  )
}
