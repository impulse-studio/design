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

export type DigiMultiStepModalFormStepProps = {
  "submitCta"?: string
  "submitCtaVariant"?: null | "destructive" | "primary" | "success" | "secondary" | "ghost" | "link"
  "submitCtaIconName"?: string
  "cancelCta"?: string
  "isLoading"?: false | true
  "disabled"?: false | true
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

export function DigiMultiStepModalFormStep(props: DigiMultiStepModalFormStepProps) {
  return createElement(DigitComponentView, {
    component: "DigiMultiStepModalFormStep",
    props: props as unknown as Record<string, unknown>,
    children: props.children,
    slots: props.slots,
    style: props.style,
  })
}
