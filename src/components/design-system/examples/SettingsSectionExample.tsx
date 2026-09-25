import source from "./SettingsSectionExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import { useId } from "react"
import { revalidateLogic, useForm } from "@tanstack/react-form"
import { z } from "zod"
import { mockupNameFormSchema } from "@/features/mockups/schemas"
import { FormTextField } from "@/components/shared/FormTextField"
import { SettingsSection } from "@/components/shared/SettingsSection"
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldDescription,
} from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"

const settingsSchema = mockupNameFormSchema.extend({ autoSave: z.boolean() })

export function SettingsSectionExample() {
  const id = useId()
  const form = useForm({
    defaultValues: { name: "Bibliothèque Digit", autoSave: true },
    validationLogic: revalidateLogic({ mode: "blur" }),
    validators: { onDynamic: settingsSchema },
    onSubmit: ({ value, formApi }) => {
      formApi.reset(settingsSchema.parse(value))
      toast.add({ title: "Préférences enregistrées" })
    },
  })
  return (
    <form
      noValidate
      className="w-full max-w-sm"
      onSubmit={(event) => {
        event.preventDefault()
        if (!form.state.isSubmitting) void form.handleSubmit()
      }}
    >
      <SettingsSection
        title="Préférences du projet"
        description="Les bons réglages, dès le départ."
        footer={<Button type="submit">Enregistrer</Button>}
      >
        <form.Field name="name">
          {(field) => (
            <FormTextField field={field} label="Nom du projet" required />
          )}
        </form.Field>
        <form.Field name="autoSave">
          {(field) => (
            <Field orientation="horizontal">
              <FieldContent>
                <FieldLabel htmlFor={`${id}-save`}>
                  Sauvegarde automatique
                </FieldLabel>
                <FieldDescription>
                  Conserver chaque modification.
                </FieldDescription>
              </FieldContent>
              <Switch
                id={`${id}-save`}
                name={field.name}
                checked={field.state.value}
                onCheckedChange={field.handleChange}
                onBlur={field.handleBlur}
              />
            </Field>
          )}
        </form.Field>
      </SettingsSection>
    </form>
  )
}
// @example:end

export const getCode = createExampleCode(source)
