import source from "./TableExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function TableExample() {
  return (
    <div className="w-full max-w-lg">
      <Table>
        <TableCaption>Trois projets de démonstration.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Projet</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Fichiers</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            ["Bibliothèque Digit", "Publié", 24],
            ["Espace organisateur", "Brouillon", 8],
            ["Page d’inscription", "En revue", 12],
          ].map(([name, status, count]) => (
            <TableRow key={name}>
              <TableCell>{name}</TableCell>
              <TableCell>
                <Badge variant="secondary">{status}</Badge>
              </TableCell>
              <TableCell className="text-right tabular-nums">{count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
// @example:end

export const getCode = createExampleCode(source)
