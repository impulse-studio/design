import { defineComponent, useModel, openBlock, createBlock, mergeProps, withCtx, createVNode, normalizeProps, guardReactiveProps, renderSlot, mergeModels } from "vue";
import _sfc_main$1 from "../DigiFormFieldContextRenderer.vue.js";
import _sfc_main$2 from "../../select/font/DigiFontSearchSelect.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiFontSearchSelectFormField",
  props: /* @__PURE__ */ mergeModels({
    name: {},
    zodSchema: {},
    indications: {},
    label: {},
    description: {},
    placeholder: {},
    disabled: { type: Boolean },
    required: { type: Boolean },
    context: {},
    selectProps: {}
  }, {
    "modelValue": { required: true },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const value = useModel(__props, "modelValue");
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, mergeProps({
        modelValue: value.value,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => value.value = $event)
      }, props), {
        default: withCtx(({ componentField }) => [
          createVNode(_sfc_main$2, normalizeProps(guardReactiveProps({
            ...componentField,
            ...__props.selectProps,
            modelValue: value.value,
            valuePlaceholder: componentField.placeholder
          })), null, 16),
          renderSlot(_ctx.$slots, "append")
        ]),
        _: 3
      }, 16, ["modelValue"]);
    };
  }
});
export {
  _sfc_main as default
};
