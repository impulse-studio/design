import type { ChatAnswers, ChatBlock } from "@/validators/chat/messages"
import { useEffect } from "react"
import { revalidateLogic, useField, useForm } from "@tanstack/react-form"
import {
  createQuestionnaireSchema,
  createQuestionAnswerSchema,
} from "@/validators/chat/questions"
import { FieldError } from "@/components/ui/field"
import { summarizeAnswers } from "@/features/chat/scenarios"
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoices,
  QuestionnaireChoice,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ChatQuestions({
  block,
  disabled,
  onChange,
  onSubmit,
}: {
  block: Extract<ChatBlock, { type: "questions" }>
  disabled?: boolean
  onChange?: (answers: ChatAnswers, current: string) => void
  onSubmit?: () => void
}) {
  const schema = createQuestionnaireSchema(block.questions)
  const form = useForm({
    defaultValues: { answers: block.answers },
    validationLogic: revalidateLogic(),
    validators: { onDynamic: schema },
    onSubmit: ({ value }) => {
      if (disabled || block.submitted) return
      schema.parse(value)
      onSubmit?.()
    },
    onSubmitInvalid: ({ value }) => {
      const invalid = block.questions.find(
        (question) =>
          !createQuestionAnswerSchema(question).safeParse(
            value.answers[question.id] ?? { selected: [], custom: "" }
          ).success
      )
      if (invalid) onChange?.(value.answers, invalid.id)
    },
  })
  const answerField = useField({ form, name: "answers" })
  const answers = answerField.state.value
  useEffect(() => {
    form.setFieldValue("answers", block.answers, { dontUpdateMeta: true })
  }, [block.answers, form])
  const updateAnswers = (next: ChatAnswers, current: string) => {
    form.setFieldValue("answers", next)
    onChange?.(next, current)
  }
  if (block.submitted || disabled)
    return (
      <Card size="sm">
        <CardHeader>
          <CardTitle>
            {block.submitted ? "Vos réponses" : "Questions interrompues"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs leading-relaxed whitespace-pre-wrap">
            {summarizeAnswers(block.questions, block.answers)}
          </p>
        </CardContent>
      </Card>
    )
  return (
    <Card size="sm">
      <CardContent>
        <Questionnaire
          items={block.questions.map((question) => ({
            name: question.id,
            required: question.required,
            choices: question.choices,
          }))}
          item={block.current}
          onItemChange={(current) => onChange?.(answers, current)}
          onSubmit={(event) => {
            event.preventDefault()
            if (!form.state.isSubmitting) void form.handleSubmit()
          }}
          className="chat-questionnaire gap-4 [&_[data-slot=questionnaire-actions]]:gap-1 [&_[data-slot=questionnaire-actions]_button]:px-1.75 [&_[data-slot=questionnaire-actions]_button]:text-[11px] [&_[data-slot=questionnaire-choice]]:gap-2 [&_[data-slot=questionnaire-choice]]:p-2.5 [&_[data-slot=questionnaire-choice]]:text-[12px] [&_[data-slot=questionnaire-choices]]:gap-2 [&_[data-slot=questionnaire-description]]:text-[12px] [&_[data-slot=questionnaire-title]]:text-[14px] [&_[data-slot=questionnaire-title]]:leading-[1.5]"
        >
          <QuestionnaireProgress>
            Question{" "}
            {Math.max(
              0,
              block.questions.findIndex(
                (question) => question.id === block.current
              )
            ) + 1}{" "}
            sur {block.questions.length}
          </QuestionnaireProgress>
          {block.questions.map((question) => {
            const answer = answers[question.id] ?? { selected: [], custom: "" }
            return (
              <QuestionnaireItem
                key={question.id}
                name={question.id}
                required={question.required}
                multiple={question.multiple}
              >
                <QuestionnaireTitle>{question.title}</QuestionnaireTitle>
                <QuestionnaireDescription>
                  {question.description}
                </QuestionnaireDescription>
                <QuestionnaireChoices>
                  {question.choices.map((choice) => (
                    <QuestionnaireChoice
                      key={choice.value}
                      value={choice.value}
                      checked={answer.selected.includes(choice.value)}
                      onChange={(event) => {
                        const selected = question.multiple
                          ? event.target.checked
                            ? [...answer.selected, choice.value]
                            : answer.selected.filter(
                                (value) => value !== choice.value
                              )
                          : event.target.checked
                            ? [choice.value]
                            : []
                        updateAnswers(
                          {
                            ...answers,
                            [question.id]: {
                              ...answer,
                              selected,
                              custom: question.multiple ? answer.custom : "",
                            },
                          },
                          block.current
                        )
                      }}
                    >
                      {choice.label}
                    </QuestionnaireChoice>
                  ))}
                  <QuestionnaireInput
                    aria-label={`Réponse libre : ${question.title}`}
                    placeholder={
                      question.choices.length
                        ? "Ou votre propre réponse…"
                        : "Vos précisions…"
                    }
                    value={answer.custom}
                    onChange={(event) =>
                      updateAnswers(
                        {
                          ...answers,
                          [question.id]: {
                            ...answer,
                            custom: event.target.value,
                            selected: question.multiple ? answer.selected : [],
                          },
                        },
                        block.current
                      )
                    }
                  />
                </QuestionnaireChoices>
                <QuestionnaireError>
                  Choisissez une réponse ou écrivez la vôtre.
                </QuestionnaireError>
              </QuestionnaireItem>
            )
          })}
          <QuestionnaireActions>
            <QuestionnairePrevious size="sm">Retour</QuestionnairePrevious>
            <QuestionnaireSkip
              size="sm"
              onClick={() =>
                updateAnswers(
                  { ...answers, [block.current]: { selected: [], custom: "" } },
                  block.current
                )
              }
            >
              Passer
            </QuestionnaireSkip>
            <QuestionnaireNext size="sm">Suivant</QuestionnaireNext>
            <QuestionnaireSubmit size="sm">Valider</QuestionnaireSubmit>
          </QuestionnaireActions>
          <form.Subscribe selector={(state) => state.errorMap.onDynamic}>
            {(errors) => (
              <FieldError errors={errors ? Object.values(errors).flat() : []} />
            )}
          </form.Subscribe>
        </Questionnaire>
      </CardContent>
    </Card>
  )
}
