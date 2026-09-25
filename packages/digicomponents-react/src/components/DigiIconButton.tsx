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

export type DigiIconButtonProps = {
  "iconName": string
  "size"?: null | "sm" | "md" | "lg"
  "variant"?: null | "destructive" | "primary" | "link"
  "tooltipSide"?: "top" | "right" | "bottom" | "left"
  "disabled"?: false | true
  "tooltip": unknown
  "iconClass"?: unknown
  "isLoading"?: false | true
  children?: ReactNode
  slots?: Partial<Record<never, ReactNode[]>>
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

export function DigiIconButton(props: DigiIconButtonProps) {
  return createElement(DigitComponentView, {
    component: "DigiIconButton",
    props: props as unknown as Record<string, unknown>,
    children: props.children,
    slots: props.slots,
    style: props.style,
  })
}
