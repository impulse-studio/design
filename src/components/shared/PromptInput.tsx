"use client"
// beui.dev/components/agents/prompt-input

import {
  RiArrowUpLine as ArrowUp,
  RiAddLine as Plus,
  RiStopFill as Square,
} from "@remixicon/react"
import { Textarea } from "@/components/ui/textarea"
import { useForm, useStore } from "@tanstack/react-form"
import { createPromptSchema } from "@/features/chat/prompt-schema"
import type { PromptValues } from "@/features/chat/prompt-schema"
import { FieldError } from "@/components/ui/field"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import type {
  FormEvent,
  KeyboardEvent,
  ReactNode,
  TextareaHTMLAttributes,
} from "react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectTrigger,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const SPRING_SWAP = { type: "spring", stiffness: 400, damping: 30 } as const

export interface PromptModel {
  value: string
  label: ReactNode
  icon?: ReactNode
  disabled?: boolean
}

export interface PromptAction {
  value: string
  label: ReactNode
  description?: ReactNode
  icon?: ReactNode
  disabled?: boolean
}

export interface PromptInputProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "value" | "defaultValue" | "onChange" | "onSubmit" | "children"
> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  models?: PromptModel[]
  model?: string
  defaultModel?: string
  onModelChange?: (model: string) => void
  actions?: PromptAction[]
  onAction?: (action: string) => void
  onSubmit?: (value: string, model?: string) => void | Promise<void>
  submitDisabled?: boolean
  /** Allow an attachment-only message. The consumer validates its attachments. */
  allowEmpty?: boolean
  loading?: boolean
  onStop?: () => void
  minRows?: number
  maxRows?: number
  leadingAction?: ReactNode
  className?: string
}

export function PromptInput({
  value,
  defaultValue = "",
  onValueChange,
  models = [],
  model,
  defaultModel,
  onModelChange,
  actions = [],
  onAction,
  onSubmit,
  submitDisabled = false,
  allowEmpty = false,
  loading = false,
  onStop,
  minRows = 2,
  maxRows = 8,
  leadingAction,
  className,
  disabled,
  placeholder = "Que souhaitez-vous faire ?",
  "aria-label": ariaLabel = "Prompt",
  onKeyDown,
  ...textareaProps
}: PromptInputProps) {
  const reduce = useReducedMotion() ?? false
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const measurementRef = useRef<HTMLDivElement>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const schema = createPromptSchema(allowEmpty)
  const defaultValues: PromptValues = {
    text: defaultValue,
    model: defaultModel ?? models[0]?.value,
  }
  const form = useForm({
    defaultValues,
    validators: { onSubmit: schema },
    onSubmit: async ({ value: submitted, formApi }) => {
      if (disabled || submitDisabled || loading) return
      setSubmitError(null)
      const prompt = schema.parse(submitted)
      try {
        await onSubmit?.(prompt.text, prompt.model)
        if (value === undefined && formApi.state.values.text === submitted.text)
          formApi.setFieldValue("text", "")
        textareaRef.current?.focus({ preventScroll: true })
      } catch {
        setSubmitError("Le message n’a pas pu être envoyé. Réessayez.")
      }
    },
  })
  const formValues = useStore(form.store, (state) => state.values)
  const isSubmitting = useStore(form.store, (state) => state.isSubmitting)
  const [actionsOpen, setActionsOpen] = useState(false)
  const currentValue = value ?? formValues.text
  const currentModelValue = model ?? formValues.model
  const currentModel = models.find(
    (option) => option.value === currentModelValue
  )
  const canSubmit =
    schema.safeParse({ text: currentValue, model: currentModelValue })
      .success &&
    !disabled &&
    !submitDisabled &&
    !loading &&
    !isSubmitting

  const resizeTextarea = useCallback(() => {
    const textarea = textareaRef.current
    const measurement = measurementRef.current
    if (!textarea || !measurement || textarea.value !== currentValue) return

    const lineHeight = 24
    const nextHeight = Math.min(
      Math.max(measurement.scrollHeight, minRows * lineHeight),
      maxRows * lineHeight
    )
    const height = `${nextHeight}px`
    if (textarea.style.height !== height) textarea.style.height = height
  }, [currentValue, maxRows, minRows])

  useLayoutEffect(() => {
    resizeTextarea()
  }, [resizeTextarea])

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea || typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(resizeTextarea)
    observer.observe(textarea)
    return () => observer.disconnect()
  }, [resizeTextarea])

  const setValue = (next: string) => {
    if (value === undefined) form.setFieldValue("text", next)
    onValueChange?.(next)
  }

  const setModel = (next: string) => {
    if (model === undefined) form.setFieldValue("model", next)
    onModelChange?.(next)
  }

  const submit = (event?: FormEvent) => {
    event?.preventDefault()
    if (!canSubmit || form.state.isSubmitting) return
    form.setFieldValue("text", currentValue)
    form.setFieldValue("model", currentModelValue)
    void form.handleSubmit()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    onKeyDown?.(event)
    if (
      event.defaultPrevented ||
      event.key !== "Enter" ||
      event.shiftKey ||
      event.nativeEvent.isComposing
    ) {
      return
    }
    event.preventDefault()
    submit()
  }

  return (
    <form
      noValidate
      aria-busy={isSubmitting}
      onSubmit={submit}
      className={cn(
        "relative w-full rounded-2xl border border-border/80 bg-background p-2 transition-colors focus-within:border-foreground/25",
        disabled && "opacity-60",
        className
      )}
    >
      <div
        ref={measurementRef}
        aria-hidden="true"
        className="pointer-events-none invisible absolute inset-x-2 top-0 px-2 text-sm leading-6 [overflow-wrap:break-word] whitespace-pre-wrap"
      >
        {`${currentValue}\u200b`}
      </div>
      <Textarea
        ref={textareaRef}
        value={currentValue}
        disabled={disabled}
        placeholder={placeholder}
        aria-label={ariaLabel}
        rows={minRows}
        {...textareaProps}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        className="block field-sizing-fixed min-h-0 w-full resize-none overflow-y-auto border-0 bg-transparent px-2 pt-1.5 text-sm leading-6 text-foreground shadow-none outline-none placeholder:text-muted-foreground/55 focus-visible:ring-0 dark:bg-transparent"
      />

      <div className="mt-1 flex min-h-8 items-center gap-1">
        {actions.length ? (
          <Popover open={actionsOpen} onOpenChange={setActionsOpen}>
            <PopoverTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={disabled || loading}
                  aria-label="Ajouter au message"
                  className="size-8 rounded-full"
                />
              }
            >
              <motion.span
                aria-hidden="true"
                animate={{ rotate: actionsOpen ? 45 : 0 }}
                transition={reduce ? { duration: 0 } : SPRING_SWAP}
              >
                <Plus className="size-4" />
              </motion.span>
            </PopoverTrigger>

            <PopoverContent
              side="top"
              align="start"
              sideOffset={8}
              className="w-56 p-1.5"
            >
              {actions.map((action) => (
                <Button
                  variant="ghost"
                  key={action.value}
                  type="button"
                  disabled={action.disabled}
                  onClick={() => {
                    onAction?.(action.value)
                    setActionsOpen(false)
                  }}
                  className="flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors outline-none hover:bg-muted focus-visible:bg-muted disabled:pointer-events-none disabled:opacity-50"
                >
                  {action.icon ? (
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center text-muted-foreground [&_svg]:size-4">
                      {action.icon}
                    </span>
                  ) : null}
                  <span className="min-w-0">
                    <span className="block text-sm text-foreground">
                      {action.label}
                    </span>
                    {action.description ? (
                      <span className="mt-0.5 block text-xs leading-4 text-muted-foreground">
                        {action.description}
                      </span>
                    ) : null}
                  </span>
                </Button>
              ))}
            </PopoverContent>
          </Popover>
        ) : null}
        {leadingAction}
        {models.length ? (
          <Select
            value={currentModelValue}
            onValueChange={(next) => {
              if (next !== null) setModel(next)
            }}
            disabled={disabled || loading}
          >
            <SelectTrigger
              aria-label="Modèle"
              variant="ghost"
              className="h-8 w-auto max-w-52 rounded-xl border-0 bg-transparent px-2 py-0 text-xs hover:bg-muted focus-visible:ring-2"
            >
              <span className="flex min-w-0 items-center gap-1.5">
                {currentModel?.icon ? (
                  <span className="grid size-4 shrink-0 place-items-center text-muted-foreground [&_svg]:size-3.5">
                    {currentModel.icon}
                  </span>
                ) : null}
                <span className="truncate text-muted-foreground">
                  {currentModel?.label ?? "Choisir un modèle"}
                </span>
              </span>
            </SelectTrigger>
            <SelectContent className="right-auto w-52 shadow-none">
              <SelectGroup>
                {models.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    className="py-2"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      {option.icon ? (
                        <span className="grid size-5 shrink-0 place-items-center text-muted-foreground [&_svg]:size-4">
                          {option.icon}
                        </span>
                      ) : null}
                      <span className="min-w-0 truncate text-sm text-foreground">
                        {option.label}
                      </span>
                    </span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        ) : null}

        <Button
          type={loading ? "button" : "submit"}
          size="icon"
          disabled={disabled || (loading ? !onStop : !canSubmit)}
          aria-label={loading ? "Arrêter" : "Envoyer"}
          onClick={loading ? onStop : undefined}
          className="ml-auto size-8 rounded-full"
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={loading ? "stop" : "send"}
              initial={
                reduce ? { opacity: 1 } : { opacity: 0, y: 3, scale: 0.8 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -3, scale: 0.8 }}
              transition={reduce ? { duration: 0 } : SPRING_SWAP}
              className="grid place-items-center"
            >
              {loading ? (
                <Square className="size-3 fill-current" />
              ) : (
                <ArrowUp className="size-4" />
              )}
            </motion.span>
          </AnimatePresence>
        </Button>
      </div>
      {submitError && <FieldError>{submitError}</FieldError>}
    </form>
  )
}
