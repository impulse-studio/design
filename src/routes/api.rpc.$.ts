import { createFileRoute } from "@tanstack/react-router"
import { handleRpcRequest } from "@/server/rpc-handler.server"

const handleRequest = ({ request }: { request: Request }) =>
  handleRpcRequest(request)

export const Route = createFileRoute("/api/rpc/$")({
  server: {
    handlers: {
      GET: handleRequest,
      POST: handleRequest,
      PUT: handleRequest,
      PATCH: handleRequest,
      DELETE: handleRequest,
      HEAD: handleRequest,
    },
  },
})
