import { useEffect, useId, useState } from "react"
import { useForm } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  RiAddLine,
  RiExternalLinkLine,
  RiGithubFill,
  RiNotionFill,
} from "@remixicon/react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { MockupLinks as MockupLinksData } from "@/features/mockups/schemas"
import { mockupLinksFormSchema } from "@/features/mockups/schemas"
import { useOrpc } from "@/lib/use-orpc"

const services = [
  { field: "notionUrl", label: "Notion", icon: RiNotionFill },
  { field: "githubUrl", label: "GitHub", icon: RiGithubFill },
] as const

const safeHttpUrl = (value: string | null): value is string => {
  if (!value) return false
  try {
    return ["http:", "https:"].includes(new URL(value).protocol)
  } catch {
    return false
  }
}

export function MockupLinks({
  id,
  notionUrl,
  githubUrl,
  canEdit = false,
  compact = false,
  hideActiveLinks = false,
  actionLabel,
}: {
  id: string
  notionUrl: string | null
  githubUrl: string | null
  canEdit?: boolean
  compact?: boolean
  hideActiveLinks?: boolean
  actionLabel?: string
}) {
  const uniqueId = useId(),
    queryClient = useQueryClient(),
    orpc = useOrpc(),
    update = useMutation(orpc.mockups.updateLinks.mutationOptions())
  const [links, setLinks] = useState<MockupLinksData>({ notionUrl, githubUrl }),
    [open, setOpen] = useState(false),
    [saveError, setSaveError] = useState<string | null>(null)
  useEffect(() => setLinks({ notionUrl, githubUrl }), [notionUrl, githubUrl])
  const form = useForm({
    defaultValues: {
      notionUrl: notionUrl ?? "",
      githubUrl: githubUrl ?? "",
    },
    validators: { onChange: mockupLinksFormSchema },
    onSubmit: async ({ value, formApi }) => {
      if (!canEdit || update.isPending) return
      setSaveError(null)
      const data = mockupLinksFormSchema.parse(value)
      try {
        const result = await update.mutateAsync({ id, ...data })
        if (!result.saved) {
          setSaveError(
            "Vous ne pouvez pas modifier les liens de cette maquette."
          )
          return
        }
        setLinks(data)
        formApi.reset({
          notionUrl: data.notionUrl ?? "",
          githubUrl: data.githubUrl ?? "",
        })
        setOpen(false)
        void queryClient.invalidateQueries({
          queryKey: orpc.mockups.list.queryKey(),
        })
      } catch {
        setSaveError("Les liens n’ont pas pu être enregistrés. Réessayez.")
      }
    },
  })
  const activeServices = services.flatMap((service) => {
    const url = links[service.field]
    return safeHttpUrl(url) ? [{ ...service, url }] : []
  })

  if (!canEdit && activeServices.length === 0) return null

  return (
    <div
      className={
        compact ? "flex shrink-0 items-center gap-0.5" : "mockup-link-group inline-flex min-w-0 items-center gap-1"
      }
      role="group"
      aria-label="Liens de référence"
    >
      {!(compact && hideActiveLinks) &&
        activeServices.map(({ field, label, icon: Icon, url }) => (
          <a
            key={field}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={
              compact
                ? "flex size-7 min-h-11 min-w-11 items-center justify-center rounded-md text-muted-foreground md:min-h-7 md:min-w-7"
                : "mockup-link-chip inline-flex min-w-0 max-w-[140px] h-[22px] items-center gap-1.25 overflow-hidden border border-border rounded-[5px] [padding:0_6px] text-muted-foreground text-[11px] leading-[1] [&_>_svg:first-child]:w-[13px] [&_>_svg:first-child]:h-[13px] [&_>_svg:first-child]:shrink-0 [&_>_span]:overflow-hidden [&_>_span]:text-ellipsis [&_>_span]:whitespace-nowrap [@media(hover:hover)_and_(pointer:fine)]:[&:hover]:bg-accent [@media(hover:hover)_and_(pointer:fine)]:[&:hover]:text-foreground [@media(pointer:coarse)]:min-h-[44px] [@media(pointer:coarse)]:min-w-[44px] [@media(pointer:coarse)]:px-2.25"
            }
            aria-label={`Ouvrir le lien ${label} dans un nouvel onglet`}
            title={url}
          >
            <Icon aria-hidden="true" />
            {!compact && <span>{label}</span>}
            {!compact && (
              <RiExternalLinkLine
                aria-hidden="true"
                className="mockup-link-external w-[10px] h-[10px] shrink-0 opacity-[0.6]"
              />
            )}
          </a>
        ))}
      {canEdit && (
        <Dialog
          open={open}
          onOpenChange={(nextOpen) => {
            if (nextOpen) {
              form.reset({
                notionUrl: links.notionUrl ?? "",
                githubUrl: links.githubUrl ?? "",
              })
              setSaveError(null)
            }
            setOpen(nextOpen)
          }}
        >
          <DialogTrigger
            render={
              <Button
                variant={compact || activeServices.length ? "ghost" : "outline"}
                size={
                  compact
                    ? actionLabel && activeServices.length === 0
                      ? "xs"
                      : "icon-sm"
                    : activeServices.length
                      ? "icon-xs"
                      : "xs"
                }
                aria-label="Ajouter ou modifier les liens de référence"
                className={
                  compact
                    ? actionLabel && activeServices.length === 0
                      ? "h-7 min-h-11 shrink-0 gap-1 px-2 text-muted-foreground md:min-h-7"
                      : "size-7 min-h-11 min-w-11 shrink-0 p-0 text-muted-foreground md:min-h-7 md:min-w-7"
                    : "mockup-link-edit shrink-0 text-muted-foreground font-normal [@media(hover:hover)_and_(pointer:fine)]:[&:hover]:text-foreground [@media(pointer:coarse)]:min-h-[44px] [@media(pointer:coarse)]:min-w-[44px]"
                }
              />
            }
          >
            <RiAddLine />
            {compact && actionLabel && activeServices.length === 0 && (
              <span>{actionLabel}</span>
            )}
            {!compact && activeServices.length === 0 && "Ajouter des liens"}
          </DialogTrigger>
          <DialogContent className="mockup-links-dialog gap-5">
            <DialogHeader>
              <DialogTitle>Liens de référence</DialogTitle>
              <DialogDescription>
                Gardez le brief produit et le contexte technique à portée de
                main.
              </DialogDescription>
            </DialogHeader>
            <form
              noValidate
              onSubmit={(event) => {
                event.preventDefault()
                if (!form.state.isSubmitting && !update.isPending)
                  void form.handleSubmit()
              }}
            >
              <FieldGroup className="mockup-links-fields gap-[18px] [&_[data-slot=field]]:gap-1.75 [&_[data-slot=field-label]]:text-[13px] [&_[data-slot=field-description]]:text-[12px]">
                <form.Field name="notionUrl">
                  {(field) => {
                    const invalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    const errorId = `${uniqueId}-notion-error`
                    return (
                      <Field data-invalid={invalid}>
                        <FieldLabel htmlFor={`${uniqueId}-notion`}>
                          Notion · brief ou spécifications
                        </FieldLabel>
                        <Input
                          id={`${uniqueId}-notion`}
                          type="url"
                          inputMode="url"
                          placeholder="https://www.notion.so/..."
                          autoComplete="url"
                          maxLength={2048}
                          value={field.state.value}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                          onBlur={field.handleBlur}
                          aria-invalid={invalid}
                          aria-describedby={
                            invalid ? errorId : `${uniqueId}-notion-help`
                          }
                          disabled={update.isPending}
                        />
                        <FieldDescription id={`${uniqueId}-notion-help`}>
                          Collez l’URL complète de la page Notion.
                        </FieldDescription>
                        {invalid && (
                          <FieldError
                            id={errorId}
                            errors={field.state.meta.errors}
                          />
                        )}
                      </Field>
                    )
                  }}
                </form.Field>
                <form.Field name="githubUrl">
                  {(field) => {
                    const invalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    const errorId = `${uniqueId}-github-error`
                    return (
                      <Field data-invalid={invalid}>
                        <FieldLabel htmlFor={`${uniqueId}-github`}>
                          GitHub · dépôt, issue ou pull request
                        </FieldLabel>
                        <Input
                          id={`${uniqueId}-github`}
                          type="url"
                          inputMode="url"
                          placeholder="https://github.com/..."
                          autoComplete="url"
                          maxLength={2048}
                          value={field.state.value}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                          onBlur={field.handleBlur}
                          aria-invalid={invalid}
                          aria-describedby={
                            invalid ? errorId : `${uniqueId}-github-help`
                          }
                          disabled={update.isPending}
                        />
                        <FieldDescription id={`${uniqueId}-github-help`}>
                          Ajoutez le ticket ou le dépôt lié à cette maquette.
                        </FieldDescription>
                        {invalid && (
                          <FieldError
                            id={errorId}
                            errors={field.state.meta.errors}
                          />
                        )}
                      </Field>
                    )
                  }}
                </form.Field>
                {saveError && (
                  <p className="text-sm text-destructive" role="alert">
                    {saveError}
                  </p>
                )}
              </FieldGroup>
              <DialogFooter className="mockup-links-footer mt-[18px]">
                <DialogClose
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={update.isPending}
                    />
                  }
                >
                  Annuler
                </DialogClose>
                <Button type="submit" disabled={update.isPending}>
                  {update.isPending ? "Enregistrement…" : "Enregistrer"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
