import { useId } from "../../../external/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/external/reka-ui/dist/shared/useId.js";
import { inject, provide } from "vue";
const FORM_ITEM_INJECTION_KEY = /* @__PURE__ */ Symbol();
function provideFormItemContext() {
  const id = useId();
  const context = {
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`
  };
  provide(FORM_ITEM_INJECTION_KEY, context);
  return context;
}
const FORM_ITEM_CONTEXT_INJECTION_KEY = /* @__PURE__ */ Symbol();
function provideFormFieldContext(context) {
  provide(FORM_ITEM_CONTEXT_INJECTION_KEY, context);
}
function injectFormFieldContext(fallback) {
  const context = inject(FORM_ITEM_CONTEXT_INJECTION_KEY, fallback);
  if (!context) {
    throw new Error(
      "DigiFormFieldContextRenderer must be used inside a component that provide a context"
    );
  }
  return context;
}
export {
  FORM_ITEM_INJECTION_KEY,
  injectFormFieldContext,
  provideFormFieldContext,
  provideFormItemContext
};
