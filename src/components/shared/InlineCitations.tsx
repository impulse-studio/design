import { RiArrowRightUpLine } from "@remixicon/react"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import styles from "./InlineCitations.module.css"

export type CiteRef = { n: number; label: string; host: string; url: string }

export function InlineCitations({
  text,
  refs,
}: {
  text: string
  refs: CiteRef[]
}) {
  // Markers like [1] in the text become small numbered chips that link to
  // the source and reveal the reference name in a tooltip on hover.
  const parts = text.split(/(\[\d+\])/g)
  return (
    <div className={styles.citeProse}>
      <p>
        {parts.map((part, i) => {
          const m = part.match(/^\[(\d+)\]$/)
          if (!m) return <span key={i}>{part}</span>
          const r = refs.find((x) => x.n === Number(m[1]))
          return r ? (
            <Tooltip key={i}>
              <TooltipTrigger
                render={<a href={r.url} target="_blank" rel="noreferrer" />}
                className={styles.citeMark}
                aria-label={`Source ${r.n} : ${r.label}`}
              >
                {r.n}
              </TooltipTrigger>
              <TooltipContent>{r.label}</TooltipContent>
            </Tooltip>
          ) : (
            <span key={i} className={styles.citeMark}>
              {m[1]}
            </span>
          )
        })}
      </p>
      <div className={styles.citeFooter}>
        {refs.map((r) => (
          <a
            key={r.n}
            className={styles.citeRef}
            href={r.url}
            target="_blank"
            rel="noreferrer"
          >
            <span className={styles.citeMark}>{r.n}</span>
            <span className={styles.citeRefLabel}>{r.label}</span>
            <span className={styles.citeSep}>·</span>
            <span className={styles.citeRefHost}>{r.host}</span>
            <span className={styles.citeArrow} aria-hidden>
              <RiArrowRightUpLine size={12} />
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
