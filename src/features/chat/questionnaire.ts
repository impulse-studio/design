import { createQuestionnaireAnswerSchema } from "@/validators/chat/questionnaire"
import type {
  QuestionnaireRule,
  QuestionnaireAnswers,
} from "@/validators/chat/questionnaire"

const emptyAnswer = { selected: [], custom: "" }
export const firstInvalidQuestion = (
  rules: QuestionnaireRule[],
  answers: QuestionnaireAnswers
) =>
  rules.findIndex(
    (rule) =>
      !createQuestionnaireAnswerSchema(rule).safeParse(
        answers[rule.id] ?? emptyAnswer
      ).success
  )
