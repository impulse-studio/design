import { useEffect, useRef, useState } from "react"
import { Link } from "@tanstack/react-router"
import { RiArrowRightUpLine } from "@remixicon/react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ExamplePreview } from "@/components/design-system/ExamplePreview"
import type { CatalogEntry } from "@/features/design-system/types"
import { APP_ROUTES } from "@/constants"

export function CatalogCard({ entry }: { entry: CatalogEntry }) {
  const previewRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (!previewRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((item) => item.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: "200px" }
    )
    observer.observe(previewRef.current)
    return () => observer.disconnect()
  }, [])
  return (
    <Card
      ref={previewRef}
      size="sm"
      className="gap-0 overflow-visible py-0 shadow-none"
    >
      <CardContent className="demo-stage flex h-[208px] min-w-0 overflow-auto rounded-t-xl bg-surface px-5 py-6 [&_>_*]:max-w-full">
        <div className="m-auto flex w-full min-w-0 items-center justify-center">
          {visible ? (
            <ExamplePreview entry={entry} />
          ) : (
            <Skeleton className="h-8 w-2/3" />
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t px-4 py-3.5">
        <Link
          to={APP_ROUTES.designSystemComponent}
          params={{ slug: entry.id }}
          className="group flex w-full items-center justify-between gap-2"
        >
          <span className="text-xs font-medium">{entry.name}</span>
          <RiArrowRightUpLine className="size-4 text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </CardFooter>
    </Card>
  )
}
