import type { getDatabase } from "./client.server"

export type Database = ReturnType<typeof getDatabase>
export type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0]
