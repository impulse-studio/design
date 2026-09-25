import { StandardRPCJsonSerializer } from "@orpc/client/standard"
import { QueryClient, defaultShouldDehydrateQuery } from "@tanstack/react-query"

const serializer = new StandardRPCJsonSerializer()

export const createQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: (queryKey) => {
          const [json, meta] = serializer.serialize(queryKey)
          return JSON.stringify({ json, meta })
        },
        staleTime: 60_000,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
        serializeData: (data) => {
          const [json, meta] = serializer.serialize(data)
          return { json, meta }
        },
      },
      hydrate: {
        deserializeData: (data) => {
          const serialized = data as {
            json: unknown
            meta: Parameters<typeof serializer.deserialize>[1]
          }
          return serializer.deserialize(serialized.json, serialized.meta)
        },
      },
    },
  })
