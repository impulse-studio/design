import { createFileRoute } from "@tanstack/react-router"
import { DesignSystemPage } from "@/pages/design-system/page"

export const Route = createFileRoute("/design-system/")({
  component: DesignSystemPage,
})
