import { createFileRoute } from "@tanstack/react-router"
import { handleMcpPost } from "@/features/mcp/http.server"

export const Route = createFileRoute("/api/mcp")({
  server: {
    handlers: {
      GET: ({ request }) => handleMcpPost(request),
      POST: ({ request }) => handleMcpPost(request),
    },
  },
})
