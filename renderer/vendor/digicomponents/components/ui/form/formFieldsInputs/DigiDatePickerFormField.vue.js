import { defineComponent, useModel, openBlock, createBlock, mergeProps, withCtx, createVNode, unref, mergeModels } from "vue";
import _sfc_main$1 from "../DigiFormFieldContextRenderer.vue.js";
/* empty css                            */
/* empty css                        */
/* empty css                                   */
/* empty css                                         */
import _sfc_main$2 from "../../input/date/DigiDatePicker.vue2.js";
/* empty css                                  */
/* empty css                             */
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiDatePickerFormField",
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
    min: {},
    max: {},
    timezone: {}
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
          createVNode(unref(_sfc_main$2), mergeProps(componentField, {
            min: __props.min,
            max: __props.max,
            timezone: __props.timezone,
            required: __props.required
          }), null, 16, ["min", "max", "timezone", "required"])
        ]),
        _: 1
      }, 16, ["modelValue"]);
    };
  }
});
export {
  _sfc_main as default
};
