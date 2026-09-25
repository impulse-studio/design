import { cn } from "@/lib/utils"

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="flex size-6 items-center justify-center rounded-md bg-secondary text-foreground"
        aria-hidden="true"
      >
        <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
          <path
            d="M4 4h5.5a6 6 0 0 1 0 12H4V4Z"
            stroke="currentColor"
            strokeWidth="2.3"
          />
          <path d="M8 4v12" stroke="currentColor" strokeWidth="2.3" />
        </svg>
      </span>
      <span
        className={cn(
          "text-base font-semibold tracking-[-0.045em] text-foreground",
          compact && "sr-only"
        )}
      >
        digit
        <span className="ml-1.5 font-normal text-muted-foreground">ui</span>
      </span>
    </div>
  )
}
