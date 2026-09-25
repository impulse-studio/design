import { FileDiff } from "@/components/shared/FileDiff"
import type { ToolApprovalCodeProps } from "./types"

export function ToolApprovalCode({
  code,
  language = "bash",
  className,
}: ToolApprovalCodeProps) {
  return (
    <div className={className}>
      <FileDiff
        file={language}
        mode="code"
        rows={code.split("\n").map((text, index) => ({
          old: null,
          cur: index + 1,
          type: "ctx",
          text,
        }))}
      />
    </div>
  )
}
