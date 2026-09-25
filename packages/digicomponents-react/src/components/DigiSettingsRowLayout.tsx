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

export type DigiSettingsRowLayoutProps = {
  "label": string
  "description"?: string
  "helpLink"?: string
  "indications"?: string
  "disabled"?: false | true
  "context"?: "modal" | "card" | "nude"
  children?: ReactNode
  slots?: Partial<Record<"top" | "default", ReactNode[]>>
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

export function DigiSettingsRowLayout(props: DigiSettingsRowLayoutProps) {
  return createElement(DigitComponentView, {
    component: "DigiSettingsRowLayout",
    props: props as unknown as Record<string, unknown>,
    children: props.children,
    slots: props.slots,
    style: props.style,
  })
}
