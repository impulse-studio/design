import source from "./DialogExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import { useState } from "react"
import { revalidateLogic, useForm } from "@tanstack/react-form"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FormTextField } from "@/components/shared/FormTextField"
import { FieldGroup } from "@/components/ui/field"
import { mockupNameFormSchema } from "@/features/mockups/schemas"
import { toast } from "@/components/ui/toast"

export function DialogExample() {
  const [open, setOpen] = useState(false)
  const form = useForm({
    defaultValues: { name: "Bibliothèque Digit" },
    validationLogic: revalidateLogic({ mode: "blur" }),
    validators: { onDynamic: mockupNameFormSchema },
    onSubmit: ({ value, formApi }) => {
      const data = mockupNameFormSchema.parse(value)
      toast.add({ title: "Nom enregistré", description: data.name })
      formApi.reset(data)
      setOpen(false)
    },
  })
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) form.reset()
        setOpen(next)
      }}
    >
      <DialogTrigger render={<Button variant="outline" />}>
        Renommer le projet
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Renommer le projet</DialogTitle>
          <DialogDescription>
            Choisissez un nom facile à retrouver.
          </DialogDescription>
        </DialogHeader>
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault()
            if (!form.state.isSubmitting) void form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.Field name="name">
              {(field) => (
                <FormTextField field={field} label="Nom du projet" required />
              )}
            </form.Field>
          </FieldGroup>
          <DialogFooter className="mt-6">
            <DialogClose render={<Button type="button" variant="outline" />}>
              Annuler
            </DialogClose>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
// @example:end

export const getCode = createExampleCode(source)
