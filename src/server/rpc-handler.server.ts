import { ORPCError, onError, ValidationError } from "@orpc/server"
import { RPCHandler } from "@orpc/server/fetch"
import { BatchHandlerPlugin, StrictGetMethodPlugin } from "@orpc/server/plugins"
import { z } from "zod"
import { appRouter } from "@/server/routers/_app"
import { createRpcContext } from "@/server/context"

const rpcHandler = new RPCHandler(appRouter, {
  plugins: [new StrictGetMethodPlugin(), new BatchHandlerPlugin()],
  clientInterceptors: [
    onError((error) => {
      if (
        error instanceof ORPCError &&
        error.code === "BAD_REQUEST" &&
        error.cause instanceof ValidationError
      ) {
        const zodError = new z.ZodError(
          error.cause.issues as z.core.$ZodIssue[]
        )
        const flattened = z.flattenError(zodError)
        const fieldErrors = Object.fromEntries(
          Object.entries(flattened.fieldErrors).filter(
            (entry): entry is [string, string[]] => entry[1] !== undefined
          )
        )

        throw new ORPCError("INPUT_VALIDATION_FAILED", {
          status: 422,
          message: z.prettifyError(zodError),
          data: { formErrors: flattened.formErrors, fieldErrors },
          cause: error.cause,
        })
      }

      console.error(error)
    }),
  ],
})

export const handleRpcRequest = async (request: Request): Promise<Response> => {
  const { response } = await rpcHandler.handle(request, {
    prefix: "/api/rpc",
    context: createRpcContext(request),
  })

  return response ?? new Response("Not found", { status: 404 })
}
