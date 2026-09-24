import { defineComponent, useModel, openBlock, createBlock, mergeProps, mergeModels } from "vue";
import BaseInput from "../BaseInput.vue2.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiColorInput",
  props: /* @__PURE__ */ mergeModels({
    name: {},
    placeholder: {},
    disabled: { type: Boolean },
    state: { type: [Boolean, null], default: void 0 },
    iconName: {},
    min: {},
    max: {},
    step: {},
    accept: {},
    onChange: {},
    autocomplete: {}
  }, {
    "modelValue": {},
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const value = useModel(__props, "modelValue");
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(BaseInput, mergeProps({
        modelValue: value.value,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => value.value = $event)
      }, props, {
        type: "color",
        class: "color-input w-10",
        "input-class": "px-1"
      }), null, 16, ["modelValue"]);
    };
  }
});
export {
  _sfc_main as default
};
