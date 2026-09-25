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

export type DigiSearchSelectProps = {
  "id"?: string
  "multiple"?: false | true
  "options": unknown
  "valuePlaceholder"?: string
  "searchPlaceholder"?: string
  "emptySearchText"?: string
  "state"?: unknown
  "selectedText"?: string
  "disabled"?: false | true
  "triggerIcon"?: string
  "hideBadges"?: false | true
  children?: ReactNode
  slots?: Partial<Record<"prepend" | "append" | "popover-header" | "append-item", ReactNode[]>>
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

export function DigiSearchSelect(props: DigiSearchSelectProps) {
  return createElement(DigitComponentView, {
    component: "DigiSearchSelect",
    props: props as unknown as Record<string, unknown>,
    children: props.children,
    slots: props.slots,
    style: props.style,
  })
}
