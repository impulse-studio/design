import { createFileRoute, notFound } from "@tanstack/react-router"
import { ComponentDetailPage } from "@/pages/component-detail/page"
import { catalog } from "@/features/design-system/catalog"
import { DESIGN_SYSTEM_NAME } from "@/constants"

export const Route = createFileRoute("/design-system/$slug")({
  beforeLoad: ({ params }) => {
    if (!catalog.some((entry) => entry.id === params.slug)) throw notFound()
  },
  head: ({ params }) => ({
    meta: [
      {
        title: `${catalog.find((entry) => entry.id === params.slug)?.name ?? "Composant"} — ${DESIGN_SYSTEM_NAME}`,
      },
    ],
  }),
  component: ComponentDetailPage,
})
