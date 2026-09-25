import { createFileRoute } from "@tanstack/react-router"
import { handleAiGet, handleAiPost } from "@/features/ai/http.server"

export const Route = createFileRoute("/api/ai/$")({
  server: {
    handlers: {
      GET: ({ request }) => handleAiGet(request),
      POST: ({ request }) => handleAiPost(request),
    },
  },
})
