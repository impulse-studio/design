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

export type DigiFileFormFieldProps = {
  "name": string
  "zodSchema"?: unknown
  "indications"?: string
  "label": string
  "description"?: string
  "placeholder"?: string
  "disabled"?: false | true
  "required"?: false | true
  "context"?: "modal" | "card" | "nude"
  "acceptedFileTypes"?: string
  "maxSizeInMb"?: number
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

export function DigiFileFormField(props: DigiFileFormFieldProps) {
  return createElement(DigitComponentView, {
    component: "DigiFileFormField",
    props: props as unknown as Record<string, unknown>,
    children: props.children,
    slots: props.slots,
    style: props.style,
  })
}
