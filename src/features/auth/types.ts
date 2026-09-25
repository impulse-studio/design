import type { RouterOutputs } from "@/server/types"

export type CurrentUser = NonNullable<RouterOutputs["auth"]["getCurrentUser"]>
