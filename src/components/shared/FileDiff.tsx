import { useEffect, useRef } from "react"
import type { ReactNode } from "react"
import { RiCodeSLine } from "@remixicon/react"
import { cn } from "@/lib/utils"
import { tokenize } from "@/lib/tokenize-code"
import styles from "./FileDiff.module.css"

export type FileDiffRow = {
  old: number | null
  cur: number | null
  type: "ctx" | "add" | "del"
  text: string
}

export function FileDiff({
  file,
  rows,
  actions,
  mode = "diff",
  focusLine,
}: {
  file: string
  rows: FileDiffRow[]
  actions?: ReactNode
  mode?: "code" | "diff"
  focusLine?: number | null
}) {
  const focusRow = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (focusLine !== null && focusLine !== undefined)
      focusRow.current?.scrollIntoView({ block: "center", inline: "nearest" })
  }, [file, focusLine])
  const added = rows.filter((r) => r.type === "add").length
  const removed = rows.filter((r) => r.type === "del").length
  return (
    <div className={cn(styles.diff, mode === "code" && styles.codeOnly)}>
      <div className={styles.diffHead}>
        <span className={styles.diffFileWrap}>
          <RiCodeSLine className={styles.diffIcon} />
          <span className={styles.diffFile}>{file}</span>
        </span>
        {mode === "diff" && (
          <span className={styles.diffStat}>
            <span className={styles.add}>+{added}</span>
            <span className={styles.del}>-{removed}</span>
          </span>
        )}
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
      <div
        className={styles.diffBody}
        tabIndex={0}
        role="region"
        aria-label="Code de l’exemple"
      >
        <div className={styles.diffLines}>
          {rows.map((r, i) => (
            <div
              key={i}
              ref={r.cur === focusLine ? focusRow : undefined}
              className={cn(
                styles.diffRow,
                styles[r.type],
                r.cur === focusLine && styles.focusedRow
              )}
            >
              <span aria-hidden="true" className={cn(styles.ln, styles.old)}>
                {r.old ?? ""}
              </span>
              <span aria-hidden="true" className={cn(styles.ln, styles.new)}>
                {r.cur ?? ""}
              </span>
              <span aria-hidden="true" className={styles.sign}>
                {r.type === "add" ? "+" : r.type === "del" ? "-" : ""}
              </span>
              <code>
                {tokenize(r.text).map((tok, j) => (
                  <span
                    key={j}
                    className={tok.t === "txt" ? undefined : styles[tok.t]}
                  >
                    {tok.v}
                  </span>
                ))}
              </code>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
