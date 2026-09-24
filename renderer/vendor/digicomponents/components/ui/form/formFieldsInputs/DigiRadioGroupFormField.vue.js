import { defineComponent, useModel, openBlock, createBlock, mergeProps, withCtx, createVNode, unref, createElementBlock, Fragment, renderList, mergeModels } from "vue";
import _sfc_main$1 from "../DigiFormFieldContextRenderer.vue.js";
import _sfc_main$2 from "../../radio-group/DigiRadioGroup.vue.js";
import _sfc_main$3 from "../../radio-group/DigiRadioGroupItem.vue.js";
/* empty css                            */
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiRadioGroupFormField",
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
    options: {},
    orientation: {}
  }, {
    "modelValue": {
      required: true
    },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const value = useModel(__props, "modelValue");
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, mergeProps({
        modelValue: value.value,
        "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => value.value = $event)
      }, { ...props, ..._ctx.$attrs }), {
        default: withCtx(({ componentField }) => [
          createVNode(unref(_sfc_main$2), mergeProps(componentField, {
            modelValue: value.value,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => value.value = $event),
            orientation: props.orientation
          }), {
            default: withCtx(() => [
              (openBlock(true), createElementBlock(Fragment, null, renderList(__props.options, (option) => {
                return openBlock(), createBlock(unref(_sfc_main$3), {
                  key: option.value,
                  value: option.value,
                  label: option.label,
                  disabled: option.disabled
                }, null, 8, ["value", "label", "disabled"]);
              }), 128))
            ]),
            _: 1
          }, 16, ["modelValue", "orientation"])
        ]),
        _: 1
      }, 16, ["modelValue"]);
    };
  }
});
export {
  _sfc_main as default
};
