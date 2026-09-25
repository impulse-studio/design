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

export type DigiMultiStepModalInfoStepProps = {
  "submitCta"?: string
  "submitCtaVariant"?: null | "destructive" | "primary" | "success" | "secondary" | "ghost" | "link"
  "submitCtaIconName"?: string
  "cancelCta"?: string
  "hideCancelButton"?: false | true
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

export function DigiMultiStepModalInfoStep(props: DigiMultiStepModalInfoStepProps) {
  return createElement(DigitComponentView, {
    component: "DigiMultiStepModalInfoStep",
    props: props as unknown as Record<string, unknown>,
    children: props.children,
    slots: props.slots,
    style: props.style,
  })
}
