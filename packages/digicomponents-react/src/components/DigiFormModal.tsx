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

export type DigiFormModalProps = {
  "title": string
  "description"?: string
  "cancelCta"?: string
  "submitCta"?: string
  "submitCtaVariant"?: null | "destructive" | "primary" | "success" | "secondary" | "ghost" | "link"
  "submitCtaIconName"?: string
  "isLoading"?: false | true
  "hideCancelButton"?: false | true
  "disabled"?: false | true
  "scrollable"?: false | true
  "size"?: "sm" | "md" | "lg"
  "hideCloseButton"?: false | true
  children?: ReactNode
  slots?: Partial<Record<"default" | "footer-left", ReactNode[]>>
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

export function DigiFormModal(props: DigiFormModalProps) {
  return createElement(DigitComponentView, {
    component: "DigiFormModal",
    props: props as unknown as Record<string, unknown>,
    children: props.children,
    slots: props.slots,
    style: props.style,
  })
}
