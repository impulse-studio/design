import type { BetterAuthOptions } from "better-auth"
import { APIError } from "better-auth/api"
import type { AuthEnvironment } from "./config.server"
import { APP_ROUTES, PROJECT_NAME } from "@/constants"
import {
  ACCOUNT_REQUIRED,
  ACCOUNT_REQUIRED_MESSAGE,
  DIGITEVENT_DOMAIN,
  isDigiteventUser,
} from "./policy"

export const createAuthOptions = (env: AuthEnvironment) =>
  ({
    appName: PROJECT_NAME,
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    emailAndPassword: { enabled: env.devMode, disableSignUp: true },
    socialProviders: env.devMode
      ? {}
      : {
          google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            hd: DIGITEVENT_DOMAIN,
            prompt: "select_account",
          },
        },
    user: {
      // Runs for first AND returning Google logins, using the fresh profile.
      validateUserInfo: ({ user, source }) => {
        if (
          source.method !== "oauth" ||
          source.oauth?.providerId !== "google" ||
          source.oauth.profile?.hd !== DIGITEVENT_DOMAIN ||
          !isDigiteventUser(user)
        ) {
          return {
            error: ACCOUNT_REQUIRED,
            errorDescription: ACCOUNT_REQUIRED_MESSAGE,
          }
        }
      },
      changeEmail: { enabled: false },
    },
    account: { accountLinking: { enabled: false } },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
      cookieCache: { enabled: false },
    },
    databaseHooks: {
      user: {
        create: {
          before: async (user) => {
            if (!isDigiteventUser(user)) {
              throw new APIError("FORBIDDEN", {
                code: ACCOUNT_REQUIRED,
                message: ACCOUNT_REQUIRED_MESSAGE,
              })
            }
          },
        },
        update: {
          before: async (user) => {
            if (
              (user.email !== undefined &&
                !isDigiteventUser({
                  email: user.email,
                  emailVerified: true,
                })) ||
              user.emailVerified === false
            ) {
              throw new APIError("FORBIDDEN", {
                code: ACCOUNT_REQUIRED,
                message: ACCOUNT_REQUIRED_MESSAGE,
              })
            }
          },
        },
      },
    },
    onAPIError: { errorURL: APP_ROUTES.login },
  }) satisfies BetterAuthOptions
