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

export type DigiRowCardProps = {
  "size"?: null | "sm" | "md"
  "iconName"?: string
  "active"?: false | true
  "disabled"?: false | true
  children?: ReactNode
  slots?: Partial<Record<"title" | "title-more-info" | "more-info" | "actions", ReactNode[]>>
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

export function DigiRowCard(props: DigiRowCardProps) {
  return createElement(DigitComponentView, {
    component: "DigiRowCard",
    props: props as unknown as Record<string, unknown>,
    children: props.children,
    slots: props.slots,
    style: props.style,
  })
}
