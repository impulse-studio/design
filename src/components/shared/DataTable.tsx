import { useTable } from "@tanstack/react-table"
import type { ColumnDef, RowData } from "@tanstack/react-table"
import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiExpandUpDownLine,
} from "@remixicon/react"
import { dataTableFeatures } from "@/features/data-table/table-features"
import type { DataTableFeatures } from "@/features/data-table/table-features"
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { SearchField } from "@/components/shared/SearchField"

export function DataTable<TData extends RowData>({
  data,
  columns,
  filterColumn,
  pageSize = 5,
  emptyMessage = "Aucun résultat.",
}: {
  data: TData[]
  columns: ColumnDef<DataTableFeatures, TData>[]
  filterColumn?: string
  pageSize?: number
  emptyMessage?: string
}) {
  const table = useTable({
    features: dataTableFeatures,
    data,
    columns,
    initialState: { pagination: { pageIndex: 0, pageSize } },
  })
  const filter = filterColumn ? table.getColumn(filterColumn) : undefined
  return (
    <div className="flex w-full min-w-0 flex-col gap-4">
      {filter && (
        <SearchField
          value={String(filter.getFilterValue() ?? "")}
          onValueChange={(value) => {
            filter.setFilterValue(value)
            table.setPageIndex(0)
          }}
          placeholder="Filtrer les projets…"
          label="Filtrer les lignes"
          className="max-w-xs"
        />
      )}
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    aria-sort={
                      header.column.getIsSorted() === "asc"
                        ? "ascending"
                        : header.column.getIsSorted() === "desc"
                          ? "descending"
                          : undefined
                    }
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <table.FlexRender header={header} />
                        {header.column.getIsSorted() === "asc" ? (
                          <RiArrowUpSLine data-icon="inline-end" />
                        ) : header.column.getIsSorted() === "desc" ? (
                          <RiArrowDownSLine data-icon="inline-end" />
                        ) : (
                          <RiExpandUpDownLine data-icon="inline-end" />
                        )}
                      </Button>
                    ) : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="body-copy text-[13px] leading-[1.55]" aria-live="polite">
          Page {table.state.pagination.pageIndex + 1} sur{" "}
          {Math.max(1, table.getPageCount())}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            Précédent
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  )
}
