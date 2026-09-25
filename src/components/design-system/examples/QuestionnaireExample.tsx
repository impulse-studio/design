import source from "./QuestionnaireExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import {
  Questionnaire,
  QuestionnaireItem,
  QuestionnaireTitle,
  QuestionnaireDescription,
  QuestionnaireChoices,
  QuestionnaireChoice,
  QuestionnaireActions,
  QuestionnaireSubmit,
  QuestionnaireError,
} from "@/components/ui/questionnaire"
import { toast } from "@/components/ui/toast"

const questionnaireSchema = z.object({
  access: z
    .string()
    .pipe(z.enum(["solo", "team"], { error: "Choisissez un accès." })),
})

export function QuestionnaireExample() {
  const form = useForm({
    defaultValues: { access: "" },
    validators: { onSubmit: questionnaireSchema },
    onSubmit: ({ value }) => {
      questionnaireSchema.parse(value)
      toast.add({ title: "Préférence enregistrée" })
    },
  })
  const items = [
    {
      name: "access",
      required: true,
      choices: [{ value: "solo" }, { value: "team" }],
    },
  ] as const
  return (
    <Questionnaire
      className="w-full max-w-sm"
      items={items}
      defaultItem="access"
      onSubmit={(event) => {
        event.preventDefault()
        if (!form.state.isSubmitting) void form.handleSubmit()
      }}
    >
      <QuestionnaireItem name="access" required>
        <QuestionnaireTitle>Avec qui travaillez-vous ?</QuestionnaireTitle>
        <QuestionnaireDescription>
          Choisissez l’accès à votre espace.
        </QuestionnaireDescription>
        <form.Field name="access">
          {(field) => (
            <QuestionnaireChoices>
              <QuestionnaireChoice
                value="solo"
                checked={field.state.value === "solo"}
                onChange={(event) => {
                  if (event.target.checked) field.handleChange("solo")
                }}
              >
                Je travaille seul
              </QuestionnaireChoice>
              <QuestionnaireChoice
                value="team"
                checked={field.state.value === "team"}
                onChange={(event) => {
                  if (event.target.checked) field.handleChange("team")
                }}
              >
                Je travaille en équipe
              </QuestionnaireChoice>
            </QuestionnaireChoices>
          )}
        </form.Field>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnaireSubmit>Enregistrer</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  )
}
// @example:end

export const getCode = createExampleCode(source)
