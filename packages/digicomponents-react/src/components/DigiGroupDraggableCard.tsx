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

export type DigiGroupDraggableCardProps = {
  "disabled"?: false | true
  "name": string
  "enableDrag"?: false | true
  "size"?: null | "sm" | "md"
  "editable"?: false | true
  children?: ReactNode
  slots?: Partial<Record<"title-prepend" | "title-more-info" | "header-middle-zone" | "actions" | "body", ReactNode[]>>
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

export function DigiGroupDraggableCard(props: DigiGroupDraggableCardProps) {
  return createElement(DigitComponentView, {
    component: "DigiGroupDraggableCard",
    props: props as unknown as Record<string, unknown>,
    children: props.children,
    slots: props.slots,
    style: props.style,
  })
}
