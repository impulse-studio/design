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

export type DigiIconLinkProps = {
  "href": string
  "iconName": string
  "size"?: null | "sm" | "md" | "lg"
  "variant"?: "primary" | "link"
  "tooltipSide"?: "top" | "right" | "bottom" | "left"
  "disabled"?: false | true
  "tooltip": string
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

export function DigiIconLink(props: DigiIconLinkProps) {
  return createElement(DigitComponentView, {
    component: "DigiIconLink",
    props: props as unknown as Record<string, unknown>,
    children: props.children,
    slots: props.slots,
    style: props.style,
  })
}
