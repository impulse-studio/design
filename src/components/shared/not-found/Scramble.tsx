import { useEffect, useState } from "react"
import { useReducedMotion } from "motion/react"

const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&@$?/\\"
const SCRAMBLE_MS = 700
const TICK_MS = 45

/**
 * Renders the code, scrambling each character on mount before it settles.
 * SSR and the first paint show the real code, so the scramble is a pure
 * client-side enhancement and reduced-motion users see the code immediately.
 */
export function Scramble({ text }: { text: string }) {
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState(text)

  useEffect(() => {
    if (reduce) {
      setDisplay(text)
      return
    }
    const chars = text.split("")
    const start = performance.now()
    let raf = 0
    let last = 0

    const loop = (now: number) => {
      if (now - last >= TICK_MS) {
        last = now
        const progress = Math.min((now - start) / SCRAMBLE_MS, 1)
        const settled = Math.floor(progress * chars.length)
        setDisplay(
          chars
            .map((ch, i) =>
              i < settled || ch === " "
                ? ch
                : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
            )
            .join("")
        )
      }
      if (now - start < SCRAMBLE_MS) {
        raf = requestAnimationFrame(loop)
      } else {
        setDisplay(text)
      }
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [text, reduce])

  return <span className="tabular-nums">{display}</span>
}
