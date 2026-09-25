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

export type DigiOptionalSearchSelectFormFieldProps = {
  "name": string
  "zodSchema"?: unknown
  "indications"?: string
  "label": string
  "description"?: string
  "placeholder"?: string
  "disabled"?: false | true
  "required"?: false | true
  "context"?: "modal" | "card" | "nude"
  "selectProps": unknown
  children?: ReactNode
  slots?: Partial<Record<"popover-header" | "append-item" | "bottom", ReactNode[]>>
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

export function DigiOptionalSearchSelectFormField(props: DigiOptionalSearchSelectFormFieldProps) {
  return createElement(DigitComponentView, {
    component: "DigiOptionalSearchSelectFormField",
    props: props as unknown as Record<string, unknown>,
    children: props.children,
    slots: props.slots,
    style: props.style,
  })
}
