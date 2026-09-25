import { useState } from "react"
import { revalidateLogic, useForm } from "@tanstack/react-form"
import { authClient } from "@/features/auth/client"
import { useTeamAction } from "@/features/teams/use-team-action"
import { inviteMemberSchema } from "@/validators/teams"
import type { InviteMemberValues } from "@/validators/teams"
import { Button } from "@/components/ui/button"
import { FormTextField } from "@/components/shared/FormTextField"
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldError,
} from "@/components/ui/field"
import { TeamRoleSelect } from "./TeamRoleSelect"

export function InviteMemberForm({
  organizationId,
  isOwner,
}: {
  organizationId: string
  isOwner: boolean
}) {
  const [success, setSuccess] = useState(false)
  const { run, pending, error } = useTeamAction()
  const defaultValues: InviteMemberValues = { email: "", role: "member" }
  const form = useForm({
    defaultValues,
    validationLogic: revalidateLogic({ mode: "blur" }),
    validators: { onDynamic: inviteMemberSchema },
    onSubmit: async ({ value, formApi }) => {
      setSuccess(false)
      const data = inviteMemberSchema.parse(value)
      if (
        await run(
          () =>
            authClient.organization.inviteMember({ organizationId, ...data }),
          "Invitation impossible. Vérifiez l’adresse, vos droits et les invitations déjà en attente."
        )
      ) {
        formApi.reset({ email: "", role: data.role })
        setSuccess(true)
      }
    },
  })
  return (
    <form
      noValidate
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        setSuccess(false)
        if (!form.state.isSubmitting && !pending) void form.handleSubmit()
      }}
    >
      <FieldGroup className="sm:flex-row sm:items-end">
        <form.Field name="email">
          {(field) => (
            <FormTextField
              field={field}
              label="Adresse Digitevent"
              type="email"
              placeholder="prenom@digitevent.com"
              className="min-w-0 flex-1"
              required
              disabled={pending}
            />
          )}
        </form.Field>
        <form.Field name="role">
          {(field) => (
            <Field
              className="sm:w-44"
              data-invalid={!field.state.meta.isValid}
              data-disabled={pending}
            >
              <FieldLabel htmlFor="invite-role">Rôle</FieldLabel>
              <TeamRoleSelect
                id="invite-role"
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                invalid={!field.state.meta.isValid}
                allowOwner={isOwner}
                disabled={pending}
              />
              <FieldError
                id="invite-role-error"
                errors={field.state.meta.errors}
              />
            </Field>
          )}
        </form.Field>
        <Button type="submit" disabled={pending}>
          {pending ? "Invitation…" : "Inviter"}
        </Button>
      </FieldGroup>
      <p className="text-xs text-muted-foreground">
        L’invitation apparaîtra dans « Équipes et membres » à sa prochaine
        connexion. Elle expire après 7 jours.
      </p>
      {success && (
        <p role="status" className="text-sm">
          Invitation créée.
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </form>
  )
}
