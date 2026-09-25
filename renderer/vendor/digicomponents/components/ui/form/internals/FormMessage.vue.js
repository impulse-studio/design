import { defineComponent, openBlock, createBlock, unref, toValue } from "vue";
import { ErrorMessage } from "../../../../external/.pnpm/vee-validate@5.0.0-beta.0_vue@3.5.28_typescript@5.9.3_/external/vee-validate/dist/vee-validate.js";
import { useFormField } from "../useFormField.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "FormMessage",
  setup(__props) {
    const { name, formMessageId } = useFormField();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(ErrorMessage), {
        id: unref(formMessageId),
        as: "p",
        name: toValue(unref(name)),
        class: "text-destructive text-sm font-medium"
      }, null, 8, ["id", "name"]);
    };
  }
});
export {
  _sfc_main as default
};
