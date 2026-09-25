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

export type DigiButtonProps = {
  "variant"?: null | "destructive" | "primary" | "success" | "secondary" | "ghost" | "link"
  "size"?: null | "sm" | "md" | "lg" | "icon"
  "type"?: "button" | "submit"
  "block"?: false | true
  "iconName"?: string
  "disabled"?: false | true
  "formId"?: string
  "isLoading"?: unknown
  "id"?: string
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

export function DigiButton(props: DigiButtonProps) {
  return createElement(DigitComponentView, {
    component: "DigiButton",
    props: props as unknown as Record<string, unknown>,
    children: props.children,
    slots: props.slots,
    style: props.style,
  })
}
