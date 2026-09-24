import { computed } from "vue";
import { z } from "zod";
import { useReadonlyDefaultTexts } from "../../../../config/composables.js";
import { requiredValidator } from "./requiredValidator.js";
function useFormFieldRules({
  zodSchema,
  required
}) {
  const defaultTexts = useReadonlyDefaultTexts();
  const rules = computed(
    () => {
      if (required.value && zodSchema.value) {
        return zodSchema.value.refine(requiredValidator, {
          message: defaultTexts.value.requiredError
        });
      }
      if (required.value) {
        return z.any().refine(requiredValidator, {
          message: defaultTexts.value.requiredError
        });
      }
      if (zodSchema.value) {
        return zodSchema.value;
      }
      return void 0;
    }
  );
  return { rules };
}
export {
  useFormFieldRules
};
