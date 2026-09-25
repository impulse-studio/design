import {
  createQuestionnaireAnswerSchema,
  createQuestionnaireAnswersSchema,
  questionnaireAnswerSchema,
} from "@/validators/chat/questionnaire"
import type { QuestionnaireRule } from "@/validators/chat/questionnaire"

type ApprovalQuestionRule = {
  id: string
  multiple?: boolean
  allowCustom?: boolean
  options?: Array<{ value: string; disabled?: boolean }>
}

export const approvalAnswerSchema = questionnaireAnswerSchema
export const answeredSchema = approvalAnswerSchema.refine(
  (answer) => answer.selected.length > 0 || Boolean(answer.custom.trim()),
  "Choisissez une réponse ou écrivez la vôtre."
)

const approvalQuestionRule = (
  question: ApprovalQuestionRule
): QuestionnaireRule => ({
  id: question.id,
  required: true,
  multiple: question.multiple ?? false,
  allowCustom: question.allowCustom ?? false,
  options: question.options ?? [],
})

export const createApprovalAnswerSchema = (question: ApprovalQuestionRule) =>
  createQuestionnaireAnswerSchema(approvalQuestionRule(question))

export const createApprovalFormSchema = (questions: ApprovalQuestionRule[]) =>
  createQuestionnaireAnswersSchema(questions.map(approvalQuestionRule))
