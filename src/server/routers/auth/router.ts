import { signInDevelopmentHandler } from "@/server/routers/auth/mutations/sign-in-development"
import { getCurrentUserHandler } from "@/server/routers/auth/queries/get-current-user"
import { getLoginAvailabilityHandler } from "@/server/routers/auth/queries/get-login-availability"
import { base } from "@/server/context"

export const authRouter = base.router({
  getCurrentUser: getCurrentUserHandler.route({ method: "GET" }),
  getLoginAvailability: getLoginAvailabilityHandler.route({ method: "GET" }),
  signInDevelopment: signInDevelopmentHandler.route({ method: "POST" }),
})
