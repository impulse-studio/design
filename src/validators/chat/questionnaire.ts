import { z } from "zod"

export const questionnaireAnswerSchema = z.object({
  selected: z.array(z.string()),
  custom: z.string(),
})

type QuestionnaireAnswer = z.infer<typeof questionnaireAnswerSchema>
export type QuestionnaireAnswers = Partial<Record<string, QuestionnaireAnswer>>
export type QuestionnaireRule = {
  id: string
  required: boolean
  multiple: boolean
  allowCustom: boolean
  options: Array<{ value: string; disabled?: boolean }>
}

const emptyAnswer: QuestionnaireAnswer = { selected: [], custom: "" }

export const createQuestionnaireAnswerSchema = (rule: QuestionnaireRule) =>
  questionnaireAnswerSchema.superRefine((answer, context) => {
    const custom = answer.custom.trim()
    if (rule.required && answer.selected.length === 0 && !custom)
      context.addIssue({
        code: "custom",
        message: "Choisissez une réponse ou écrivez la vôtre.",
      })
    if (custom && !rule.allowCustom)
      context.addIssue({
        code: "custom",
        message: "Choisissez une réponse proposée.",
      })
    if (
      !rule.multiple &&
      (answer.selected.length > 1 || (answer.selected.length > 0 && custom))
    )
      context.addIssue({
        code: "custom",
        message: "Choisissez une seule réponse.",
      })
    if (
      answer.selected.some(
        (value) =>
          !rule.options.some(
            (option) => option.value === value && !option.disabled
          )
      )
    )
      context.addIssue({
        code: "custom",
        message: "Choisissez une réponse proposée.",
      })
  })

export const createQuestionnaireAnswersSchema = (rules: QuestionnaireRule[]) =>
  z
    .object({ answers: z.record(z.string(), questionnaireAnswerSchema) })
    .superRefine(({ answers }, context) => {
      for (const rule of rules) {
        const result = createQuestionnaireAnswerSchema(rule).safeParse(
          answers[rule.id] ?? emptyAnswer
        )
        if (!result.success)
          for (const issue of result.error.issues)
            context.addIssue({
              code: "custom",
              path: ["answers", rule.id],
              message: issue.message,
            })
      }
    })
