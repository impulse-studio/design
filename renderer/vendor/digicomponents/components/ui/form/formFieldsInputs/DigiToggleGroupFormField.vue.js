import { defineComponent, openBlock, createBlock, unref, mergeProps, withCtx, createVNode, renderSlot } from "vue";
/* empty css                            */
/* empty css                             */
import "zod";
import _sfc_main$1 from "../DigiFormFieldContextRenderer.vue.js";
/* empty css                               */
/* empty css                        */
/* empty css                                   */
/* empty css                                         */
/* empty css                                  */
import "../../../../lib/zodSchemas.js";
/* empty css                                        */
import "lodash-es";
import "../../../../external/.pnpm/vue-tel-input@9.6.0_libphonenumber-js@1.13.8_vue@3.5.28_typescript@5.9.3_/external/vue-tel-input/dist/vue-tel-input.js";
/* empty css                                                                                                                                                         */
/* empty css                                   */
import _sfc_main$2 from "../../toggle-group/DigiToggleGroup.vue.js";
/* empty css                              */
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiToggleGroupFormField",
  props: {
    class: {},
    variant: {},
    size: {},
    type: {},
    disabled: { type: Boolean },
    modelValue: {},
    name: {},
    zodSchema: {},
    indications: {},
    label: {},
    description: {},
    placeholder: {},
    required: { type: Boolean },
    context: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), mergeProps(props, {
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => emits("update:modelValue", $event))
      }), {
        default: withCtx(({ componentField }) => [
          createVNode(unref(_sfc_main$2), mergeProps(componentField, {
            "model-value": componentField.modelValue,
            class: props.class,
            variant: __props.variant,
            size: __props.size,
            type: __props.type
          }), {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "default")
            ]),
            _: 3
          }, 16, ["model-value", "class", "variant", "size", "type"])
        ]),
        _: 3
      }, 16);
    };
  }
});
export {
  _sfc_main as default
};
