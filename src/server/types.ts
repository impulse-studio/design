import type { InferRouterInputs, InferRouterOutputs } from "@orpc/server"
import type { AppRouter } from "./routers/_app"

export type RouterInputs = InferRouterInputs<AppRouter>
export type RouterOutputs = InferRouterOutputs<AppRouter>
