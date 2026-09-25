import { FieldContextKey, useFieldError, useIsFieldTouched, useIsFieldDirty, useIsFieldValid } from "../../../external/.pnpm/vee-validate@5.0.0-beta.0_vue@3.5.28_typescript@5.9.3_/external/vee-validate/dist/vee-validate.js";
import { inject, computed } from "vue";
import { FORM_ITEM_INJECTION_KEY } from "./injectionKeys.js";
function useFormField() {
  const fieldContext = inject(FieldContextKey);
  const fieldItemContext = inject(FORM_ITEM_INJECTION_KEY);
  if (!fieldContext)
    throw new Error("useFormField should be used within <FormField>");
  if (!fieldItemContext)
    throw new Error("useFormField should be used within <FormItem>");
  const { name } = fieldContext;
  const fieldState = {
    valid: useIsFieldValid(name),
    isDirty: useIsFieldDirty(name),
    isTouched: useIsFieldTouched(name),
    error: useFieldError(name)
  };
  return {
    name,
    ...fieldItemContext,
    ...fieldState,
    state: computed(() => {
      if (!fieldState.isTouched.value && !fieldState.isDirty.value) {
        return null;
      }
      return fieldState.valid.value ? null : false;
    })
  };
}
export {
  useFormField
};
