import type { ChatQuestion } from "@/validators/chat/messages"
import {
  createQuestionnaireAnswerSchema,
  createQuestionnaireAnswersSchema,
} from "@/validators/chat/questionnaire"
import type { QuestionnaireRule } from "@/validators/chat/questionnaire"

export const chatQuestionRule = (
  question: ChatQuestion
): QuestionnaireRule => ({
  id: question.id,
  required: question.required,
  multiple: question.multiple,
  allowCustom: true,
  options: question.choices,
})

export const createQuestionAnswerSchema = (question: ChatQuestion) =>
  createQuestionnaireAnswerSchema(chatQuestionRule(question))

export const createQuestionnaireSchema = (questions: ChatQuestion[]) =>
  createQuestionnaireAnswersSchema(questions.map(chatQuestionRule))
