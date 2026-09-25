"use client"
// beui.dev/components/agents/approval-card

// beui.dev/components/agents/approval-card
// beui.dev/components/agents/approval-card
// beui.dev/components/agents/approval-card
import {
  RiArrowLeftLine as ArrowLeft,
  RiArrowRightLine as ArrowRight,
  RiCheckLine as Check,
  RiQuestionLine as CircleHelp,
  RiLoader4Line as LoaderCircle,
  RiChat3Line as MessageSquareText,
  RiCloseLine as X,
} from "@remixicon/react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useCallback, useEffect, useRef, useState } from "react"
import { revalidateLogic, useField, useForm } from "@tanstack/react-form"
import {
  createApprovalAnswerSchema,
  createApprovalFormSchema,
} from "@/validators/approval"
import { FieldError } from "@/components/ui/field"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { QuestionOptions } from "./QuestionOptions"
import { ProgressDots } from "./ProgressDots"
import {
  EMPTY_ANSWER,
  getStatusLabel,
  getStatusClass,
  isAnswered,
} from "./status"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EASE_OUT, SPRING_SWAP } from "@/lib/motion"
import { cn } from "@/lib/utils"
import type {
  ApprovalCardAnswer,
  ApprovalCardAnswers,
  ApprovalCardProps,
} from "./types"

export type {
  ApprovalCardAnswer,
  ApprovalCardAnswers,
  ApprovalCardOption,
  ApprovalCardQuestion,
  ApprovalCardStatus,
  ApprovalCardProps,
} from "./types"

export function ApprovalCard({
  title = "Approbation requise",
  description,
  children,
  questions = [],
  status = "pending",
  answers,
  defaultAnswers = {},
  onAnswersChange,
  step,
  defaultStep = 0,
  onStepChange,
  onSubmit,
  onApprove,
  onReject,
  onRequestChanges,
  onDismiss,
  approveLabel = "Approuver",
  submitLabel = "Envoyer la réponse",
  result,
  className,
}: ApprovalCardProps) {
  const reduce = useReducedMotion() ?? false
  const schema = createApprovalFormSchema(questions)
  const form = useForm({
    defaultValues: { answers: defaultAnswers },
    validationLogic: revalidateLogic(),
    validators: { onDynamic: schema },
    onSubmit: ({ value }) => {
      if (status !== "pending") return
      onSubmit?.(schema.parse(value).answers)
    },
    onSubmitInvalid: ({ value }) => {
      const invalid = questions.findIndex(
        (item) =>
          !createApprovalAnswerSchema(item).safeParse(
            value.answers[item.id] ?? EMPTY_ANSWER
          ).success
      )
      if (invalid >= 0) setStep(invalid)
    },
  })
  const answerField = useField({ form, name: "answers" })
  const internalAnswers = answerField.state.value
  useEffect(() => {
    if (answers !== undefined)
      form.setFieldValue("answers", answers, { dontUpdateMeta: true })
  }, [answers, form])
  const [internalStep, setInternalStep] = useState(defaultStep)
  const autoAdvanceTimer = useRef<number | undefined>(undefined)
  const currentAnswers = answers ?? internalAnswers
  const currentStep = Math.min(
    Math.max(0, step ?? internalStep),
    Math.max(0, questions.length - 1)
  )
  const question = questions.at(currentStep)
  const questionMode = questions.length > 0
  const multipleQuestions = questions.length > 1
  const pending = status === "pending"
  const busy = status === "submitting"
  const interactive = pending || busy
  const currentAnswer = question
    ? (currentAnswers[question.id] ?? EMPTY_ANSWER)
    : EMPTY_ANSWER
  const displayTitle = question?.title ?? title
  const titleKey = question?.id ?? String(status)
  const statusLabel = getStatusLabel(status)

  const clearAutoAdvance = useCallback(() => {
    if (autoAdvanceTimer.current === undefined) return
    window.clearTimeout(autoAdvanceTimer.current)
    autoAdvanceTimer.current = undefined
  }, [])

  useEffect(() => clearAutoAdvance, [clearAutoAdvance])

  const setAnswers = useCallback(
    (next: ApprovalCardAnswers) => {
      if (answers === undefined) form.setFieldValue("answers", next)
      onAnswersChange?.(next)
    },
    [answers, onAnswersChange, form]
  )

  const setStep = (next: number) => {
    clearAutoAdvance()
    if (step === undefined) setInternalStep(next)
    onStepChange?.(next)
  }

  const updateCurrentAnswer = (next: ApprovalCardAnswer) => {
    clearAutoAdvance()
    if (!question) return
    setAnswers({ ...currentAnswers, [question.id]: next })
  }

  const continueQuestion = () => {
    if (busy || form.state.isSubmitting) return
    if (currentStep < questions.length - 1) {
      setStep(currentStep + 1)
      return
    }
    form.setFieldValue("answers", currentAnswers)
    void form.handleSubmit()
  }

  const queueAutoAdvance = () => {
    if (
      !question ||
      question.multiple ||
      question.autoAdvance === false ||
      currentStep >= questions.length - 1 ||
      busy
    ) {
      return
    }

    clearAutoAdvance()
    autoAdvanceTimer.current = window.setTimeout(() => {
      setStep(currentStep + 1)
    }, 240)
  }

  return (
    <div
      data-state={status}
      aria-busy={busy}
      className={cn(
        "w-full overflow-hidden rounded-2xl bg-muted p-4 text-sm",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className={cn(
            "grid size-5 shrink-0 place-items-center text-muted-foreground",
            getStatusClass(status)
          )}
        >
          {busy ? (
            <LoaderCircle className={cn("size-4", !reduce && "animate-spin")} />
          ) : interactive ? (
            questionMode ? (
              <CircleHelp className="size-4" />
            ) : (
              <MessageSquareText className="size-4" />
            )
          ) : status === "rejected" ? (
            <X className="size-4" />
          ) : (
            <Check className="size-4" />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-start gap-2">
            <h3 className="min-w-0 flex-[1_1_8rem] text-base leading-5 font-medium text-foreground">
              <motion.span
                key={titleKey}
                initial={reduce ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : SPRING_SWAP}
              >
                {displayTitle}
              </motion.span>
            </h3>
            {questionMode && interactive ? (
              multipleQuestions ? (
                <span className="shrink-0 text-xs text-muted-foreground/65 tabular-nums">
                  {currentStep + 1}/{questions.length}
                </span>
              ) : null
            ) : (
              <Badge variant="outline" role="status">
                {statusLabel}
              </Badge>
            )}
            {onDismiss ? (
              <Button
                variant="ghost"
                size="icon"
                type="button"
                aria-label="Fermer"
                onClick={onDismiss}
                className="grid size-5 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="size-4" />
              </Button>
            ) : null}
          </div>

          <Collapsible open={interactive}>
            <CollapsibleContent>
              {questionMode && question ? (
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={question.id}
                    initial={reduce ? { opacity: 1 } : { opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, x: -6 }}
                    transition={{ duration: reduce ? 0 : 0.2, ease: EASE_OUT }}
                  >
                    {question.description ? (
                      <p className="mt-1 leading-5 text-muted-foreground">
                        {question.description}
                      </p>
                    ) : null}
                    <QuestionOptions
                      question={question}
                      answer={currentAnswer}
                      disabled={busy}
                      onChange={updateCurrentAnswer}
                      onSingleSelect={queueAutoAdvance}
                    />
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div>
                  {description ? (
                    <p className="mt-1 leading-5 text-muted-foreground">
                      {description}
                    </p>
                  ) : null}
                  {children ? <div className="mt-3">{children}</div> : null}
                </div>
              )}

              {questionMode ? (
                <div className="mt-4 flex items-center gap-3">
                  {multipleQuestions ? (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Question précédente"
                        disabled={busy || currentStep === 0}
                        onClick={() => setStep(currentStep - 1)}
                        className="rounded-full"
                      >
                        <ArrowLeft className="size-4" />
                      </Button>
                      <ProgressDots
                        current={currentStep}
                        ids={questions.map((item) => item.id)}
                      />
                    </>
                  ) : null}
                  <Button
                    size={currentStep === questions.length - 1 ? "sm" : "icon"}
                    aria-label={
                      currentStep === questions.length - 1
                        ? "Envoyer la réponse"
                        : "Question suivante"
                    }
                    disabled={busy || !isAnswered(currentAnswer)}
                    onClick={continueQuestion}
                    className="ml-auto rounded-full"
                  >
                    {busy ? (
                      <LoaderCircle
                        className={cn("size-4", !reduce && "animate-spin")}
                      />
                    ) : currentStep === questions.length - 1 ? (
                      <>
                        {submitLabel}
                        <ArrowRight className="size-3.5" />
                      </>
                    ) : (
                      <ArrowRight className="size-4" />
                    )}
                  </Button>
                </div>
              ) : (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    disabled={busy}
                    onClick={onApprove}
                    className="rounded-full"
                  >
                    {approveLabel}
                  </Button>
                  {onRequestChanges ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={busy}
                      onClick={onRequestChanges}
                      className="rounded-full"
                    >
                      Demander des modifications
                    </Button>
                  ) : null}
                  {onReject ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={busy}
                      onClick={onReject}
                      className="rounded-full text-destructive"
                    >
                      Refuser
                    </Button>
                  ) : null}
                </div>
              )}
              <form.Subscribe selector={(state) => state.errorMap.onDynamic}>
                {(errors) => (
                  <FieldError
                    errors={errors ? Object.values(errors).flat() : []}
                  />
                )}
              </form.Subscribe>
            </CollapsibleContent>
          </Collapsible>

          {!interactive ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {result ?? statusLabel}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
