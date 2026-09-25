import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"

function Input({
  className,
  type,
  controlSize = "default",
  ...props
}: React.ComponentProps<"input"> & { controlSize?: "sm" | "default" | "lg" }) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      data-size={controlSize}
      className={cn(
        "h-8 w-full min-w-0 rounded-md border border-input bg-control px-2.5 py-1 text-base shadow-(--shadow-control) transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=lg]:h-10 data-[size=sm]:h-7 md:text-[13px] dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
