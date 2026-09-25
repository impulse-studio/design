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

export type DigiIconRouterLinkProps = {
  "to": unknown
  "variant"?: "primary" | "link"
  "size"?: null | "sm" | "md" | "lg"
  "newTab"?: false | true
  "disabled"?: false | true
  "iconName": string
  "tooltip": string
  "tooltipSide"?: "top" | "right" | "bottom" | "left"
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

export function DigiIconRouterLink(props: DigiIconRouterLinkProps) {
  return createElement(DigitComponentView, {
    component: "DigiIconRouterLink",
    props: props as unknown as Record<string, unknown>,
    children: props.children,
    slots: props.slots,
    style: props.style,
  })
}
