import { authMiddleware } from "@/server/middleware/auth.middleware"
import { publicProcedure } from "@/server/procedure/public.procedure"

export const protectedProcedure = publicProcedure.use(authMiddleware)
