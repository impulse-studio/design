import { createFileRoute } from "@tanstack/react-router"
import { handleAuthRequest } from "@/features/auth/auth.server"

export const Route = createFileRoute("/.well-known/$")({
  server: {
    handlers: {
      GET: ({ request }) => handleAuthRequest(request),
    },
  },
})
