import { os } from "@orpc/server"
import { z } from "zod"
import { getDatabase } from "@/db/client.server"
import type { CurrentUser } from "@/features/auth/session.server"

const inputValidationDataSchema = z.object({
  formErrors: z.array(z.string()),
  fieldErrors: z.record(z.string(), z.array(z.string())),
})

export type RpcContext = {
  headers: Headers
  request: Request
  db: ReturnType<typeof getDatabase>
  user?: CurrentUser
}

export const createRpcContext = (request: Request): RpcContext => ({
  headers: request.headers,
  request,
  db: getDatabase(),
})

export const base = os.$context<RpcContext>().errors({
  UNAUTHORIZED: { status: 401 },
  FORBIDDEN: { status: 403 },
  NOT_FOUND: { status: 404 },
  CONFLICT: { status: 409 },
  TEAM_REQUIRED: { status: 404 },
  INPUT_VALIDATION_FAILED: {
    status: 422,
    data: inputValidationDataSchema,
  },
})
