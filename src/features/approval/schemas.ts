import { z } from "zod"
import type { ApprovalCardQuestion } from "@/components/shared/approval/types"

export const approvalAnswerSchema = z.object({
  selected: z.array(z.string()),
  custom: z.string().optional(),
})
export const answeredSchema = approvalAnswerSchema.refine(
  (answer) => answer.selected.length > 0 || Boolean(answer.custom?.trim()),
  "Choisissez une réponse ou écrivez la vôtre."
)
export const createApprovalAnswerSchema = (question: ApprovalCardQuestion) =>
  answeredSchema.superRefine((answer, context) => {
    if (
      answer.selected.some(
        (value) =>
          !question.options?.some(
            (option) => option.value === value && !option.disabled
          )
      )
    )
      context.addIssue({
        code: "custom",
        message: "Choisissez une réponse proposée.",
      })
    if (answer.custom?.trim() && !question.allowCustom)
      context.addIssue({
        code: "custom",
        message: "Choisissez une réponse proposée.",
      })
    if (
      !question.multiple &&
      (answer.selected.length > 1 ||
        (answer.selected.length > 0 && answer.custom?.trim()))
    )
      context.addIssue({
        code: "custom",
        message: "Choisissez une seule réponse.",
      })
  })
export const createApprovalFormSchema = (questions: ApprovalCardQuestion[]) =>
  z
    .object({ answers: z.record(z.string(), approvalAnswerSchema) })
    .superRefine(({ answers }, context) => {
      for (const question of questions) {
        const result = createApprovalAnswerSchema(question).safeParse(
          answers[question.id] ?? { selected: [], custom: "" }
        )
        if (!result.success)
          for (const issue of result.error.issues)
            context.addIssue({
              code: "custom",
              path: ["answers"],
              message: issue.message,
            })
      }
    })
