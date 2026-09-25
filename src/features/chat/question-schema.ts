import { z } from "zod"
import { answerSchema } from "./types"
import type { ChatQuestion } from "./types"

export const createQuestionAnswerSchema = (question: ChatQuestion) =>
  answerSchema.superRefine((answer, context) => {
    if (
      question.required &&
      answer.selected.length === 0 &&
      !answer.custom.trim()
    )
      context.addIssue({
        code: "custom",
        message: `« ${question.title} » : choisissez une réponse ou écrivez la vôtre.`,
      })
    if (
      !question.multiple &&
      (answer.selected.length > 1 ||
        (answer.selected.length > 0 && answer.custom.trim()))
    )
      context.addIssue({
        code: "custom",
        message: "Choisissez une seule réponse.",
      })
    if (
      answer.selected.some(
        (value) => !question.choices.some((choice) => choice.value === value)
      )
    )
      context.addIssue({
        code: "custom",
        message: "Choisissez une réponse proposée.",
      })
  })

export const createQuestionnaireSchema = (questions: ChatQuestion[]) =>
  z
    .object({ answers: z.record(z.string(), answerSchema) })
    .superRefine(({ answers }, context) => {
      for (const question of questions) {
        const result = createQuestionAnswerSchema(question).safeParse(
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
