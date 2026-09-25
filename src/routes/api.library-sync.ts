import { createFileRoute } from "@tanstack/react-router"
import { handleLibrarySync } from "@/features/libraries/connections.server"
export const Route = createFileRoute("/api/library-sync")({server:{handlers:{GET:({request})=>handleLibrarySync(request),POST:({request})=>handleLibrarySync(request)}}})
