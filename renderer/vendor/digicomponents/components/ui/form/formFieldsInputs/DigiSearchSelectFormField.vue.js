import { defineComponent, useModel, openBlock, createBlock, mergeProps, withCtx, createVNode, unref, createSlots, renderSlot, mergeModels } from "vue";
import _sfc_main$1 from "../DigiFormFieldContextRenderer.vue.js";
import _sfc_main$2 from "../../select/DigiSearchSelect.vue.js";
import "lodash-es";
/* empty css                            */
/* empty css                             */
/* empty css                                        */
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiSearchSelectFormField",
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
  emits: /* @__PURE__ */ mergeModels(["open"], ["update:modelValue"]),
  setup(__props, { emit: __emit }) {
    const value = useModel(__props, "modelValue");
    const props = __props;
    const emit = __emit;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, mergeProps({
        modelValue: value.value,
        "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => value.value = $event)
      }, props), {
        default: withCtx(({ componentField }) => [
          createVNode(unref(_sfc_main$2), mergeProps({
            ...componentField,
            ...__props.selectProps,
            modelValue: value.value,
            valuePlaceholder: componentField.placeholder
          }, {
            onOpen: _cache[0] || (_cache[0] = ($event) => emit("open"))
          }), createSlots({
            "popover-header": withCtx(() => [
              renderSlot(_ctx.$slots, "popover-header")
            ]),
            "append-item": withCtx(({ option }) => [
              renderSlot(_ctx.$slots, "append-item", { option })
            ]),
            _: 2
          }, [
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
          ]), 1040),
          renderSlot(_ctx.$slots, "bottom")
        ]),
        _: 3
      }, 16, ["modelValue"]);
    };
  }
});
export {
  _sfc_main as default
};
