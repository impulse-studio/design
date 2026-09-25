import { readCurrentUser } from "@/features/auth/session.server"
import { publicProcedure } from "@/server/procedure/public.procedure"

export const getCurrentUserHandler = publicProcedure.handler(({ context }) =>
  readCurrentUser(context.headers)
)
