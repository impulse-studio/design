import { defineComponent, useModel, openBlock, createBlock, mergeProps, withCtx, createVNode, unref, normalizeProps, guardReactiveProps, mergeModels } from "vue";
import _sfc_main$1 from "../DigiFormFieldContextRenderer.vue.js";
/* empty css                            */
/* empty css                        */
/* empty css                                   */
/* empty css                                         */
import _sfc_main$2 from "../../input/time/DigiTimePicker.vue3.js";
/* empty css                                  */
/* empty css                             */
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiTimePickerFormField",
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
    iconName: {}
  }, {
    "modelValue": {},
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
          createVNode(unref(_sfc_main$2), normalizeProps(guardReactiveProps(componentField)), null, 16)
        ]),
        _: 1
      }, 16, ["modelValue"]);
    };
  }
});
export {
  _sfc_main as default
};
