import { useId } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"
import type { ApprovalCardQuestion, ApprovalCardAnswer } from "./types"

export function QuestionOptions({
  question,
  answer,
  disabled,
  onChange,
  onSingleSelect,
}: {
  question: ApprovalCardQuestion
  answer: ApprovalCardAnswer
  disabled: boolean
  onChange: (answer: ApprovalCardAnswer) => void
  onSingleSelect?: () => void
}) {
  const id = useId()
  return (
    <FieldGroup className="mt-3 gap-2">
      {question.multiple ? (
        question.options?.map((option, index) => (
          <Field key={option.value} orientation="horizontal">
            <Checkbox
              id={`${id}-${index}`}
              checked={answer.selected.includes(option.value)}
              disabled={disabled || option.disabled}
              onCheckedChange={(checked) =>
                onChange({
                  ...answer,
                  selected: checked
                    ? [...answer.selected, option.value]
                    : answer.selected.filter((value) => value !== option.value),
                })
              }
            />
            <FieldLabel htmlFor={`${id}-${index}`}>{option.label}</FieldLabel>
          </Field>
        ))
      ) : question.options?.length ? (
        <RadioGroup
          aria-label="Choix de réponse"
          value={answer.selected[0] ?? ""}
          onValueChange={(value) => {
            if (typeof value !== "string") return
            onChange({ selected: [value], custom: "" })
            onSingleSelect?.()
          }}
        >
          {question.options.map((option, index) => (
            <Field key={option.value} orientation="horizontal">
              <RadioGroupItem
                id={`${id}-${index}`}
                value={option.value}
                disabled={disabled || option.disabled}
              />
              <FieldLabel htmlFor={`${id}-${index}`}>{option.label}</FieldLabel>
            </Field>
          ))}
        </RadioGroup>
      ) : null}
      {question.allowCustom && (
        <Field>
          <FieldLabel htmlFor={`${id}-custom`}>Autre réponse</FieldLabel>
          <Input
            id={`${id}-custom`}
            value={answer.custom}
            disabled={disabled}
            placeholder={question.customPlaceholder ?? "Votre réponse…"}
            onChange={(event) =>
              onChange({
                selected: question.multiple ? answer.selected : [],
                custom: event.target.value,
              })
            }
          />
        </Field>
      )}
    </FieldGroup>
  )
}
