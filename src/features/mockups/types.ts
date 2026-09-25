import type { RouterInputs, RouterOutputs } from "@/server/types"

export type MockupRecord = Omit<
  RouterOutputs["mockups"]["get"],
  "canEdit" | "site"
>
export type MockupSummary = RouterOutputs["mockups"]["list"]["records"][number]
export type SaveInput = RouterInputs["mockups"]["save"]
export type SaveResult = RouterOutputs["mockups"]["save"]
