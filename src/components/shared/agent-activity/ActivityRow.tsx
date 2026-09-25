import type { AgentActivityItem } from "./types"
import { StepRow } from "./StepRow"
import { TextRow } from "./TextRow"
import { SearchRow } from "./SearchRow"
import { ToolRow } from "./ToolRow"
import { TraceRow } from "./TraceRow"

export function ActivityRow({ item }: { item: AgentActivityItem }) {
  if (item.type === "text") return <TextRow item={item} />
  if (item.type === "search") return <SearchRow item={item} />
  if (item.type === "tool") return <ToolRow item={item} />
  if (item.type === "trace") return <TraceRow item={item} />
  return <StepRow item={item} />
}
