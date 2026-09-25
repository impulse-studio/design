import { createFileRoute } from "@tanstack/react-router"
import { DesignSystemPage } from "@/pages/design-system/DesignSystemPage"

export const Route = createFileRoute("/design-system/")({
  component: DesignSystemPage,
})
