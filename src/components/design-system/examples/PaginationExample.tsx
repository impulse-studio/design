import source from "./PaginationExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import { useState } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"

export function PaginationExample() {
  const [page, setPage] = useState(1)
  return (
    <div className="flex flex-col gap-4">
      <Pagination aria-label="Pages de démonstration">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-label="Page précédente"
              aria-disabled={page === 1}
              onClick={(event) => {
                event.preventDefault()
                setPage(Math.max(1, page - 1))
              }}
            />
          </PaginationItem>
          {[1, 2, 3].map((n) => (
            <PaginationItem key={n}>
              <PaginationLink
                href="#"
                isActive={page === n}
                onClick={(event) => {
                  event.preventDefault()
                  setPage(n)
                }}
              >
                {n}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              aria-label="Page suivante"
              aria-disabled={page === 3}
              onClick={(event) => {
                event.preventDefault()
                setPage(Math.min(3, page + 1))
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <p className="body-copy text-[13px] leading-[1.55] text-center">Page {page} sur 3</p>
    </div>
  )
}
// @example:end

export const getCode = createExampleCode(source)
