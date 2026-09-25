import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MockupStatusMenu } from "@/components/mockups/MockupStatusMenu"
import { APP_ROUTES } from "@/constants"
import { useOrpc } from "@/server/use-orpc"
import type { MockupStatus } from "@/validators/mockups"
import { Link, useRouter } from "@tanstack/react-router"
import { RiArtboardLine, RiArrowRightLine } from "@remixicon/react"
import type { MockupSummary } from "@/features/mockups/types"
import { MockupLinks } from "@/components/mockups/MockupLinks"
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table"

export function StudioDocuments({
  records,
  canEdit,
}: {
  records: MockupSummary[]
  canEdit: boolean
}) {
  const router = useRouter(),
    queryClient = useQueryClient(),
    orpc = useOrpc(),
    update = useMutation(orpc.mockups.setStatus.mutationOptions())
  const [pending, setPending] = useState<string | null>(null),
    [error, setError] = useState<string | null>(null)
  const change = async (record: MockupSummary, status: MockupStatus) => {
    setPending(record.id)
    setError(null)
    try {
      const result = await update.mutateAsync({
        id: record.id,
        status,
        expectedRevision: record.revision,
      })
      if (!result.saved)
        setError(
          "La maquette a été modifiée ailleurs. La liste a été actualisée. Réessayez."
        )
      await queryClient.invalidateQueries({
        queryKey: orpc.mockups.list.queryKey(),
      })
      await router.invalidate()
    } catch {
      setError("Le statut n’a pas pu être enregistré. Réessayez.")
    } finally {
      setPending(null)
    }
  }
  return (
    <>
      {error && (
        <p role="alert" className="px-8 py-3 text-xs text-destructive">
          {error}
        </p>
      )}

      <Table className="studio-documents-table [&_.mockup-status]:h-[26px] [&_.mockup-status]:gap-1.5 [&_.mockup-status]:text-[12px] [&_:is(th,_td):first-child]:w-[42%] [&_:is(th,_td):first-child]:pl-6 max-[800px]:[&_:is(th,_td):first-child]:pl-5 [&_:is(th,_td):last-child]:pr-6 max-[800px]:[&_:is(th,_td):nth-child(2)]:table-cell max-[800px]:[&_:is(th,_td):nth-child(3)]:hidden [&_td]:h-[44px] [&_td]:border-border [&_td]:text-[13px] [&_th]:h-[36px] [&_th]:bg-transparent [&_th]:text-[12px] [&_th]:font-normal [&_th]:text-muted-foreground [&_thead_>_tr]:border-0 [&_time]:text-[12px] [&_time]:whitespace-nowrap [&_time]:text-muted-foreground [@media(pointer:coarse)]:[&_.mockup-status]:min-h-[44px]">
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Bibliothèque</TableHead>
            <TableHead>Dernière modification</TableHead>
            <TableHead className="w-10">
              <span className="sr-only">Ouvrir</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell>
                <div className="studio-document-main flex min-w-0 flex-col items-start gap-0.75">
                  <Link
                    className="studio-document-link flex w-full items-center gap-2.5 font-medium"
                    to={APP_ROUTES.editor}
                    params={{ mockupId: record.id }}
                  >
                    <span className="studio-file-icon grid h-[18px] w-[18px] shrink-0 place-items-center text-icon [&_svg]:h-[16px] [&_svg]:w-[16px]">
                      <RiArtboardLine />
                    </span>
                    <span>{record.name}</span>
                  </Link>
                  <MockupLinks
                    id={record.id}
                    notionUrl={record.notionUrl}
                    githubUrl={record.githubUrl}
                  />
                </div>
              </TableCell>
              <TableCell>
                <MockupStatusMenu
                  value={record.status}
                  onChange={(value) => void change(record, value)}
                  disabled={!canEdit || pending === record.id}
                />
              </TableCell>
              <TableCell>
                <span className="studio-library-label flex items-center gap-1.5 text-[12px] text-muted-foreground [&_>_span]:h-[6px] [&_>_span]:w-[6px] [&_>_span]:rounded-[2px] [&_>_span]:bg-primary">
                  <span />
                  Digi
                </span>
              </TableCell>
              <TableCell>
                <time dateTime={record.updatedAt}>
                  {new Intl.DateTimeFormat("fr", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(record.updatedAt))}
                </time>
              </TableCell>
              <TableCell>
                <Link
                  to={APP_ROUTES.editor}
                  params={{ mockupId: record.id }}
                  aria-label={`Ouvrir ${record.name}`}
                  className="studio-open-document grid h-[26px] w-[26px] place-items-center rounded-md text-muted-foreground [&_svg]:h-[14px] [&_svg]:w-[14px] [@media(hover:hover)_and_(pointer:fine)]:[&:hover]:bg-accent [@media(hover:hover)_and_(pointer:fine)]:[&:hover]:text-foreground [@media(pointer:coarse)]:min-h-[44px]"
                >
                  <RiArrowRightLine />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
