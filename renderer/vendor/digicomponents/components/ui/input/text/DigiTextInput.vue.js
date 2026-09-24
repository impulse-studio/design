import { defineComponent, useModel, useTemplateRef, openBlock, createBlock, mergeProps, createSlots, withCtx, renderSlot, mergeModels } from "vue";
import BaseInput from "../BaseInput.vue2.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiTextInput",
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
    formatter: {}
  }, {
    "modelValue": {},
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["focusout", "onEnterPressed"], ["update:modelValue"]),
  setup(__props, { expose: __expose, emit: __emit }) {
    const value = useModel(__props, "modelValue");
    const props = __props;
    const emit = __emit;
    const input = useTemplateRef("input");
    function onUpdate(v) {
      if (!v) {
        value.value = "";
        return;
      }
      if (props.formatter) {
        const formattedValue = props.formatter(v);
        value.value = props.formatter(v);
        input.value?.setInputValue(formattedValue);
        return;
      }
      value.value = v;
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
        type: "text",
        "onUpdate:modelValue": onUpdate,
        onFocusout: _cache[0] || (_cache[0] = ($event) => emit("focusout")),
        onOnEnterPressed: _cache[1] || (_cache[1] = ($event) => emit("onEnterPressed"))
      }), createSlots({ _: 2 }, [
        _ctx.$slots.prepend ? {
          name: "prepend",
          fn: withCtx(() => [
            renderSlot(_ctx.$slots, "prepend")
          ]),
          key: "0"
        } : void 0,
        _ctx.$slots.append ? {
          name: "append",
          fn: withCtx(() => [
            renderSlot(_ctx.$slots, "append")
          ]),
          key: "1"
        } : void 0
      ]), 1040, ["model-value"]);
    };
  }
});
export {
  _sfc_main as default
};
