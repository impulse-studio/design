import { Link, useParams } from "@tanstack/react-router"
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiArrowRightUpLine,
} from "@remixicon/react"
import { buttonVariants } from "@/components/ui/button"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { PageHeader } from "@/components/shared/PageHeader"
import { ExamplePlayground } from "@/components/design-system/ExamplePlayground"
import { catalog } from "@/features/design-system/catalog"
import { getProperties } from "@/features/design-system/properties"
import { APP_ROUTES, EXTERNAL_LINKS } from "@/constants"

export function ComponentDetailPage() {
  const { slug } = useParams({ from: APP_ROUTES.designSystemComponent })
  const index = catalog.findIndex((e) => e.id === slug)
  const entry = catalog[index]
  const previous = index > 0 ? catalog[index - 1] : undefined
  const next = index < catalog.length - 1 ? catalog[index + 1] : undefined
  const properties = getProperties(entry)
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <PageHeader
        title={entry.name}
        description={entry.description}
        actions={
          entry.kind === "component" ? (
            <a
              href={`${EXTERNAL_LINKS.shadcnBaseComponents}/${entry.id}`}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Documentation
              <RiArrowRightUpLine data-icon="inline-end" />
            </a>
          ) : undefined
        }
      />
      <ExamplePlayground key={entry.id} entry={entry} />
      <section className="flex min-w-0 flex-col gap-4">
        <h2 className="section-title [font-family:var(--font-heading)] [font-variation-settings:'opsz'_32] text-[16px] leading-[24px] font-semibold tracking-[-0.012em]">
          {entry.kind === "foundation" ? "Tokens" : "Utilisation"}
        </h2>
        {entry.kind !== "foundation" && (
          <div className="overflow-x-auto rounded-md border bg-surface px-4 py-3">
            <code className="code-source font-mono text-[12px] leading-[1.85] [tab-size:2] whitespace-nowrap">
              {entry.kind === "component"
                ? `@/components/ui/${entry.id}`
                : `@/components/shared/${entry.id
                    .split("-")
                    .map((s) => s[0].toUpperCase() + s.slice(1))
                    .join("")}`}
            </code>
          </div>
        )}
        {properties.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Propriété</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Défaut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property.name}>
                  <TableCell>
                    <code className="text-xs">{property.name}</code>
                    <p className="mt-1.5 max-w-sm text-xs whitespace-normal text-muted-foreground">
                      {property.description}
                    </p>
                  </TableCell>
                  <TableCell className="max-w-xs whitespace-normal">
                    <code className="text-xs text-muted-foreground">
                      {property.type}
                    </code>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs">{property.defaultValue}</code>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>
      <nav
        aria-label="Parcourir la bibliothèque"
        className="flex justify-between gap-5"
      >
        {previous ? (
          <Link
            to={APP_ROUTES.designSystemComponent}
            params={{ slug: previous.id }}
            className="flex items-center gap-3"
          >
            <RiArrowLeftLine className="size-4" />
            <div>
              <p className="eyebrow text-[12px] leading-[20px] font-normal tracking-[-0.006em] mb-1">Précédent</p>
              <span className="text-sm">{previous.name}</span>
            </div>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            to={APP_ROUTES.designSystemComponent}
            params={{ slug: next.id }}
            className="flex items-center gap-3 text-right"
          >
            <div>
              <p className="eyebrow text-[12px] leading-[20px] font-normal tracking-[-0.006em] mb-1">Suivant</p>
              <span className="text-sm">{next.name}</span>
            </div>
            <RiArrowRightLine className="size-4" />
          </Link>
        )}
      </nav>
    </div>
  )
}
