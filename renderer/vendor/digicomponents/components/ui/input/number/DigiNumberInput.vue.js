import { defineComponent, useModel, useTemplateRef, openBlock, createBlock, mergeProps, withCtx, renderSlot, mergeModels } from "vue";
import BaseInput from "../BaseInput.vue2.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiNumberInput",
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
    autocomplete: {},
    formatter: {},
    enforceBounds: { type: Boolean, default: false }
  }, {
    "modelValue": {},
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props, { expose: __expose }) {
    const value = useModel(__props, "modelValue");
    const props = __props;
    const input = useTemplateRef("input");
    function onUpdate(v) {
      let formattedValue = v === "" ? void 0 : v;
      if (props.enforceBounds) {
        formattedValue = doEnforceBounds(formattedValue);
      }
      if (props.formatter) {
        formattedValue = props.formatter(formattedValue);
      }
      value.value = formattedValue;
      if (formattedValue !== v)
        input.value?.setInputValue(formattedValue?.toString() ?? "");
    }
    function doEnforceBounds(value2) {
      if (value2 === void 0) {
        return void 0;
      }
      let parsedValue = value2;
      if (props.min !== void 0) {
        const numberMin = typeof props.min === "number" ? props.min : parseFloat(props.min);
        parsedValue = Math.max(parsedValue, numberMin);
      }
      if (props.max !== void 0) {
        const numberMax = typeof props.max === "number" ? props.max : parseFloat(props.max);
        parsedValue = Math.min(parsedValue, numberMax);
      }
      return parsedValue;
    }
    __expose({
      setInputValue(v) {
        input.value?.setInputValue(v);
      },
      focus() {
        input.value?.focus();
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(BaseInput, mergeProps(props, {
        ref_key: "input",
        ref: input,
        "model-value": value.value,
        type: "number",
        "onUpdate:modelValue": onUpdate
      }), {
        append: withCtx(() => [
          renderSlot(_ctx.$slots, "append")
        ]),
        prepend: withCtx(() => [
          renderSlot(_ctx.$slots, "prepend")
        ]),
        _: 3
      }, 16, ["model-value"]);
    };
  }
});
export {
  _sfc_main as default
};
