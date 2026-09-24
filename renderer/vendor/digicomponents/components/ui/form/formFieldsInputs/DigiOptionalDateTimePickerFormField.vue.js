import { defineComponent, useModel, openBlock, createBlock, mergeProps, withCtx, createElementVNode, createVNode, unref, createCommentVNode, mergeModels } from "vue";
/* empty css                            */
/* empty css                        */
/* empty css                                   */
/* empty css                                         */
/* empty css                                  */
import _sfc_main$2 from "../../input/datetime/DigiDateTimePicker.vue2.js";
/* empty css                             */
import _sfc_main$1 from "./DigiOptionalFormField.vue.js";
import _sfc_main$3 from "./TimezoneIndicator.vue.js";
const _hoisted_1 = { class: "w-fit" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiOptionalDateTimePickerFormField",
  props: /* @__PURE__ */ mergeModels({
    min: {},
    max: {},
    disabled: { type: Boolean },
    timezone: {},
    state: { type: [Boolean, null] },
    id: {},
    name: {},
    zodSchema: {},
    indications: {},
    label: {},
    description: {},
    placeholder: {},
    required: { type: Boolean },
    context: {}
  }, {
    "modelValue": {},
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["toggleChange"], ["update:modelValue"]),
  setup(__props, { emit: __emit }) {
    const value = useModel(__props, "modelValue");
    const props = __props;
    const emit = __emit;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, mergeProps({
        modelValue: value.value,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => value.value = $event)
      }, { ...props, ..._ctx.$attrs }, {
        onToggleChange: _cache[1] || (_cache[1] = ($event) => emit("toggleChange", $event))
      }), {
        default: withCtx(({ componentField }) => [
          createElementVNode("div", _hoisted_1, [
            createVNode(unref(_sfc_main$2), mergeProps(componentField, {
              timezone: __props.timezone,
              min: __props.min,
              max: __props.max
            }), null, 16, ["timezone", "min", "max"]),
            __props.timezone ? (openBlock(), createBlock(_sfc_main$3, {
              key: 0,
              "local-timezone": __props.timezone
            }, null, 8, ["local-timezone"])) : createCommentVNode("", true)
          ])
        ]),
        _: 1
      }, 16, ["modelValue"]);
    };
  }
});
export {
  _sfc_main as default
};
