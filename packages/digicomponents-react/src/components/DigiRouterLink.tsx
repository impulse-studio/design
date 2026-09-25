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

export type DigiRouterLinkProps = {
  "to": unknown
  "variant": "primary" | "secondary" | "ghost" | "link"
  "size"?: "sm" | "md" | "lg" | "icon"
  "newTab"?: false | true
  "disabled"?: false | true
  "iconName"?: string
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

export function DigiRouterLink(props: DigiRouterLinkProps) {
  return createElement(DigitComponentView, {
    component: "DigiRouterLink",
    props: props as unknown as Record<string, unknown>,
    children: props.children,
    slots: props.slots,
    style: props.style,
  })
}
