import { revalidateLogic, useForm } from "@tanstack/react-form"
import { authClient } from "@/features/auth/client"
import { useTeamAction } from "@/features/teams/use-team-action"
import { Button } from "@/components/ui/button"
import { FormTextField } from "@/components/shared/FormTextField"
import { FieldGroup } from "@/components/ui/field"
import { createTeamSlug, teamFormSchema } from "@/features/teams/schemas"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"

export function CreateTeamForm() {
  const { run, pending, error } = useTeamAction()
  const form = useForm({
    defaultValues: { name: "" },
    validationLogic: revalidateLogic({ mode: "blur" }),
    validators: { onDynamic: teamFormSchema },
    onSubmit: async ({ value, formApi }) => {
      const { name } = teamFormSchema.parse(value)
      if (
        await run(
          () =>
            authClient.organization.create({
              name,
              slug: createTeamSlug(name),
            }),
          "L’équipe n’a pas pu être créée."
        )
      )
        formApi.reset()
    },
  })
  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer une équipe</CardTitle>
        <CardDescription>
          Un espace partagé pour vos maquettes. Vous en serez propriétaire.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault()
            if (!form.state.isSubmitting && !pending) void form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.Field name="name">
              {(field) => (
                <FormTextField
                  field={field}
                  label="Nom de l’équipe"
                  placeholder="Design produit"
                  maxLength={100}
                  required
                  disabled={pending}
                />
              )}
            </form.Field>
            <Button type="submit" disabled={pending}>
              {pending ? "Création…" : "Créer l’équipe"}
            </Button>
          </FieldGroup>
        </form>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
