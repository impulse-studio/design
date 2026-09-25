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

export type DigiNumberInputProps = {
  "name"?: string
  "placeholder"?: string
  "disabled"?: false | true
  "state"?: unknown
  "iconName"?: string
  "min"?: string | number
  "max"?: string | number
  "step"?: number
  "accept"?: string
  "autocomplete"?: string
  "enforceBounds"?: false | true
  children?: ReactNode
  slots?: Partial<Record<"append" | "prepend", ReactNode[]>>
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

export function DigiNumberInput(props: DigiNumberInputProps) {
  return createElement(DigitComponentView, {
    component: "DigiNumberInput",
    props: props as unknown as Record<string, unknown>,
    children: props.children,
    slots: props.slots,
    style: props.style,
  })
}
