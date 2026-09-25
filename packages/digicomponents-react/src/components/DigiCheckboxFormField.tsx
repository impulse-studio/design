import { createElement } from "react"
import type {
  ChangeEventHandler,
  CSSProperties,
  FocusEventHandler,
  FormEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
} from "react"
import { DigitComponentView } from "../DigitComponentView"

export type DigiCheckboxFormFieldProps = {
  "disabled"?: false | true
  "name": string
  "indications"?: string
  "label": string
  "description"?: string
  "placeholder"?: string
  "required"?: false | true
  "context"?: "modal" | "card" | "nude"
  children?: ReactNode
  slots?: Partial<Record<"labelPrepend", ReactNode[]>>
  style?: CSSProperties
  class?: string
  className?: string
  onClick?: MouseEventHandler<HTMLElement>
  onChange?: ChangeEventHandler<HTMLElement>
  onFocus?: FocusEventHandler<HTMLElement>
  onBlur?: FocusEventHandler<HTMLElement>
  onKeyDown?: KeyboardEventHandler<HTMLElement>
  onSubmit?: FormEventHandler<HTMLElement>
}

export function DigiCheckboxFormField(props: DigiCheckboxFormFieldProps) {
  return createElement(DigitComponentView, {
    component: "DigiCheckboxFormField",
    props: props as unknown as Record<string, unknown>,
    children: props.children,
    slots: props.slots,
    style: props.style,
  })
}
