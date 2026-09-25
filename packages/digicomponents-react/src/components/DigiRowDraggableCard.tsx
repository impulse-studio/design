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

export type DigiRowDraggableCardProps = {
  "name": unknown
  "size"?: null | "sm" | "md"
  "active"?: false | true
  "disabled"?: false | true
  "enableDrag"?: unknown
  "canBeGrouped"?: false | true
  children?: ReactNode
  slots?: Partial<Record<"title-prepend" | "title-more-info" | "more-info" | "actions", ReactNode[]>>
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

export function DigiRowDraggableCard(props: DigiRowDraggableCardProps) {
  return createElement(DigitComponentView, {
    component: "DigiRowDraggableCard",
    props: props as unknown as Record<string, unknown>,
    children: props.children,
    slots: props.slots,
    style: props.style,
  })
}
