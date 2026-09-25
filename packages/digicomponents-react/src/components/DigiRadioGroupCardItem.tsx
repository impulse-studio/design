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

export type DigiRadioGroupCardItemProps = {
  "disabled"?: false | true
  "value"?: unknown
  "name"?: string
  "required"?: false | true
  "label": string
  "description"?: string
  "descriptionPlacement"?: "below" | "inside"
  "alignment"?: "left" | "center"
  "iconName"?: string
  "containerClass"?: unknown
  children?: ReactNode
  slots?: Partial<Record<"default", ReactNode[]>>
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

export function DigiRadioGroupCardItem(props: DigiRadioGroupCardItemProps) {
  return createElement(DigitComponentView, {
    component: "DigiRadioGroupCardItem",
    props: props as unknown as Record<string, unknown>,
    children: props.children,
    slots: props.slots,
    style: props.style,
  })
}
