import { useEffect, useRef } from "react"
import { useSidebar } from "@/components/ui/sidebar"

export function ShellFit({ minWidth }: { minWidth: number }) {
  const { open, setOpen } = useSidebar()
  const markerRef = useRef<HTMLDivElement>(null)
  const narrowRef = useRef<boolean | null>(null)
  const openRef = useRef(open)
  openRef.current = open

  useEffect(() => {
    const shell = markerRef.current?.parentElement
    if (!shell || typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver((entries) => {
      const entry = entries.at(0)
      if (!entry) return
      const narrow = entry.contentRect.width < minWidth
      if (narrowRef.current === narrow) return
      const first = narrowRef.current === null
      narrowRef.current = narrow
      if (first && !narrow) return
      const wanted = !narrow
      // Already where the shell wants it — saying so again would only be an
      // onOpenChange the caller never asked for.
      if (openRef.current === wanted) return
      setOpen(wanted)
    })
    observer.observe(shell)
    return () => observer.disconnect()
  }, [minWidth, setOpen])

  return <div ref={markerRef} className="hidden" />
}
