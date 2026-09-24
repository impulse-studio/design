import { defineComponent, useTemplateRef, computed, openBlock, createBlock, unref, withCtx, renderSlot } from "vue";
import { Form } from "../../../node_modules/.pnpm/vee-validate@5.0.0-beta.0_vue@3.5.28_typescript@5.9.3_/node_modules/vee-validate/dist/vee-validate.js";
import { provideFormFieldContext } from "./injectionKeys.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiNudeForm",
  props: {
    context: {},
    id: {}
  },
  emits: ["submit"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emits = __emit;
    provideFormFieldContext(props.context ?? "nude");
    const nudeForm = useTemplateRef("nudeForm");
    const isValid = computed(() => nudeForm.value?.meta.valid);
    __expose({
      isValid,
      validate: () => {
        return nudeForm.value?.validate();
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Form), {
        id: __props.id,
        ref_key: "nudeForm",
        ref: nudeForm,
        onSubmit: _cache[0] || (_cache[0] = ($event) => emits("submit"))
      }, {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 8, ["id"]);
    };
  }
});
export {
  _sfc_main as default
};
