import source from "./DataTableExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import type { DataTableFeatures } from "@/features/data-table/table-features"
import { DataTable } from "@/components/shared/DataTable"
import { createColumnHelper } from "@tanstack/react-table"

export function DataTableExample() {
  const data = [
    { name: "Bibliothèque Digit", status: "Publié", files: 24 },
    { name: "Espace organisateur", status: "Brouillon", files: 8 },
    { name: "Inscription", status: "En revue", files: 12 },
    { name: "Paramètres", status: "Publié", files: 4 },
    { name: "Gestion des équipes", status: "Brouillon", files: 18 },
  ]
  const helper = createColumnHelper<DataTableFeatures, (typeof data)[number]>()
  const columns = helper.columns([
    helper.accessor("name", {
      header: "Projet",
      filterFn: "includesString",
      sortFn: "text",
    }),
    helper.accessor("status", { header: "Statut", sortFn: "text" }),
    helper.accessor("files", { header: "Fichiers", sortFn: "alphanumeric" }),
  ])
  return (
    <DataTable data={data} columns={columns} filterColumn="name" pageSize={3} />
  )
}
// @example:end

export const getCode = createExampleCode(source)
