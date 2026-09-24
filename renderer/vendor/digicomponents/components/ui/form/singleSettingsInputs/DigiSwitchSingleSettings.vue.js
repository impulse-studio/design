import { defineComponent, useModel, openBlock, createBlock, mergeProps, withCtx, createVNode, unref, normalizeProps, guardReactiveProps, mergeModels } from "vue";
import _sfc_main$2 from "../../switch/DigiSwitch.vue.js";
import _sfc_main$1 from "../DigiSingleSettingRow.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiSwitchSingleSettings",
  props: /* @__PURE__ */ mergeModels({
    save: { type: Function },
    name: {},
    zodSchema: {},
    indications: {},
    label: {},
    mode: {},
    disabled: { type: Boolean },
    required: { type: Boolean },
    placeholder: {}
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
          createVNode(unref(_sfc_main$2), normalizeProps(guardReactiveProps({
            ...componentField,
            modelValue: componentField.modelValue
          })), null, 16)
        ]),
        _: 1
      }, 16, ["modelValue"]);
    };
  }
});
export {
  _sfc_main as default
};
