import { revalidateLogic, useForm } from "@tanstack/react-form"
import { authClient } from "@/features/auth/client"
import type { TeamSummary } from "@/features/teams/types"
import { useTeamAction } from "@/features/teams/use-team-action"
import { Button } from "@/components/ui/button"
import { FormTextField } from "@/components/shared/FormTextField"
import { FieldGroup } from "@/components/ui/field"
import { teamFormSchema } from "@/validators/teams"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

export function TeamSettings({
  team,
  canManage,
}: {
  team: TeamSummary
  canManage: boolean
}) {
  const { run, pending, error } = useTeamAction()
  const form = useForm({
    defaultValues: { name: team.name },
    validationLogic: revalidateLogic({ mode: "blur" }),
    validators: { onDynamic: teamFormSchema },
    onSubmit: async ({ value, formApi }) => {
      if (!canManage || pending) return
      const data = teamFormSchema.parse(value)
      if (
        await run(
          () =>
            authClient.organization.update({ organizationId: team.id, data }),
          "Le nom n’a pas pu être modifié."
        )
      )
        formApi.reset(data)
    },
  })
  return (
    <div className="flex flex-col gap-4">
      {canManage && (
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault()
            if (!form.state.isSubmitting && !pending) void form.handleSubmit()
          }}
        >
          <FieldGroup className="sm:flex-row sm:items-end">
            <form.Field name="name">
              {(field) => (
                <FormTextField
                  field={field}
                  label="Nom de l’équipe"
                  maxLength={100}
                  required
                  disabled={pending}
                />
              )}
            </form.Field>
            <form.Subscribe
              selector={(state) =>
                [state.values.name, state.isSubmitting] as const
              }
            >
              {([name, isSubmitting]) => (
                <Button
                  type="submit"
                  variant="outline"
                  disabled={
                    pending || isSubmitting || name.trim() === team.name
                  }
                >
                  Enregistrer
                </Button>
              )}
            </form.Subscribe>
          </FieldGroup>
        </form>
      )}
      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button
              className="self-start"
              variant="outline"
              disabled={pending}
            />
          }
        >
          Quitter l’équipe
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Quitter {team.name} ?</AlertDialogTitle>
            <AlertDialogDescription>
              Vous aurez besoin d’une nouvelle invitation pour accéder à ses
              maquettes. Un propriétaire doit rester dans l’équipe.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                void run(
                  () =>
                    authClient.organization.leave({ organizationId: team.id }),
                  "Impossible de quitter l’équipe. Nommez un autre propriétaire si vous êtes le dernier."
                )
              }
            >
              Quitter l’équipe
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
