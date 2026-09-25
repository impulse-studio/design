import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MockupStatusMenu } from "@/components/mockups/MockupStatusMenu"
import { APP_ROUTES } from "@/constants"
import { useOrpc } from "@/lib/use-orpc"
import type { MockupStatus } from "@/features/mockups/status"
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

      <Table className="studio-documents-table [&_th]:h-[36px] [&_th]:text-[12px] [&_th]:font-normal [&_th]:text-muted-foreground [&_th]:bg-transparent [&_thead_>_tr]:border-0 [&_td]:h-[44px] [&_td]:text-[13px] [&_td]:border-border [&_:is(th,_td):first-child]:pl-6 [&_:is(th,_td):first-child]:w-[42%] [&_:is(th,_td):last-child]:pr-6 [&_time]:text-muted-foreground [&_time]:text-[12px] [&_time]:whitespace-nowrap [&_.mockup-status]:h-[26px] [&_.mockup-status]:text-[12px] [&_.mockup-status]:gap-1.5 max-[800px]:[&_:is(th,_td):first-child]:pl-5 max-[800px]:[&_:is(th,_td):nth-child(2)]:table-cell [@media(pointer:coarse)]:[&_.mockup-status]:min-h-[44px] max-[800px]:[&_:is(th,_td):nth-child(3)]:hidden">
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
                    className="studio-document-link flex items-center gap-2.5 font-medium w-full"
                    to={APP_ROUTES.editor}
                    params={{ mockupId: record.id }}
                  >
                    <span className="studio-file-icon grid place-items-center shrink-0 w-[18px] h-[18px] text-icon [&_svg]:w-[16px] [&_svg]:h-[16px]">
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
                <span className="studio-library-label flex gap-1.5 items-center text-muted-foreground text-[12px] [&_>_span]:w-[6px] [&_>_span]:h-[6px] [&_>_span]:bg-primary [&_>_span]:rounded-[2px]">
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
                  className="studio-open-document grid place-items-center w-[26px] h-[26px] text-muted-foreground rounded-md [&_svg]:w-[14px] [&_svg]:h-[14px] [@media(hover:hover)_and_(pointer:fine)]:[&:hover]:bg-accent [@media(hover:hover)_and_(pointer:fine)]:[&:hover]:text-foreground [@media(pointer:coarse)]:min-h-[44px]"
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
